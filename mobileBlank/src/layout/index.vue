<template>
	<div class="main-wrap">

		<div class="main-content " :class="{ 'user-pc': !ISMOBILE }">

			<div class="title-wrap independent hidden">
				<topFunction />
				<div class="machine-select">
					<el-select v-model="selectValue" placeholder="请选择机器" size="large">
						<el-option v-for="(item, index) in listMachine" :key="item.mid" :label="item.name"
							:value="index" />
					</el-select>
					<overlay :show="true" />
				</div>
			</div>


			<div class="table-wrap" ref="tableWrap">
				<div class="content" :style="translateX">
					<machine v-for="item in listMachine" :key="item.mid" :data="item" :nextOrder="nextOrder"
						:clickDeleOrder="clickDeleOrder" :init="init" :autoButton="autoButton" />
				</div>
				<latex v-model="listMachine" v-if="latexShow" />
			</div>

			<bottom />
		</div>


		<el-dialog v-model="dialogVisible">
			<el-form @submit.prevent ref="formRef">
				<el-form-item label="设置定时">
					<el-input v-model.number="timing" /><span style="margin-left:10px;">分</span>
				</el-form-item>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="startTime(init)">确定</el-button>
				</span>
			</template>
		</el-dialog>

		<el-dialog v-model="dialogTail">

			<el-form @submit.prevent ref="tailForm">
				<el-form-item label="尾料数量" :error="tailerror">
					<el-input v-model.number="tailing" :type="'number'" ref="input" @keydown.stop.enter="switchTail" />
					<span style="margin-left:10px;">份</span>
				</el-form-item>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogTail = false">取消</el-button>
					<el-button type="primary" @click="switchTail">确定</el-button>
				</span>
			</template>
		</el-dialog>

	</div>
</template>

<script setup lang="ts">
import latex from "./components/latex.vue"
import overlay from "@/components/overlay.vue"
import machine from "./components/machine.vue"
import bottom from "./components/bottom.vue"
import topFunction from "./components/topFunction.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, watch, defineProps, computed, getCurrentInstance, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElSelect, ElOption, ElIcon, ElLoading, ElDialog, ElForm, ElInput, ElFormItem, ElButton } from 'element-plus'


import type { order, machineInfo, machineList } from "@/layout/module";
import { deleOrder, addtail } from "@/api/index"
import { getButtonAuto } from "@/utils/auto"

import { latexShow } from "@/layout/hooks/userlatex"
import { startTime, clearTime, timing, dialogVisible } from "@/layout/hooks/usetTime"

import userData from "@/layout/hooks/userData"
import userTail from "@/layout/hooks/userTail"


const { dialogTail, tailForm, tailing, tailerror } = userTail();
const { listMachine, nextOrder, selectValue, showOverlay, ISMOBILE, autoButton, offsetIndex, switchOverlay, init, getNextOrder } = userData();


const input = ref();
let loading: any;


const translateX = computed(() => {

	const temp = offsetIndex.value == -1 ? 0 : offsetIndex.value;
	return {
		transform: `translateX(${temp * -100}%)`
	}
})

watch(selectValue, (value) => {
	offsetIndex.value = value;
})


/**
 * 遮罩层的开关
 */
watch(showOverlay, (value) => {
	if (value) {
		loading = ElLoading.service({
			lock: true,
			text: '正在提交',
			background: 'rgba(0, 0, 0, 0.7)',
		})
	} else {
		loading.close();
	}
})


watch(dialogTail, (value) => {
	if (!value) { return; }

	dialogTail.value = true;
	tailerror.value = "";
	tailing.value = "";

	setTimeout(() => {

		input.value.focus();

	}, 0)

})

/**
 * 补料弹窗
 */
async function switchTail() {

	if (tailing.value <= 0) {
		return tailerror.value = "必须大于0"
	}


	switchOverlay(true);
	const count = tailing.value;
	try {

		await addtail(nextOrder.value.seq, count);

		getNextOrder();

		listMachine.find((elem) => {
			if (elem.mid == 999) {
				elem.order.push.apply(elem.order, [nextOrder.value]);
			}

		})

		nextTick(() => {
			/**
			 * 这里必须给window获取焦点，不然回车按下确定数量后。补料按钮还是会触发点击事件
			 */
			window.focus();
			dialogTail.value = false;
		})

	} catch (error) {
		init();
	}

}



/**
 * 指定机器删除指定订单
 */
async function clickDeleOrder(match: machineInfo, index: number) {
	switchOverlay(true);

	try {
		await deleOrder(match.mid, match.order[index].seq);

		match.order.splice(index, 1);

		getNextOrder();

	} catch (error) {
		switchOverlay(false);
	}
}


init();

</script>

<script lang="ts">
export default {
	name: "index"
}
</script>

<style lang="scss">
.main-wrap {
	width: 100%;
	height: 100%;

	box-sizing: border-box;

	.main-content {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;

		padding: 0 10px;
		box-sizing: border-box;
	}


	.machine-select {
		.overlay {
			opacity: 0;
		}
	}


	.title-wrap {
		width: 100%;
		padding: 10px 0px;
		box-sizing: border-box;
		text-align: center;

		display: flex;
		justify-content: space-around;
		color: #03c;

		&.hidden {
			height: 0;
			overflow: hidden;
			opacity: 0;
		}

		.function {
			display: flex;
			align-items: center;
			justify-content: space-around;

			width: 70px;


			.activation {
				color: blue;
			}
		}

	}

	.table-wrap {
		position: relative;

		flex: 1;
		overflow: hidden;

		white-space: nowrap;
		box-sizing: border-box;

		box-shadow: var(--el-box-shadow-light);


		.content {
			width: 100%;
			height: 100%;
			transition: all 0.3s;

		}

		.machine {
			display: inline-block;
			width: 100%;
			height: 100%;
			overflow-y: auto;

			padding: 10px 10px;
			padding-top: 0px;
			box-sizing: border-box;

			.machine-content {

				.title-wrap,
				.button-wrap {
					display: none;
				}
			}
		}

		.item {
			margin-top: 10px;

			.title {
				text-align: center;
				height: 26px;
				line-height: 26px;
				background-color: #b5d8fb;
				color: red;
			}

			&.isdone {

				.title,
				.detailed {
					background-color: #ffe3c8;
				}
			}

			.detailed {
				height: 34px;
				line-height: 34px;
				background-color: #b5d8fb;
				padding: 0 5px;

				display: flex;
				justify-content: space-between;
				align-items: start;

				.cancel {
					height: 80%;

					button {
						height: 100%;
						padding: 1px 8px;
					}
				}
			}
		}


	}

	.button-wrap {
		width: 100%;

		margin: 10px 0;
		box-sizing: border-box;

		display: flex;

		.order-button {
			flex: 1;

			line-height: 25px;
			display: block;

			padding: 5px;
			text-align: left;

			font-size: 12px;

			height: auto;

		}

		.order-other {
			width: 25%;



			.other-item {
				height: 50%;
				padding: 5px;
				padding-right: 0;
				padding-top: 0;
				box-sizing: border-box;

				&:last-child {
					padding-bottom: 0;
				}

				button {
					width: 100%;
					height: 100%;
				}

				.tail-item {
					flex: 1
				}
			}


		}

		.no-order {
			height: 150px;
			line-height: 150px;
			text-align: center;
		}
	}


	// PC端打开样式用这个，上面的都是移动端
	.main-content.user-pc {
		.independent {

			&.title-wrap,
			&.button-wrap {
				display: none;


			}
		}

		.table-wrap {
			overflow: inherit;
			overflow-y: hidden;

			box-shadow: none;
		}

		.machine {

			min-width: 350px;
			max-width: 400px;

			.machine-content {
				display: flex;
				height: 100%;
				flex-direction: column;

				.title-wrap {
					display: flex;

					.name {
						flex: 1;
						align-content: center;
						line-height: 45px;
					}
				}


				.button-wrap {
					display: flex;
				}


				.item-content {
					overflow: auto;
					flex: 1;
					box-shadow: var(--el-box-shadow-light);
					padding: 0 10px;
					padding-bottom: 10px;

				}

			}
		}


		.order-other {



			.other-item {
				&.jiugong {
					display: none;
				}


				&.tail-item {
					height: 100%;
				}
			}


		}
	}



}

.el-button:focus {
	color: var(--el-button-text-color);
	border: var(--el-border);
	border-color: var(--el-button-border-color);
	background: var(--el-button-bg-color);
}

.el-dialog__headerbtn {
	display: none !important;
}

.el-dialog__body {
	padding: 10px 20px !important;
}

.el-form-item__content {
	flex-wrap: nowrap !important;
}

.el-overlay-dialog .el-input {
	flex: 1;
}
</style>

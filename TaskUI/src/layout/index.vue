<template>
	<div class="main-wrap">
		<div class="main-content">
			<h3 class="title">工单扫码</h3>

			<div class="form">
				<el-form ref="ruleFormRef" :model="ruleForm">
					<el-form-item label="申报人员" prop="pass">
						<el-input v-model="ruleForm.name" />
						<overlay :show="true" style="opacity: 0 !important;" />
					</el-form-item>

					<el-form-item label="工单条码" prop="checkPass">
						<div class="task-id">
							<el-input v-model="ruleForm.barcode" autocomplete="off" :disabled="!manual" />
							<el-button type="primary" @click="clickBarcode" v-if="manual">查询</el-button>
						</div>
					</el-form-item>
					<el-form-item label="工单单号" prop="checkPass">
						<el-input v-model="ruleForm.order" />
						<overlay :show="true" style="opacity: 0 !important;" />
					</el-form-item>
					<el-form-item label="工艺名称" prop="checkPass">
						<el-input v-model="ruleForm.taskname" />
						<overlay :show="true" style="opacity: 0 !important;" />
					</el-form-item>
					<el-form-item class="task-action" v-if="action.length > 0">
						<el-button type="primary" v-for="name in action" :key="name" :class="{ 'disabled': disabled }"
							@click="clickSetaction(name)">{{ name }}</el-button>
					</el-form-item>
					<el-form-item label="下道工艺" class="next-action" v-if="next">
						<el-tag size="large">{{ next }}</el-tag>
					</el-form-item>
				</el-form>
			</div>
			<div class="scanning-wrap">
				<el-button type="primary" @click="scanning" class="scanning-button">扫描</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import overlay from "@/components/overlay.vue"

import { ref, reactive, nextTick, defineProps, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElMessage } from 'element-plus'

import { getUserName } from "@/store/user"
import { getbarcode, setaction } from "@/api/task"


type scanResult = {
	text: string
};


const ruleForm = reactive({
	order: "",
	name: getUserName(),
	barcode: "",
	taskname: "",
	textarea: "",
	id: ""
})
const disabled = ref(false);
const action = ref([]);
const next = ref('');


const manual = ref(true && process.env.NODE_ENV != "production");



function scanning() {

	new Promise((resolve, reject) => {
		window.dd.biz.util.scan({
			type: "all"
		}).then(resolve, reject)
	}).then((data) => {

		const { text } = data as scanResult;

		if (text == "" || new RegExp("\\W", "g").test(text)) {

			ruleForm.id = "";
			ruleForm.barcode = ""
			ruleForm.taskname = "";

			disabled.value = false;
			action.value = [];

			return ElMessage.error('内容有误，请重新扫码')
		}

		ruleForm.barcode = text;

		clickBarcode();

	}).catch((error) => {
		/**
		 * 错误代码 10 就是用户手动取消了扫码
		 */
		if (error.errorCode != 10) {
			ElMessage.error('扫码错误，请重试！')
		}

	})

}


async function clickBarcode() {
	const { barcode } = ruleForm;
	try {
		const result: any = await getbarcode(barcode);

		ruleForm.id = result.id;
		ruleForm.order = result.order;
		ruleForm.taskname = result.name;

		disabled.value = false;


		action.value = result.action;

	} catch (err: any) {

		ruleForm.id = "";
		ruleForm.taskname = "";
		ruleForm.order = "";
		action.value = [];

		ElMessage.error(err.msg)
	} finally {
		next.value = "";
	}

}

async function clickSetaction(action: string) {
	if (disabled.value) { return }

	const { id } = ruleForm;

	try {
		const result: any = await setaction(id, ruleForm.name, action, ruleForm.order, ruleForm.taskname);
		next.value = result.action;
		disabled.value = true;

		ElMessage({
			message: '提交成功',
			type: 'success',
		})

	} catch (err: any) {
		ElMessage.error(err.msg)
	}

}


</script>

<style lang="scss">
@media screen and (max-width: 425px) {
	.el-message {
		min-width: 90% !important;
	}
}


.main-wrap {
	width: 100%;
	height: 100%;

	padding: 10px;

	box-sizing: border-box;

	.main-content {
		width: 100%;
		height: 100%;
		border-radius: 5px;
		display: flex;
		flex-direction: column;


	}

	.title {
		height: 50px;
		line-height: 50px;
		text-align: center;
		color: #fff;
		border-radius: 5px;
		margin-bottom: 10px;
		background-color: #66b1ff;

	}

	.form {
		box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
		padding: 10px;
		margin-bottom: 20px;

		* {
			font-weight: bold !important;
			font-size: 108% !important;
		}


	}

	.task-id {
		flex: 1;
		display: flex;


		.el-input__wrapper {
			width: 100%;
			flex: 1;
		}

		button {
			margin-left: 10px;
		}


	}

	.task-action {
		margin-bottom: 20px;

		.el-button {
			margin-right: 10px;
			margin-bottom: 10px;
		}

		.el-button+.el-button {
			margin-left: 0px;
		}


		.disabled {
			background-color: #f5f7fa;
			border-color: #e4e7ed;
			color: #c0c4cc;
		}

		.el-form-item__content {
			display: flex;
			justify-content: space-between;

			button {
				width: 48%;
				margin: 0;
				height: 70px;
				margin-bottom: 20px;
			}
		}


	}

	textarea {
		resize: none;
	}

	.scanning-wrap {
		margin-top: 20px;
		height: 100px;
		width: 100%;
		border-radius: 100%;
		display: flex;
		justify-content: center;

		.scanning-button {
			width: 100px;
			height: 100px;
			border-radius: 100%;
		}


	}

}
</style>

<template>
	<div>
		<div class="show-wrap">
			<div class="weeks">
				<div class="week-text" :class="{ 'is-active': index == selectWeek }" v-for="(item, index) in monthData"
					:key="WeekText[index]" @click="ClickSelectWeek(index)">
					<badge :dot="!isErrorWeek(item)">
						<span>{{ WeekText[index] }}周</span>
					</badge>
				</div>
			</div>
			<div class="nail"></div>
			<div class="calendar" v-for="(item, index) in monthData" :key="index" v-show="selectWeek == index">
				<day v-for="(dayData, location) in item" :key="location" :data="dayData" />
			</div>
			<div class="nail"></div>

		</div>
		<div class="check" :class="{ 'checkAll': checkAll && checkConfirm.every((value) => value) }">

			<button v-if="checkFail" @click="getWeekStatus(selectWeek)" class="error">重新获取状态</button>
			<button v-if="completeWeek" class="error">本周未完</button>

			<template v-else>
				<div class="button-wrap">
					<template v-if="!checkConfirm[selectWeek]">
						<div style="display: flex; height: 100%;">
							<button @click="clickCheck(true)">确定核对</button>
							<button v-if="!isErrorWeek(monthData[selectWeek])" @click="to" class="info"
								style="margin-left: 10px;">跳转补卡</button>
						</div>
					</template>
					<button v-else @click="clickCheck(false)">取消核对</button>
				</div>

				<div class="button-wrap all">
					<button class="all-check">本月已核对</button>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import day from "@/layout/components/day.vue"

import type { WorkTables, WorkTable, weekThe } from "@/layout/module"

import { Badge } from "vant";


import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, computed, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { Toast, Dialog, Tag } from "vant";
import { getWeekState, setWeekState } from "@/api/data"
import { getUserEmpId } from "@/utils/auto"

import moment from "moment";



const Props = defineProps<{
	/**
	 * 周表
	 */
	week: Array<weekThe>,
	/**
	 * 打卡数据
	 */
	monthData: WorkTables
	/**
	 * 本月是否全部核对
	 */
	checkAll: boolean
}>()

const selectWeek = ref(0);
const empid = getUserEmpId();
const WeekText = "一_二_三_四_五_六".split("_");

const checkFail = ref(false);
const failDate = ref(false);

const checkConfirm = reactive<Array<boolean | undefined>>(Props.monthData.map((elem) => {
	return Props.checkAll || undefined;
}));
const completeWeek = computed(() => {
	const days = moment().diff(Props.week[selectWeek.value].end, "days");

	return days < 0
});


/**
 * 判断某个星期是否有异常数据
 */
function isErrorWeek(week: WorkTable[]) {
	const nowMoment = moment();
	const year = nowMoment.format('YYYY');
	const nowTime = nowMoment.format('YYYY-MM-DD');

	// 当天是百分百异常的，但是需要把它给过滤掉
	return week.every((elem) => {
		return !elem.error || moment(`${year}-${elem.time}`).format('YYYY-MM-DD') == nowTime;
	})

}




/**
 * 确定核对某个星期
 */
const clickCheck = async (state: boolean | number) => {

	try {
		state = state ? 1 : 0;

		if (state == 1 && !isErrorWeek(Props.monthData[selectWeek.value])) {
			await Dialog.alert({
				message: '本周工时有异常,请先找领导确定再进行核对',
			});
			return
		}

		const message = ["确认取消本周考勤核对", "确认核对本周考勤？"][state]

		await Dialog.confirm({ message })
	} catch (error) {
		return;
	}

	const toast = Toast.loading({
		duration: 0,
		forbidClick: true,
		message: '正在提交操作',
	});

	try {

		const index = selectWeek.value;
		const start = Props.week[index].start.format('YYYY-MM-DD');
		const end = Props.week[index].end.format('YYYY-MM-DD');

		await setWeekState(empid, start, end, state);
		checkConfirm[index] = !!state;

		checkFail.value = false;
		toast.clear();


	} catch (error: any) {
		toast.clear();
		Toast.fail({
			duration: 2000,
			forbidClick: true,
			message: error.message || '提交失败，请重试',
		});
	}
}

/**
 * 某个星期被选择
 */
const ClickSelectWeek = async (index: number) => {
	if (index === selectWeek.value) {
		return;
	}

	checkFail.value = false;
	if (checkConfirm[index] === undefined) {
		await getWeekStatus(index);
	}



	selectWeek.value = index;
}

/**
 * 获取某个星期的核对状态
 * @param index 
 */
const getWeekStatus = async (index: number) => {
	if (Props.checkAll) { return; }


	const startMoment = Props.week[index].start;
	const endMoment = Props.week[index].end;
	const nowMoment = moment();

	if (startMoment.diff(nowMoment, "days") > 0) {
		failDate.value = true;
		return;
	}


	const toast = Toast.loading({
		duration: 0,
		forbidClick: true,
		message: '获取本周状态',
	});

	try {

		const start = startMoment.format('YYYY-MM-DD');
		const end = endMoment.format('YYYY-MM-DD');

		const { state } = await getWeekState(empid, start, end) as any;

		checkConfirm[index] = state;
		checkFail.value = false;
		toast.clear();


	} catch (error) {
		toast.clear();
		Toast.fail({
			duration: 1000,
			forbidClick: true,
			message: '获取状态失败，请重试',
		});

		checkFail.value = true;
	}
}


function to() {
	const href = "dingtalk://dingtalkclient/action/openapp?app_id=-4&container_type=work_platform&corpid={{corpid}}&ddtab=true&redirect_type=jump&redirect_url=https%3A%2F%2Faflow.dingtalk.com%2Fdingtalk%2Fmobile%2Fhomepage.htm%3FappUuid%3D{{corpid}}%26back_control%3Dfalse%26backcontrol%3Dfalse%26corpid%3D{{corpid}}%26dd_progress%3Dfalse%26dd_share%3Dfalse%26ddtab%3Dtrue%26showmenu%3Dfalse%23%2Fcustom%3Fpcredirect%3Dself%26processCode%3DPROC-FF6YHERSO2-8I2FFQ6AOZ7NIZSN98CT1-MAKKOKUI-2Z"

	location.href = href.replace(/{{corpid}}/g, window.urlSearch.corpId)
}


getWeekStatus(0)


</script>

<script lang="ts">
export default {
	name: ""
}
</script>

<style lang="scss">
.check {
	height: 50px;
	display: flex;
	justify-content: space-between;

	&.checkAll {
		.button-wrap {
			width: 49%;

			&.all {
				display: block;
			}
		}
	}

	.button-wrap {
		width: 100%;

		&.all {
			display: none;
		}
	}


	button {
		box-sizing: border-box;
		width: 100%;
		height: 100%;

		color: #409eff;
		background: #ecf5ff;
		border: 1px solid #b3d8ff;
		border-radius: 5px;

	}

	.all-check {
		color: #fff;
		background-color: #f56c6c;
		border-color: #f56c6c;
	}

	.succes {
		color: #fff;
		background-color: #67c23a;
		border-color: #67c23a;
	}

	.error {
		color: #fff;
		background-color: #e6a23c;
		border-color: #e6a23c;
	}

	.info {
		color: #fff;
		background-color: #909399;
		border-color: #909399;
	}
}

.show-wrap {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: auto;
	margin-bottom: 10px;
	border-radius: 5px;


	.nail {
		height: 8px;
		background-color: white;
	}

	.weeks {
		display: flex;
		background-color: #f5f7fa;

		color: #909399;



		.week-text {
			flex: 1;
			text-align: center;
			padding: 10px;



			&.is-active {
				color: #409eff;
				background-color: white;
			}

			.van-badge--top-right {
				transform: translate(120%, 0%) scale(0.7);
			}


		}

	}

	.calendar {
		flex: 1;
		background-color: white;
		padding: 0 10px;

		overflow: auto;


		.cart-wrap:last-of-type {
			margin: 0;
		}
	}

}
</style>

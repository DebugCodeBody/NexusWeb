<template>
	<div class="main-wrap">
		<div class="main-content">
			<div class="summary">
				<h4 class="month">
					<span>{{ month< 0? 12 : (month + 1) }}月汇总</span>
					<span>{{ getCompanyTitle() }}</span>
					<Tag plain type="primary" size="medium" @click="clickNowMonth" v-if="!isNow">本月</Tag>
					<Tag plain type="primary" size="medium" @click="clickLastMonth" v-else>上个月</Tag>
				</h4>

				<div class="type">
					<div class="module">
						<h1 class="amount">{{ line.work }}</h1>
						<div>总加班工时(小时)</div>
					</div>
					<div class="module">
						<h1 class="amount">{{ line.buckle }}</h1>
						<div>伙食补贴(元)</div>
					</div>
				</div>
			</div>

			<div style="flex:1" v-if="networkError">
				<empty image="error">
					<Button type="primary" @click="getMonthData">重新获取</Button>
				</empty>
			</div>

			<template v-if="!networkError">
				<monthElem class="month-wrap" 
					v-for="(itme, index) in dataWrap" 
					:key="index" 
					:week="itme.week"
					:monthData="itme.data" 
					:checkAll="itme.isCheckAll" 
					v-show="selct == index" />
			</template>

		</div>
	</div>
</template>

<script setup lang="ts">
import director from "./components/director.vue"
import monthElem from "./components/month.vue"

import type { WorkTables, WorkTable } from "@/layout/module"

import { ref, reactive, nextTick, defineProps, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { Toast, Tag, Empty, Button } from "vant";

import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/tag/style';
import 'vant/es/empty/style';

import { getDate } from "@/api/data"
import { getUserEmpId } from "@/utils/auto"
import { getMonthAllWeek } from "@/utils/moment"

import bigjs from "big.js";



function getCompanyTitle() {

	if (window.urlSearch.corpId == "dingf2f1e9ca1da23dff") {
		return "耐萨斯"
	} else {
		return "新精创"
	}


}


/**
 * 进入首页默认显示上一个月的记录
 * 原生Date 和 moment().month() 取出来的月份都是要加一
 */
const month = ref(0);
const monthArr = reactive<Array<number>>([]);

const isNow = ref(false)
const networkError = ref(false)

const empid = getUserEmpId();
const dataWrap = reactive<any>([]);


const selct = computed(() => {
	return isNow.value ? 1 : 0;
})


const line = computed(() => {
	const index = selct.value;

	try {
		return {
			work: dataWrap[index].work,
			buckle: dataWrap[index].buckle,
		}
	} catch (error) {
		return {
			work: 0,
			buckle: 0,
		}
	}

})


/**
 * 切换到下一个月
 */
const clickNowMonth = () => {
	month.value = new Date().getMonth();
	if (monthArr.includes(month.value)) {
		return isNow.value = true;
	}

	getMonthData().then(() => {
		isNow.value = true;
	});

}
/**
 * 切换到上一个月
 */
const clickLastMonth = () => {
	month.value = new Date().getMonth() - 1;
	if (monthArr.includes(month.value)) {
		return isNow.value = false;
	}
	getMonthData().then(() => {
		isNow.value = false;
	});
}


/**
 * 获取考勤数据
 */
const getMonthData = async () => {

	try {


		debugger;
		const { result, allcheck } = await getDate(empid, month.value) ;

		const week = getMonthAllWeek(month.value);
		const dycap = [] as WorkTables;
		let work = bigjs(0);
		let buckle = bigjs(0);
		let allowance = bigjs(0);


		let index = 0;
		week.forEach(({ start, end, day }) => {
			const silce = result.slice(index, index + day);

			dycap.push(silce)

			silce.forEach((elem) => {
				work = work.add(bigjs(elem.work));
				buckle = buckle.add(bigjs(elem.buckle));
				allowance = allowance.add(bigjs(elem.allowance));
			})


			index += day;
		});





		dataWrap.push({

			week: week,
			data: dycap,
			isCheckAll: allcheck,
			work: work.toNumber(),
			buckle: buckle.toNumber()

		});

		monthArr.push(month.value);
		networkError.value = false;

	} catch (error: any) {
		networkError.value = true;

		Toast.fail(error.message);

	}

}



clickLastMonth();


</script>

<style lang="scss">
a,
input,
button {
	outline: none;
	-webkit-tap-highlight-color: rgba(255, 255, 255, 0);
	-webkit-focus-ring-color: rgba(0, 0, 0, 0);
}

.main-wrap {
	width: 100%;
	height: 100%;

	padding: 10px;
	box-sizing: border-box;

	.main-content {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
	}

}

.director {
	margin-bottom: 10px;
}

.month-wrap {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}


.summary {
	background-color: white;
	margin-bottom: 10px;
	border-radius: 5px;
	padding: 10px;
	padding-top: 5px;


	.month {
		display: block;
		margin-bottom: 5px;
		display: flex;
		justify-content: space-between;
	}

	.type {
		display: flex;

		.module {
			width: 50%;
			padding: 5px;
			text-align: center;

			div {
				color: #909399;
				font-size: 14px;
			}

			.amount {
				margin-bottom: 5px;
				font-size: 20px;
			}
		}

	}
}
</style>

<template>
	<view class="content flex flex-col">

		<div class="flex-1 ">

			<view v-if="uiType == 1">
				<div class="class-type" v-for="tagItem in tag" :key="tagItem.title">
					<div @click="onClickTitle(tagItem)" class="item__header" :class="{
						'is-active': tagItem.open
					}">
						<label class="title">{{ tagItem.title }}</label>
					</div>
					<div class="item__content" v-if="tagItem.open">
						<div class="flex">
							<view class="button-item" v-for="item in tagItem.item" :key="item.name" @click="toPage(item)">
								<text>{{ item.name }}</text>
							</view>
						</div>
					</div>
				</div>

			</view>
			<user-info v-if="uiType == 2" />
		</div>
		<view class="cu-bar tabbar bg-white shadow ">
			<view class="action" @click="uiType = 1" :class="[uiType == 1 ? 'active' : '']">
				<view class="cuIcon-cu-image">
					<text class="lg cuIcon-circle"></text>
				</view>
				<view>功能</view>
			</view>
			<view class="action" @click="uiType = 2" :class="[uiType == 2 ? 'active' : '']">
				<view class="cuIcon-cu-image">
					<text class="lg cuIcon-my"></text>
				</view>
				<view>个人中心</view>
			</view>
		</view>

	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import userInfo from "@/pages/userInfo/index.vue"

import userStore, { loginUser, toPage, pageItem } from "@/store/user"


import { showLoading, showToast, showErrorToast } from "@/utils/other"
import { scanCode } from "@/utils/other"


type Gropu = {

	id: string,
	name: string,
}




let lastCall: boolean = false;

export default Vue.extend({
	components: {
		userInfo
	},
	data() {
		return {
			uiType: 1,
			shownnn: false,
			showxjc: false,
			tag: [

				{
					open: true,
					title: "耐萨斯",
					item: [
						{
							name: "加工开工扫描",
							args: ["startToScan", 1]
						},
						{
							name: "清单",
							args: ["ospDetaile", 1]
						}
					]
				},
				{
					open: true,
					title: "新金创",
					item: [
						{
							name: "精板到货扫描",
							args: ["getToScan", 2]
						}
					]
				},


				{
					open: true,
					title: "精板结账",
					item: [
						{
							name: "钢精板",
							args: ["ospAboacc", 2, {
								type: 1
							}]
						},
						{
							name: "铝精板",
							args: ["ospAboacc", 2, {
								type: 2
							}]
						}
					]
				}



			]
		}
	},
	onLoad(params = {}) {
		this.shownnn = userStore.shownnn;
		this.showxjc = userStore.showxjc;

	},
	watch: {
		shownnn(value) {
			userStore.shownnn = value;
		},
		showxjc(value) {
			userStore.showxjc = value;
		}

	},
	methods: {

		onClickTitle(item: any) {
			item.open = !item.open;

		},
		activeUI(type: number) {
			return this.uiType == type
		},
		toPage(args: pageItem) {
			toPage(args);
		}

	}
});
</script>

<style lang="scss">
.content {
	height: 100%;
	width: 100%;

}

form {
	width: 90%;
}

.view-contain-ti {
	display: flex;
	height: 40px;
	margin: 20px;
	border: 3rpx solid #faca82;
	border-radius: 10rpx;
}

.text-ti {
	position: absolute;
	font-size: 12px;
	background: white;
	margin: -10px 0 0 10px;
	padding: 0 5px;
	color: rgb(144, 147, 167);
}

.button-item {
	padding: 20px;
	background-color: white;

	margin-top: 10px;
	border-radius: 10px;
	border: 1px solid #dcdfe6;
}


.action.active {
	color: #1989fa;
	background-color: #fff;

	.cuIcon-cu-image {
		color: #1989fa;
	}
}

.class-type {
	padding: 10px 16px;
	background-color: white;

	border-bottom: 1px solid #ebeef5;

	&:last-child {
		border: 0;
	}

	.item__header {
		display: flex;
		justify-content: space-between;

		&::after {
			top: 0;
			right: 30rpx;
			bottom: 0;
			display: inline-block;
			width: 30rpx;
			height: 30rpx;
			color: #8799a3;
			content: "\e6a3";
			text-align: center;
			font-size: 34rpx;
			font-family: cuIcon;
			line-height: 30rpx;
			margin-top: auto;
			margin-bottom: auto;
			transition: transform .3s;

		}

		&.is-active::after {
			transform: rotate(90deg);
		}
	}


	.item__content {
		padding: 12px 0;

		.button-item {
			padding: 5px;
			margin-top: 0;
			margin-right: 10px;
			border-radius: 3px;
		}
	}



}

label.title {
	font-size: 0.9rem;
	font-weight: bolder;

}
</style>

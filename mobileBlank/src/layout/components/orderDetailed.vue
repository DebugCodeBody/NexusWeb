<template>
	<div class="order-detailed">
		<div class="detailed-wrap">
			<div class="detailed-item">订单：{{ modelValue.no || "" }}
				<span class="printer" v-if="fullmatch">
					<el-icon>
						<DocumentRemove />
					</el-icon>完全匹配
				</span>
			</div>
			<div class="detailed-item">
				<span>规格：{{ modelValue.spec }}</span>
				<span v-if="modelValue.printtime" class="printer">
					<el-icon>
						<Printer />
					</el-icon>{{ modelValue.printtime }}
				</span>
			</div>
			<div>客户：{{ modelValue.custname }}</div>
			<div>毛板：{{ modelValue.spec2 }}</div>
			<div>资材：{{ modelValue.mat_name }}</div>
			<div>数量：{{ modelValue.qty }}</div>
			<div>尾料：{{ modelValue.stname }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, nextTick, defineProps, computed ,onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElIcon, ElButton } from 'element-plus'
import { Printer, DocumentRemove } from '@element-plus/icons-vue'

const Props = defineProps({
	modelValue: Object as any
})



const fullmatch = computed(() => {
	if(process.env.NODE_ENV != "production" ){
		return true
	}else{
		return Props.modelValue.fullmatch
	}
})



function click(){
	console.log(123)
}
</script>

<style lang="scss">
.order-detailed {
	width: 100%;

	line-height: 25px;

	padding: 6px;

	display: flex;




	.detailed-wrap {
		width: 100%;


		.detailed-item {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.printer{
				width: 75px;
				display:flex;
				align-items: center;
				color: red;
			}
			i {
				color: black;
				margin-right: 2px;
			}
		}
	}
}
</style>

<template>
	<div class="main-wrap">
		<div class="main-content">
			<keep-alive :include="'eatmeal'">
				<component :is="toComponent" />
			</keep-alive>
		</div>
	</div>
</template>

<script setup lang="ts">
import viewStore from "@/store/view"
import declare from "@/views/declare/index.vue";
import orderCart from "@/views/orderCart/index.vue"
import details from "@/views/details/index.vue"



import { ref, reactive, nextTick, defineProps, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"


const view = viewStore();

const tabs: any = {
	declare,
	orderCart,
	details
}


const toComponent = $computed(() => {
	let retVal = tabs[view.path];
	document.title = retVal.title;
	return retVal
})





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
	}

}
</style>

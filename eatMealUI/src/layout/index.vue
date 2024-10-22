<template>
	<div class="main-wrap">
		<!-- <div class="main-top-view">
			<van-nav-bar :title="view.title" left-text="返回" left-arrow @click-left="onClickLeft" />
		</div> -->
		<div class="main-content">

			<KeepAlive :include="['declare', 'preview']">
				<component :is="view" :key="view.name" />
			</KeepAlive>
			<!-- <transition name="slide">
				
			</transition> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import declare from "@/views/declare/index.vue";
import preview from "@/views/preview/index.vue"
import order from "@/views/order/index.vue"
import shop from "@/views/shop/index.vue"

import { ref, reactive, nextTick, defineProps, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { getPathSearch } from "@/utils/urlSearch"

const tabs: any = {
	declare,
	preview,
	order,
	shop
}

const path = reactive<Array<string>>([]);

path.push(getPathSearch() || "preview");

const view = computed(() => {
	let retVal = tabs[path[path.length - 1]];

	document.title = retVal.title;

	return retVal;
})

function onClickLeft() {
	if (path.length > 1) {
		path.pop();
	}
}

window.toPath = function (str: string) {
	path.push(str);
}



</script>

<style lang="scss">
.main-wrap {
	width: 100%;
	height: 100%;

	box-sizing: border-box;

	display: flex;
	flex-direction: column;

	.main-top-view {
		flex-shrink: 0;
		border-top: 1px solid rgb(240, 241, 242);
	}

	.main-content {
		width: 100%;
		flex: 1;

		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

}

.slide-enter-active,
.slide-leave-active {
	transition: all 0.3s;
}


.slide-enter-to {
	position: absolute;
	right: 0;
}


.slide-enter-from {
	position: absolute;
	right: -100%;
}


.slide-leave-to {
	position: absolute;
	left: -100%;
}


.slide-leave-from {
	position: absolute;
	left: 0;
}
</style>

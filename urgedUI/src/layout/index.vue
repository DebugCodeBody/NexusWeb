<template>
	<div class="main-wrap">
		<div class="main-content">
			<component :is="pathView()"  />
		</div>
	</div>
</template>

<script setup lang="ts">
import declare from "@/views/declare/index.vue";
import preview from "@/views/preview/index.vue"
import order from "@/views/order/index.vue"

import { ref, reactive, nextTick, defineProps, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"





let { path = "declare" } = window.urlSearch;
const tabs: any = {
	"declare": {
		title: "催单登记",
		view: declare
	},
	"preview": {
		title: "催单看板",
		view: preview
	},
	order: {
		title: "工单详细",
		view: order
	}
}

function pathView() {
	path = path || "declare"
	
	document.title = tabs[path].title;

	return tabs[path].view


}





</script>

<style lang="scss">
.main-wrap {
	width: 100%;
	height: 100%;

	padding: 10px;
	box-sizing: border-box;

	.main-content {
		width: 100%;
		height: 100%;
		overflow: hidden;


	}

}
</style>

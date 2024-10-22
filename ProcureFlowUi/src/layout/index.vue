<template>
	<div class="main-wrap">
		<div class="main-content">
			<component :is="pathView()" />
		</div>
	</div>
</template>

<script setup lang="ts">
import declare from "@/views/declare/index.vue";
import preview from "@/views/preview/index.vue"
import list from "@/views/list/index.vue"

import { ref, reactive, nextTick, defineProps, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { getPathSearch } from "@/utils/urlSearch"



const tabs: any = {
	declare,
	preview,
	list
}

function pathView() {
	const path = getPathSearch();

	let retVal = tabs[path];
	if (!retVal) {
		retVal = tabs["list"];
	}


	document.title = retVal.title;

	return retVal

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
	}

}
</style>

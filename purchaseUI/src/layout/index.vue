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

import { ref, reactive, nextTick, defineProps, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { getPath } from "@/utils/urlSearch"


const tabs: any = {
	declare,
	preview
}

function pathView() {
	const path = getPath() || "declare";

	document.title = tabs[path].title;

	return tabs[path]

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

		flex-direction: column;
	}

}
</style>

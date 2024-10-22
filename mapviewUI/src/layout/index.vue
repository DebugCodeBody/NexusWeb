<template>
	<div class="main-wrap">
		<div class="main-content">
			<component :is="pathView" />
		</div>
	</div>
</template>

<script setup lang="ts">
import declare from "@/views/declare/index.vue";
import preview from "@/views/preview/index.vue"
import addorigin from "@/views/addorigin/index.vue"
import editorigin from "@/views/editorigin/index.vue"
import editcust from "@/views/editcust/index.vue"
import edituser from "@/views/edituser/index.vue"
import polygon from "@/views/polygon/index.vue"

import { ref, reactive, nextTick, defineProps, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { getPathSearch } from "@/utils/urlSearch"


const tabs: any = {
	declare,
	preview,
	addorigin,
	editorigin,
	editcust,
	edituser,
	polygon
}

let path = $ref(getPathSearch());
const pathView = $computed(() => {
	let retVal = tabs[path];
	if (!retVal) {
		retVal = tabs["declare"];
	}

	document.title = retVal.title;

	return retVal
})

window.toView = function (pathView: string) {
	path = pathView;
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

		display: flex;
		flex-direction: column;
	}

}
</style>

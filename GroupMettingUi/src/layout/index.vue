<template>
	<div class="main-wrap">
		<div class="main-content">
			<keep-alive :exclude="['memo']">
				<component :is="tabs[path]" :path="path" />
			</keep-alive>
		</div>
	</div>
</template>

<script setup lang="ts">
import declare from "@/views/declare/index.vue";
import preview from "@/views/preview/index.vue"
import list from "@/views/list/index.vue"
import memo from "@/views/memo/index.vue"
import share from "@/views/share/index.vue"
import suggest from "@/views/suggest/index.vue"
import search from "@/views/search/index.vue"
import openGroup from "@/views/openGroup/index.vue"
import leave from "@/views/leave/index.vue"
import okrsearch from "@/views/okrsearch/index.vue"
import groupend from "@/views/groupend/index.vue"
import groupsetother from "@/views/groupsetother/index.vue"
import groupignore from "@/views/groupignore/index.vue"
import groupcharge from "@/views/groupcharge/index.vue"
import creategroup from "@/views/createGroup/index.vue"
import extendType from "@/views/extendType/index.vue"
import groupmark from "@/views/groupmark/index.vue"
import groupendproposer from "@/views/groupendproposer/index.vue"
// import hectic from "@/views/hectic/index.vue"

import { ref, reactive, nextTick, defineProps, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { getPathSearch } from "@/utils/urlSearch"



const tabs: any = {
	declare,
	preview,
	list,
	memo,
	share,
	suggest,
	search,
	leave,
	// hectic,
	opengroup: openGroup,
	groupmark,
	okrsearch,
	groupend,
	quicktrack: groupsetother,
	groupsetother,
	groupignore,
	groupcharge,
	creategroup,
	extendtype: extendType ,
	groupendproposer
}


let path = $ref("");





function pathView() {
	
	path = path || getPathSearch() || "";

	path = path.toLocaleLowerCase();

	let retVal = tabs[path];
	if (!retVal) {
		path = "declare";
		retVal = tabs[path];
	}


	document.title = retVal.title;

	if (dd.env.platform != "notInDingTalk") {

		try {

			dd.biz.navigation.setTitle({
				title: retVal.title
			});

		} catch (error) {



		}

	}



	return retVal

}

window.movePath = function (name: string) {
	path = name;

	pathView();
}


pathView();



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

		display: flex;
		flex-direction: column;
	}

}
</style>

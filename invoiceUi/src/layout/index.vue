<template>
	<div class="main-wrap">
		<div class="main-content">
			
			<component :is="toView" v-if="toView"/>
			
			<div class="wh-full flex justify-center items-center" v-else>
				<div class="warp" v-for="item in viewList" :key="item.name" @click="onClickToView(item)">
					<div v-html="item.svg"></div>
					<span>{{ item.name }}</span>
				</div>
			</div>

		</div>
	</div>
</template>

<script setup lang="ts">
import declare from "@/views/declare/index.vue";
import update from "@/views/update/index.vue";

import { ref, reactive, nextTick, defineProps, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { getPathSearch } from "@/utils/urlSearch"



const tabs: any = {
	declare,
	update
}

const viewList = $ref([
	{
		name: "发票确认",
		path: "declare",
		svg: `<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4251"><path d="M926.421333 157.12v341.333333H797.013333l0.021334 404.010667-156.266667-77.376-132.138667 66.773333-132.138666-66.773333-155.456 76.8-0.021334-403.434667H94.421333v-341.333333h832z m-193.408 202.645333h-448v439.125334l91.797334-45.333334 131.818666 66.56 131.882667-66.56 92.501333 45.781334V359.765333z m-96.064 244.202667v64h-256v-64h256z m0-147.050667v64h-256v-64h256z m225.472-235.818666h-704v213.333333h62.592l0.021334-138.666667h576l-0.021334 138.666667h65.408v-213.333333z" p-id="4252"></path></svg>`
	},
	{
		name: "图纸修改",
		path: "update",
		svg: `<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="588"><path d="M870.741333 361.685333h72.533334v601.770667c0 32-26.752 57.557333-59.733334 57.557333H132.266667c-32.853333 0-59.733333-25.6-59.733334-57.472V160.725333c0-31.786667 26.922667-57.429333 59.562667-57.429333H673.706667v72.533333H145.066667V948.48h725.674666V361.685333zM191.488 698.026667h263.509333v85.077333H191.488V698.026667z m0-178.389334h441.941333v85.077334H191.488v-85.077334z m550.186667-95.786666a41.898667 41.898667 0 0 1-72.533334-41.685334l179.456-331.690666a41.898667 41.898667 0 0 1 72.32 42.112l-179.2 331.264z" fill="#3D3D3D" p-id="589"></path></svg>`
	},

]);

let viewPath = $ref(getPathSearch());
const toView = $computed(() => {
	return tabs[viewPath];
})

function pathView() {

	const path = getPathSearch();

	let retVal = tabs[path];
	if (!retVal) {
		retVal = tabs["declare"];
	}


	document.title = retVal.title;

	return retVal

}


function onClickToView(item:any) {

	const tempView = tabs[item.path];


	viewPath = item.path;
	document.title = tempView.title;


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
	
    .warp {
        width: 100px;
        height: 100px;
        margin: 20px;

        border-radius: 10px;
        background-color: white;
        text-align: center;

        display: flex;
        flex-direction: column;

        justify-content: center;
        align-items: center;

        box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);

        &:hover {
            cursor: pointer;
        }

        svg {
            font-size: 42px;
            margin-bottom: 10px;
            width: 1em;
            height: 1em;
        }
    }


}
</style>

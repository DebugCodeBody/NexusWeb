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
import admin from "@/views/admin/index.vue"
import endwork from "@/views/endwork/index.vue"
import mobile from "@/views/mobile/index.vue"

import { getPathSearch } from "@/utils/urlSearch"

const tabs: any = {
	declare,
	preview,
	endwork,
	admin,
	mobile
}
let path = $ref(getPathSearch() || "declare");


const pathView = $computed(() => {

	document.title = tabs[path].title;

	return  tabs[path];

})


window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.ctrlKey && event.altKey && event.key == "w") {
		if(path != "declare"){
			if(path == "admin"){
				path = "preview";
			}else{
				path = "admin";
			}
		}
    }
})


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

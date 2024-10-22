<template>
	<component :is="tab" />
</template>

<script setup lang="ts">
import { ref, nextTick, defineProps, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import declare from "@/views/declare/index.vue";
import sales from "@/views/sales/index.vue";

import viewEnum from "@/enums/viewEnum"


const { path } = window.urlSearch;

const tabs: any = {
	declare,
	sales
}

const tab = computed(() => {

	if(viewEnum.SALES == path){
		return sales
	}else {
		return declare
	}

})

</script>

<style lang="scss">
* {
	margin: 0;
}

html,
body,
#app {
	height: 100%;
	width: 100%;
}

body {
	background: rgb(243, 243, 247);
}
</style>

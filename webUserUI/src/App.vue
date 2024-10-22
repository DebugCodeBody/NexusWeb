<template>

	<div id="app" 
		@touchstart="touchstart"
		@touchmove="touchmove"
		@touchend="touchend"
	>
		<router-view />
	</div>
</template>

<script setup lang="ts">
import { ref, nextTick, defineProps, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"


let startTime = 0;
function touchstart(event:Event){
	if(event.target == undefined){
		event.preventDefault();
		startTime = Date.now();
	}
}
function touchmove(){}
function touchend(){

	if(startTime > 0 && Date.now() - startTime > 3000){
		if(process.env.NODE_ENV != "production"){
			localStorage.clear();
			alert("localStorage 已经清空")
		}
	}
}

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
</style>

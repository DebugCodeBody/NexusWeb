<template>
	<router-view />
</template>

<script setup lang="ts">
import { ref, nextTick, defineProps, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from 'vue'



</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

html,
body,
#app {
	height: 100%;
	width: 100%;
}
</style>

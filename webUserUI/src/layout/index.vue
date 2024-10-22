<template>
	<div class="main-wrap">
		<div class="main-content">
			登录成功页面
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, nextTick, defineProps, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue"
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
		border-radius: 5px;
		
	}
}
</style>

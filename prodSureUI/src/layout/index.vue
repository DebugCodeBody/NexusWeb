<template>
	<div class="main-wrap">
		<div class="main-content">
			<director class="director" />
		</div>
	</div>
</template>

<script setup lang="ts">
import director from "./components/director.vue"
import { ref, reactive, nextTick, defineProps, computed ,onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"







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

<template>
	<div class="main-wrap">
		<div class="main-content">
			<router-view></router-view>
		</div>
	</div>
</template>

<script setup lang="ts">



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

}
</style>

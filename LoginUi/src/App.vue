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

.wh-full {
	width: 100%;
	height: 100%;
}

.flex-center {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>

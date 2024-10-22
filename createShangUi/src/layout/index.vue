<template>
	<div class="main-wrap">
		<div class="main-content">
			<div class="main-container">
				<!-- 上面的导航条 -->
				<div class="app-header">
					<navbar />
				</div>
				<!-- 下面的主体内容 -->
				<app-main />
			</div>
		</div>
	</div>
</template> 

<script setup lang="ts">
import { AppMain, Navbar } from './components/index'




</script>

<script lang="ts">
export default {
	name: 'Layout'
}
</script>

<style lang="less"></style>

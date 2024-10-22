<template>
	<div class="main-wrap">
		<div class="main-content">
			<!-- 左边的菜单 -->
			<Sidebar class="sidebar-container" />
			<!-- 右边的内容 -->
			<div class="app-wrapper">
				<!-- 右边上面的导航条 -->
				<div class="app-header" :class="{ 'fixed-header': fixedHeader }">
					<navbar />
					<tags-view v-if="needTagsView" />
				</div>
				<!-- 右边下面的主体内容 -->
				<app-main />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { AppMain, Navbar, Sidebar, TagsView } from './components/index'

const fixedHeader = ref(false)
const needTagsView = ref(true)



</script>

<script lang="ts">
export default {
  name: 'Layout'
}
</script>

<style lang="scss">
</style>

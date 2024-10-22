<template>
	<div class="main-wrap" :class="classObj">
		<div class="main-content">
			<!-- 左边的菜单 -->
			<Sidebar class="sidebar-container" />
			<!-- 右边的内容 -->
			<div class="main-container">
				<!-- 右边上面的导航条 -->
				<div class="app-header" :class="{ 'fixed-header': fixedHeader }" >
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
import { sidebarStore } from "@/store"


const sidebar = sidebarStore();

const fixedHeader = ref(false)
const needTagsView = ref(true)

const classObj = computed(() => {
	return {
		/** 是否收缩菜单条 */
		hideSidebar: !sidebar.opened,
		/** 是否展开菜单条 */
		openSidebar: sidebar.opened,
		/** 是否不需要过渡效果 */
		withoutAnimation: sidebar.withoutAnimation
	}
})


</script>

<script lang="ts">
export default {
	name: 'Layout'
}
</script>

<style lang="less">

</style>

<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
        :default-active="Route.path"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        
        unique-opened
        mode="vertical"
      >
        <sidebar-item v-for="route in permission.routers" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
  </el-scrollbar>
</template>



<script setup lang="ts">
import sidebarItem from "./sidebarItem.vue"
import variables from '@/style/variables.module.scss'

import { sidebarStore, permissionStore } from "@/store"


const Route = useRoute();
const sidebar = sidebarStore();
const isCollapse = computed(() => !sidebar.opened);
const permission = permissionStore();


</script>

<script lang="ts">
/** 菜单 */
export default {
  name: 'Sidebar'
}
</script>

<style>

</style>

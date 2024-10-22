<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="isActive" @toggleClick="sidebar.TOGGLE_SIDEBAR" />
    <breadcrumb id="breadcrumb-container"/>
  </div>
</template>

<script setup lang="ts">
import Hamburger from "@/components/Hamburger/index.vue"
import Breadcrumb from "@/components/Breadcrumb/index.vue"


import { sidebarStore } from "@/store"

const sidebar = sidebarStore();

const isActive = computed(() => {
  return sidebar.opened;
})







</script>

<script lang="ts">
export default {
  name: ""
}
</script>

<style lang="scss">
.navbar{
  height: 50px;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  display: flex;
  align-items: center;


  #hamburger-container{
    height: 100%;
    width: 50px;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover{
      background: rgba(0,0,0,.03);
    }
  }

  #breadcrumb-container{
    margin-left: 10px;
  }
}

</style>

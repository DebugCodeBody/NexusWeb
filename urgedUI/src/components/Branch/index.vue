<template>
    <el-drawer v-model="branchDrawer" direction="btt" size="100%" title="选择部门" :modal-class="$attrs.class">
        <el-scrollbar>
            <item :data="data" v-for="(data) in branch" :key="data.idx" @select="select"></item>
        </el-scrollbar>
    </el-drawer>
</template>

<script setup lang="ts">
import item from "./components/item.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { branchDrawer, branch, branchSwitch } from "@/store/branch"

function select(item: branch) {
    branchSwitch(item);
}


</script>

<script lang="ts">
export default {
    name: "Branch",
    inheritAttrs: false
}
</script>

<style lang="scss" >

.el-drawer__header {
    padding: 10px !important;
    padding-bottom: 0 !important;
    margin-bottom: 10px !important;
}

.el-drawer__body {
    padding-top: 0 !important;
}
</style>

<template>
    <el-sub-menu v-if="item.children" :index="index(item)" ref="subMent">
        <template #title>
            <span>{{item.deptname}}</span>
        </template>
        <div style="margin-left: 20px; margin-top: 10px;">
            <el-button v-for="(child) in item.children" :key="child.idx" @click="branchSwitch(child)" size="default">{{ child.deptname }}</el-button>
        </div>
    </el-sub-menu>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { branchDrawer, branchSwitch } from "@/store/branch"

const Props = defineProps<{
    item: branch
}>();

function index(s: branch) {
    return s.idx + s.deptname
}



</script>

<script lang="ts">
export default {
    name: "BranchItem"
}
</script>

<style lang="scss" >
// .el-sub-menu__title{
//     display: none !important;

// }
// .el-menu--inline>div{
//     margin: 0 !important;
// }



</style>

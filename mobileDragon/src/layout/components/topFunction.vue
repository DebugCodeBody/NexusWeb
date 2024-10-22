<template>
    <div class="function">
        <el-icon :size="25" @click="init">
            <RefreshLeft />
        </el-icon>
        <el-icon :size="25" @click="dialogVisible = true">
            <Timer />
        </el-icon>
        <el-checkbox  label="新刀粒" size="large" v-if="milling"/>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElIcon,ElCheckbox } from 'element-plus'
import { RefreshLeft, Timer } from '@element-plus/icons-vue'

import { init }  from "@/layout/hooks/userData"
import { dialogVisible } from "@/layout/hooks/usetTime"


const milling = ref(window.urlSearch.gid == "1");


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
</style>

<template>
    <div class="function">
        <el-icon :size="25" @click="init">
            <RefreshLeft />
        </el-icon>
        <el-icon :size="25" @click="dialogVisible = true">
            <Timer />
        </el-icon>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElIcon } from 'element-plus'
import { RefreshLeft, Timer } from '@element-plus/icons-vue'

import userData from "@/layout/hooks/userData"
import { dialogVisible } from "@/layout/hooks/usetTime"


const { init } = userData();



function event() { }
</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
</style>

<template>
    <el-scrollbar height="400px" v-loading="loading">
        <el-steps direction="vertical" :active="stepList.length" class="step-view" v-if="!error">
            <el-step v-for="(item) in stepList" :key="item.taskid" :title="getTitle(item)">
                <template #description>
                    <step-item :item="item" />
                </template>
            </el-step>
        </el-steps>
        <el-result icon="error" sub-title="获取失败" v-else>
            <template #extra>
                <el-button @click="init">刷新</el-button>
            </template>
        </el-result>
    </el-scrollbar>
</template>

<script setup lang="ts">
import stepItem from "./stepItem.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { selectStore } from "@/store/select"
import { stepStore } from "@/store/step"


const Emits = defineEmits<{
    (e: 'loadDoen'): void;
}>();

const step = stepStore();
const select = selectStore();

const error = ref(false);
const loading = ref(true);
const stepList = ref<steps>([])



const titleMap: Record<string, string> = {
    "1": "创建任务",
    "2": "移动任务",
    "3": "完结任务",
    "99": "留言",
    "100": "编辑任务",
}

function getTitle(item: step) {
    return titleMap[item.stageid + ""];
}


async function init() {
    loading.value = true;
    error.value = false;

    try {
        const response = await step.getStep(select.item)!;

        stepList.value.push(...response);
        Emits('loadDoen');

    } catch {
        error.value = true;
    } finally {
        loading.value = false;
    }

}


init();





</script>

<script lang="ts">
export default {
    name: "task-step"
}
</script>

<style lang="scss">
.step-view {

    &.step-load {
        height: 400px;
    }

    .el-step__main {
        margin-bottom: 20px;
    }

    .el-step__title.is-finish,
    .el-step__description.is-finish {
        color: black;
    }

    .el-step__head.is-finish {
        color: #909399;
        border-color: #a8abb2;
    }

    .el-step__description {
        padding-right: 10%;
        margin-top: -5px;
        font-size: 12px;
        line-height: 20px;
        font-weight: 400;
    }

}
</style>

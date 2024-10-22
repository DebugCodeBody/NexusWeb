<template>
    <el-scrollbar ref="scrollbar" class="work-step" v-loading="loadIng">
        <el-steps direction="vertical" v-if="!loadErr" :align-center="true">
            <template v-for="(item, index) in itemStep" :key="index">
                <el-step :title="setTitle(item.stage)">
                    <template #description>
                        <div class="description">
                            <span>操作人员：</span><span>{{ item.username }}</span>
                        </div>
                        <div class="description">
                            <span>操作时间：</span><span>2022-08-13 11:26:17</span>
                        </div>
                        <div class="description" v-if="!!item.memo">
                            <span>详细描述：</span><span class="memo">{{ item.memo }}</span>
                        </div>
                    </template>
                </el-step>
            </template>
            <el-step :title="setTitle(nextProcess)" v-if="!loadIng && nextProcess"></el-step>
        </el-steps>
        <el-result icon="error" sub-title="获取流程失败" v-else>
            <template #extra>
                <el-button type="primary" @click="init">刷新</el-button>
            </template>
        </el-result>
    </el-scrollbar>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { selectItem, allItem, selectType } from "../store/data"
import { getStep, nextProcess } from "../store/step"

const loadErr = ref(false);
const loadIng = ref(true);
const itemStep = reactive<steps>([]);
const scrollbar = ref();

watch(nextProcess, (value) => {
    if (value) {
        nextTick(() => {
            scrollbar.value.setScrollTop(scrollbar.value.wrap$.scrollHeight);
        })
    }
})

function setTitle(stage: string | number) {
    return ({
        "1": "创建催单",
        "2": "转部门",
        "3": "结案",
        "99": "留言",
    })[stage]
}



function init() {
    loadIng.value = true;
    loadErr.value = false;

    getStep(selectItem.value).then((data) => {

        itemStep.push(...data);
        loadIng.value = false;

    }).catch(() => {
        loadErr.value = true;
    }).finally(() => {
        loadIng.value = false;
    })
}

init();






</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.work-step {
    width: 100%;

    .el-steps {
        height: 450px;

        .el-step__main *,
        .el-step__title.is-wait,
        .el-step__title.is-finis {
            color: black;
        }

        .el-step__head {

            color: #909399;
            border-color: #a8abb2;
        }

        .el-step__title.is-process {
            font-weight: 100;
        }

        .el-step__main {
            padding-bottom: 20px;
        }
    }






}
</style>

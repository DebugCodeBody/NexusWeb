<template>
    <el-dialog v-model="dialog" title="任务流程" @closed="closed">
        <el-scrollbar ref="scrollbar" class="work-step">
            <el-steps direction="vertical" :align-center="true">
                <template v-for="(item, index) in step" :key="index">
                    <el-step :title="item.stage">
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
            </el-steps>
        </el-scrollbar>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="dialog = false">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">

import setTitle from "@/utils/step"


const Emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

defineProps<{
    step: steps,
    modelValue: boolean
}>();




const scrollbar = ref();
const dialog = ref(true);



function closed() {
    Emit('update:modelValue', false);

}




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

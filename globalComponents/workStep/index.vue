<template>
    <el-card class="step-card">
        <el-scrollbar :max-height="maxHeight" v-loading="loading" ref="scrollbar">
            <template v-if="!error">

                <el-steps direction="vertical" :active="modelValue.length" class="step-view" v-show="!loading"
                    v-if="modelValue.length">
                    <el-step v-for="(item, index) in modelValue" :title="getTitle(item, index)">
                        <template #description>
                            <slot :item="item"></slot>
                        </template>
                    </el-step>
                </el-steps>
                <div v-else> 
                    <el-empty description="暂没有数据" />
                </div>

            </template>


            <slot name="error" v-else>
                <el-result icon="error" sub-title="获取失败">
                    <template #extra>
                        <el-button @click="onClickRefresh">刷新</el-button>
                    </template>
                </el-result>
            </slot>

        </el-scrollbar>
    </el-card>
</template>

<script setup lang="ts">
import { ElScrollbar } from "element-plus";

const Emit = defineEmits<{
    /** 显示错误的时候，刷新按钮被点击 */
    (e: "refresh"): void
}>();

const Props = withDefaults(defineProps<{
    /** 数据内容 */
    modelValue: any[],
    /** 是否在加载中 */
    loading?: boolean,
    /** 是否显示错误 */
    error?: boolean,
    /** 如果使用了默认的错误提示，决定是否显示刷新按钮 */
    showRefreshButton?: boolean,
    maxHeight?: number
    getTitle: (a: any, b: number) => {}
}>(), {
    showRefreshButton: true,
    maxHeight: 400,
    loading: false,
    error: false

})

const scrollbar = $ref<InstanceType<typeof ElScrollbar>>();




/** 点击异常里面的刷新按钮事件 */
function onClickRefresh() {
    Emit("refresh");
}


</script>

<script lang="ts">
/**
 *  通用版任务不步骤图
 */
export default {
    name: "workStep"
}

</script>

<style lang="scss">
.step-card {
    .el-card__body {
        padding: 10px;
    }
}

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

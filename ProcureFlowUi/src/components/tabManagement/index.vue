<template>
    <div class="tab-management" ref="tabEl">
        <el-tabs v-model="catchActiveTag" type="border-card" @tab-change="onTabChange">
            <el-tab-pane v-for="(item, index) in tagList" :label="item.label" :key="index" :name="item.id">
            </el-tab-pane>

            <div class="column-container">

                <div v-if="isError">
                    <el-result icon="error" sub-title="获取失败">
                        <template #extra>
                            <el-button type="primary">重试</el-button>
                        </template>
                    </el-result>
                </div>
                <template v-else>
                    <div class="empty-view" v-if="isEmpty">
                        <el-empty description="暂无数据"></el-empty>
                    </div>
                    <template v-else>
                        <div class="column-item border" v-for="(item, index) in dataList" :key="index">
                            <slot name="item" :itemData="item"></slot>
                        </div>
                    </template>
                </template>


            </div>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { tagItem } from "./type"


const Emit = defineEmits<{
    (e: 'update:modelValue', value: tagItem): void;
}>();

const Props = withDefaults(defineProps<{
    modelValue?: tagItem,
    tagList?: tagItem[],
    dataList: any[],
    test?: boolean,
    refresh: (item: tagItem) => Promise<boolean>
}>(), {
    modelValue: {} as any,
    tagList: [] as any,
});

const isEmpty = $computed(() => {
    return Props.dataList.length == 0;
})


let activeTag = $ref(Props.modelValue.id);
let catchActiveTag = $ref(Props.modelValue.id);

let isError = $ref(false);


async function onTabChange(item: number) {

    const tag = Props.tagList.find((elem) => elem.id == item)!;

    isError = false;
    let bool: boolean;

    try {
        bool = await Props.refresh(tag)
    } catch (error) {
        bool = false
    }
    if (!bool) {
        isError = true;
    }

    Emit('update:modelValue', tag);

}


onTabChange(catchActiveTag);

</script>

<script lang="ts">
export default {
    name: "tab-management"
}


</script>

<style lang="scss">
@mixin wh-full {
    width: 100%;
    height: 100%;
}


.tab-management {

    @include wh-full;
    overflow: hidden;

    .el-tabs {
        @include wh-full;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .el-tabs .el-tabs__content {
        @include wh-full;
        padding: 0;
        overflow: hidden;
        flex: 1;
        display: flex;

    }

    .empty-view {
        @include wh-full;
    }

    .column-container {
        @include wh-full;
        overflow: auto;
        padding: 10px;

        .column-item {
            padding: 10px;
            margin-bottom: 10px;

            border-radius: 5px;
            box-shadow: var(--el-box-shadow-light);


            .el-form-item--large .el-form-item__label,
            .el-form-item--large .el-form-item__content {
                line-height: 25px;
                height: 25px;
            }

            .pre-label {
                .el-form-item__label,
                .el-form-item__content {
                    height: auto;
                    line-height: normal;
                }
            }

            .el-form-item {
                margin-bottom: 10px;

                &:last-child {
                    margin-bottom: 0;
                }

            }

        }

    }





}
</style>

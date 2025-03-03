<template>
    <div>
        <template v-if="Array.isArray(renderValue)">
            <template v-for="(tag, idx) in renderValue">
                <el-tag v-if="tag" class="m-10" :type="getTagType(tag, renderRow.custom)" :effect="renderRow.effect ?? 'light'"
                    :size="renderRow.size ?? 'default'" :key="idx">
                    {{ renderRow.replaceValue ? renderRow.replaceValue[tag] ?? tag : tag }}</el-tag>
            </template>
        </template>

        <template v-else>
            <el-tag class="m-10" v-if="renderValue !== ''" :type="getTagType(renderValue, renderRow.custom)"
                :effect="renderRow.effect ?? 'light'" :size="renderRow.size ?? 'default'">
                {{ renderRow.replaceValue ? renderRow.replaceValue[renderValue] ?? renderValue : renderValue }}</el-tag>
        </template>
    </div>
</template>

<script setup lang="ts">

import { Tag } from 'element-ui';

const props = defineProps<{
    renderRow: TableRow
    renderrenderRow: TableColumn
    renderValue: string,
    property: any,
}>();



const getTagType = (value: string, custom: any): Tag['type'] => {
    return custom && custom[value] ? custom[value] : ''
}





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

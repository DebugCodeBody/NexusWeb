<template>
    <div v-if="renderValue">
        <el-tag :type="getTagType(renderValue, renderField.custom)" :effect="renderField.effect ?? 'light'" :size="renderField.size">{{
            renderField.replaceValue ? renderField.replaceValue[renderValue] : renderValue
        }}</el-tag>
    </div>
</template>

<script setup lang="ts">

import { Tag } from 'element-ui';

const props = defineProps<{
    renderRow: TableRow
    renderField: TableColumn
    renderValue: string
}>();


function getTagType(value: string, custom: any): Tag['type'] {

    return custom && custom[value] ? custom[value] : ''
}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

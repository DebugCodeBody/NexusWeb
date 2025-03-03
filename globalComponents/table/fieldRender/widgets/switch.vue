<template>
    <el-switch @change="changeField($event, property)" :model-value="renderValue.toString()" :loading="renderRow.loading"
        active-value="1" inactive-value="0" />
</template>

<script setup lang="ts">
import { boxTableControl, provideName } from '../../utils/boxTable'


const boxTable = inject<boxTableControl>(provideName)!;



const props = defineProps<{
    renderRow: TableRow
    renderField: TableColumn
    renderValue: String,
    property: any,
}>();

const changeField = (value: any, fieldName: keyof TableRow) => {
    boxTable.eventBus.emit('onTableFieldChange', {
        value: value,
        row: props.renderField,
        field: fieldName,
        render: props.renderField.render,
    })
}





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

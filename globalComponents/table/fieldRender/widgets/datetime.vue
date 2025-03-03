<template>
    <div>
        {{ !renderValue ? '-' : timeFormat(renderValue, renderRow.timeFormat ?? undefined) }}
    </div>
</template>

<script setup lang="ts">
import { timeFormat } from '../../utils/index'

const props = defineProps<{
    renderRow: TableRow
    renderField: TableColumn
    renderValue: string,
    property: any,
}>();




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

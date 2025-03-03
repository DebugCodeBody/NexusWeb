<template>
    <div v-if="renderValue" class="box-cell-render-url">
        <a :href="renderValue" >{{ renderValue }}</a>
    </div>
</template>

<script setup lang="ts">


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

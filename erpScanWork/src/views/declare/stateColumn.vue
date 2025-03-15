<template>
    <div class="h-full state-column">
        <el-tag :type="type">{{ renderRow.msg }}</el-tag>
    </div>
</template>

<script setup lang="ts">

const Props = defineProps<{
    renderRow: any,
    renderField: any,
    renderValue: any
}>();

const type = $computed(() => {

    const { renderRow } = Props;

    return renderRow.success ? "" : "danger";

})




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
</style>

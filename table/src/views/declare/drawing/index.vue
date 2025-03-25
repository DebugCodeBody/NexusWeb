<template>
    <div>
        <a :href="href"  target="_blank">查看图纸</a>
    </div>
</template>

<script setup lang="ts">

const Props = defineProps<{
    renderRow: any,
    renderField: any,
    renderValue: any
}>();

const href = $computed(() => {

    return `https://cddgd.cn/ding/onlineorder/scanDrawings/index.html?orderid=${Props.renderRow.mo_name}`


})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

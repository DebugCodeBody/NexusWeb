<template>
    <el-button type="danger" :size="size" @click="onClickEnd" >转结案</el-button>
</template>

<script setup lang="ts">

const Props = withDefaults(defineProps<{
    item: mettItem,
    size?: string
}>(), {
    size: "default"
});


function onClickEnd() {
    window.endItem(Props.item);
}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

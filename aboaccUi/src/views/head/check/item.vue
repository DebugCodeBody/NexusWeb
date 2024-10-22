<template>
    <div>
        <el-button @click="onClick" size="default" >明细</el-button>
    </div>
</template>

<script setup lang="ts">

const Props = defineProps<{
    renderRow: any,
    renderField: any,
    renderValue: any
}>();

function onClick(){

    window.headDetail(Props.renderRow);

}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
</style>

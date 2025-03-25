<template>
    <div class="delay_date h-full">
        <span class="value" v-if="renderValue">{{ renderValue }}</span>
        <div class="w-100px h-20px value" v-else ></div>
        <el-button @click="onClick" size="">编辑</el-button>
    </div>
</template>

<script setup lang="ts">

const Props = defineProps<{
    renderRow: any,
    renderField: any,
    renderValue: any
}>();

function onClick(){


    window.onEditPop(Props.renderRow);

}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
div.delay_date {
    text-align: center;
    display: flex;
    justify-content: center;
    

    .el-button {
        display: none;
    }

    &:hover {

        .value{
            display: none;
        }

        .el-button {
            display: block;
        }
    }


}
</style>

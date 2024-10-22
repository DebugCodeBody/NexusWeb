<template>
    <pop-dialog v-model="popModel.badness" title="添加不良工艺" :disabledConfirmButton="!value" class="pop-badness" @open="onOpen" @confirm="onConfirm" >
        <el-radio-group v-model="value">
            <el-radio v-for="item in scanResult.badness" :key="item.id" :label="item.name"
                :value="item.name"></el-radio>
        </el-radio-group>
    </pop-dialog>
</template>

<script setup lang="ts">

import popDialog from "global@/popDialog/index.vue"

import thisManage from "./data"

const Emit = defineEmits<{
    (e: "select"): void
}>();

const { scanResult, form, popModel } = thisManage;

let value = $ref("");

function onOpen() {
    value = form.badness;
}

function onConfirm() {
    form.badness = value;

    popModel.badness = false;

    if(value){
        Emit("select");
    }

}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.pop-badness{
    .el-radio-group{
        width: 100%;
    }
    .el-radio{
        width: 33.33%;
        
    }
}

</style>

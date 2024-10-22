<template>
    <pop-dialog class="pop-reason" v-model="popModel.reason" title="选择不良原因" :disabledConfirmButton="disabledConfirm"
        @open="onOpen" @confirm="onConfirm">

        <el-radio-group v-model="value" @change="onChange">
            <el-radio v-for="item in scanResult.reason" :key="item.id" :label="item.name" :value="item.name"></el-radio>
        </el-radio-group>

        <div class="w-full border mt-10px p-10px next-content" v-if="next.item && next.item.next">
            <span class="title">{{ next.item.name }}-选项</span>

            <el-radio-group v-model="next.value">
                <el-radio v-for="item in next.item.next" :key="item.id" :label="item.name"
                    :value="item.name"></el-radio>
            </el-radio-group>

        </div>


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



let next = $ref({
    item: undefined as (undefined | reasonItem),
    value: ""
});

const disabledConfirm = computed(() => {

    let retBool = false;

    if (next.item && next.item.next) {
        retBool = !next.value
    } else {
        retBool = !value;
    }

    return retBool;
})


function onChange(value: string) {
    next.item = scanResult.reason.find((elem) => elem.name == value)!;
    next.value = "";
}

function onOpen() {

    value = form.reason;
    onChange(value);
    next.value = form.next;

}


function onConfirm() {


    form.reason = value;
    form.next = next.value;

    popModel.reason = false;

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
.pop-reason {

    .el-radio {
        width: 25%;
    }

    .next-content {

        margin-top: 20px;
        position: relative;

        span.title {
            font-weight: bold;
            position: absolute;
            top: -10px;
            background-color: white;
        }

    }

}
</style>

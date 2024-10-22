<template>
    <pop-dialog v-model="popModel.match" title="配合件扫码验证" :showConfirmButton="false" class="pop-badness" @open="onOpen" @closeed="onCloseEd">

        <el-form :model="form" :hide-required-asterisk="true" label-width="68px">

            <el-form-item label="工单号" prop="moid">
                <order-input v-model="moid" :search="false" @scan="onMoidScan" :disabled="loading" ref="inputEl"/>
            </el-form-item>
            <el-form-item label="未扫码">
                <div>
                    <div v-for="item in scanResult.match" :key="item">{{ item }}</div>
                </div>
            </el-form-item>

        </el-form>
    </pop-dialog>
</template>

<script setup lang="ts">
import orderInput from "global@/orderInput/index.vue"
import popDialog from "global@/popDialog/index.vue"

import to from "await-to-js";
import { match } from "@/api"
import thisManage from "./data"


const Emit = defineEmits<{
    (e: "close"): void
}>();



const { scanResult, form, popModel } = thisManage;

let moid = $ref("");
let loading = $ref(false);
let inputEl = $ref<any>();

function onOpen() {
    moid = "";
    nextTick(()=>{
        inputEl.clear();
    })
}

async function onMoidScan(value: string) {


    loading = true;
    const [error, order] = await to(match(value));
    loading = false;

    if (error) {
        return;
    }

    const index = scanResult.match.indexOf(order);
    if (index == -1) {
        return;
    }

    scanResult.match.splice(index, 1);

    if (scanResult.match.length == 0) {
        popModel.match = false;
    }





}


function onCloseEd() {
    
    Emit("close");

}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.pop-badness {
    .el-radio-group {
        width: 100%;
    }

    .el-radio {
        width: 33.33%;

    }
}
</style>

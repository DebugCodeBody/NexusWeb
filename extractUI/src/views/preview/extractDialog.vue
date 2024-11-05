<template>
    <popDialog 
        :title="title" 
        v-model="extractDialogShow" 
        v-if="goDialog" 
        @confirm="onDiaLogconfirm" 
        ref="extractDialogEl">
        <el-form :model="selectItem" :rules="rules" label-width="auto" ref="formEl">

            <el-form-item label="订单号：">
                <span>{{ selectItem.orderid }}</span>
            </el-form-item>
            <el-form-item label="材质：">
                <span>{{ selectItem.mat_name }}</span>
            </el-form-item>
            <el-form-item label="规格：">
                <span>{{ selectItem.bspec }}</span>
            </el-form-item>
            <!-- <el-form-item label="提取数量：" prop="num">
                    <div style="display: flex">
                        <el-input v-model="inputNum"></el-input>
                        <span style="margin-left: 10px">件</span>
                    </div>
                </el-form-item> -->

        </el-form>
    </popDialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

import popDialog from "global@/popDialog/index.vue"


import { orderUpdate } from "@/api"
import { selectItem, extractDialogShow, submitData } from "@/store/data"


const Props = defineProps<{
    extract: boolean
}>();

const title = $computed(() => {
    return `${Props.extract ? "提货" : "撤销"}`;
})


const extractDialogEl = $ref<InstanceType<typeof popDialog>>();
const formEl = $ref<FormInstance>();
const goDialog = $ref(true);


const select = $computed(() => {

    console.log(selectItem.value)
    return selectItem.value;
})

let num = select.bcount;
let inputNum = $ref("");

const rules = {
    num: [{
        validator(rule: any, value: any, callback: any) {
            const inputVal = parseInt(inputNum || "0");
            if (inputVal <= 0) {
                callback(new Error("数量必须大于0"));
            } else if (inputVal > parseInt(num)) {
                callback(new Error(`数量超出订单量：${num}`));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }]
}

async function onDiaLogconfirm() {
    // const [err] = await to(formEl.validateField("num"))
    // if (err) {
    //     return;
    // }

    submitData(extractDialogEl, orderUpdate, [Props.extract, select.seq]);

}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

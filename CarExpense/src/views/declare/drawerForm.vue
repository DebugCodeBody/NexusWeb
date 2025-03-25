<template>
    <el-drawer v-model="showDrawer" :with-header="false" direction="btt" size="80%" @open="onDrwaerOpened"
        @closed="onDrawerClosed">
        <div class="wh-full flex flex-col form-content">
            <div class="relative">
                <div class="p-5px relative">
                    <data-form ref="formEl" :hidden="true" :quickMome="quickMome" :requiredMome="true">
                        <template #after>
                            <div class="text-center mb-10px">
                                <strong >不包括卡板，铁桶等退款</strong>    
                            </div>
                        </template>

                    </data-form>
                    <div class="button-block mt-10px flex">
                        <el-button :loading="submitLoading" @click="onClickCancel" class="mr-5px">取消添加</el-button>
                        <el-button type="primary" :loading="submitLoading" @click="onClickSubmit"
                            class="ml-5px">提交添加</el-button>
                    </div>
                    <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                        <template #extra>
                            <el-button type="primary" size="default" @click="onClickReset">继续提交</el-button>
                        </template>
                    </el-result>
                    <el-result v-if="initError" icon="error" class="error-result">
                        <template #extra>
                            <el-tag type="danger">请通过扫描二维码进入</el-tag>
                        </template>
                    </el-result>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { ElForm, FormRules } from 'element-plus'

import orderInput from "global@/orderInput/index.vue"


import { create, getList, getAutSndList, startAudit } from "@/api"
import { listData } from "./data"
import dataForm from "@/components/form.vue"


const Emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();


const Props = defineProps<{
    modelValue: boolean,
    listTable: any
}>();


const formEl = $ref<typeof dataForm>();



let showDrawer = $ref(false)
let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);

const quickMome = $ref([
    "餐费",
    "充电",
    "高速费",
    "过地磅",

])


function onClickCancel() {
    showDrawer = false;
}


async function onClickSubmit() {


    try {
        await formEl.validate();
    } catch (error:any){
        return;
    }

    try {

        submitLoading = true;

        const form = await formEl.getData();

        


        const data: any = {
            orderid: form.orderid,
            amount: form.amount,
            type: form.type,
            mome: form.mome,
        };

        if (!form.isDisabledNum) {
            data.pcnt = form.pcnt;
            data.bcnt = form.bcnt;
        }



        await create(data);

        showDrawer = false;

        Props.listTable.Refresh();

    } catch {



    } finally {
        submitLoading = false;
    }


}


function onClickReset() {

    formEl.resetFields();
    nextTick(() => {
        submitDone = false;
    })

}








function onDrwaerOpened() {



}

function onDrawerClosed() {
    Emit('update:modelValue', false);
}




onMounted(() => {


    showDrawer = true;

    nextTick(async () => {

        try {

            initLoading = true;

            formEl.setValue("无单号", "其他");
           

        } catch {
            initError = true;
        } finally {
            initLoading = false;
        }

    })






})

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.order-search-select {
    display: flex;

    .el-select {
        flex: 1;
        margin-right: 10px;
        box-sizing: box-shadow;
    }

    &.no-select {
        .el-input {
            margin-right: 10px;
        }
    }

    .el-input .el-input__suffix {
        display: contents;
    }
}
</style>

<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content flex flex-col ">
                    <div class="relative">
                        <div class="p-5px">
                            <el-form :model="form" :hide-required-asterisk="true" :rules="rules" label-width="auto"
                                ref="formEl">
                                <el-form-item label="工单条码">
                                    <order-input v-model="form.moid" :search="false" :disabled="true" @scann="onClickSubmit" ref="orderInputEl" />
                                </el-form-item>
                                <el-form-item label="工单号">{{ form.orderid }}</el-form-item>
                                <el-form-item label="扫描结果">
                                    <el-tag :type="type" v-if="isScan">{{ form.msg }}</el-tag>
                                </el-form-item>
                                
                                <!-- <el-form-item label="工单条码" prop="tissue">
                                    <el-button :disabled="!form.moid" @click="onClickSubmit">提交</el-button>
                                </el-form-item> -->

                            </el-form>
                            <div class="button-block mt-10px text-center">
                                <el-button type="primary" :loading="submitLoading" @click="onClickScan">扫描</el-button>
                            </div>
                        </div>

                    </div>

                    <div class="flex-1  wh-full mt-10px">
                        <scan-table v-model="sacnList" />
                    </div>

                </div>
            </div>



        </div>
    </div>
</template>

<script setup lang="ts">

import orderInput from "global@/orderInput/index.vue"
import scanTable from "./scanTable.vue"



import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js";

import { submitScan } from "@/api"


const form = $ref({
    moid: "",
    msg: "",
    success: false,
    orderid: "",

});

const type = $computed(() => {

    return form.success ? "" : "danger";

})


let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);

let isScan = $ref(false);

const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
})

const sacnList = $ref<scanResult[]>([]);

const orderInputEl = $ref<any>();



async function onClickScan() {
    orderInputEl.Scan();
}



async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }

    try {

        submitLoading = true;

        const result = await submitScan(form.moid);

        Object.assign(form, result);
        sacnList.push(result);

    } catch {

        form.success = false;
        form.msg = "扫描失败";
        form.orderid = "";

    } finally {

        isScan = true;
        submitLoading = false;
    }


}





async function init() {

    try {

        initLoading = true;


    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref("切料完工扫描");

export default {
    name: "",
    title
}
</script>

<style lang="scss">
#declare {


    .declare_view {
        max-width: 800px;
        margin: auto;
    }

    .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        background-color: #66b1ff;
    }

    .form-content {

        form {
            padding: 10px;
            box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);

            .el-form-item {
                &.line-item {
                    flex-direction: column;
                }

                &.mb-0 {
                    margin-bottom: 0;
                }
            }

            textarea {
                height: 100px;
                resize: none;
            }

            .el-checkbox-group .el-checkbox,
            .el-radio-group .el-radio {
                margin-right: 10px;
                margin-bottom: 10px;
                padding: 0 10px;
            }

        }

    }

    .button-block {
        .el-button {

            border-radius: 50%;
            width: 80px;
            height: 80px;

            &+.el-button {
                margin-left: 0;
            }
        }
    }


    .el-result {
        background-color: white;

        position: absolute;
        top: 0px;
        width: 100%;
        z-index: 99;

        * {
            user-select: none !important;
        }

    }

}
</style>

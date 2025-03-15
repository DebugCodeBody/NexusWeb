<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content ">
                    <div class="relative">
                        <div class="p-5px">
                            <el-form :model="form" :hide-required-asterisk="true" :rules="rules" label-width="auto"
                                ref="formEl">

                                <el-form-item label="工单条码" prop="moid">
                                    <order-input v-model="form.moid" :search="false" @scan="onMoidScan" />
                                </el-form-item>
                                <el-form-item label="工单号" v-if="scanResult.order">
                                    <span>{{ scanResult.order }}</span>
                                </el-form-item>
                                <el-form-item label="货位条码" prop="store">
                                    <order-input v-model="form.store" :search="false" :disabled="disabled"
                                        placeholder="扫描货位条码" />
                                </el-form-item>
                                <el-form-item label="当前工艺" v-if="scanResult.step">
                                    <el-tag>{{ scanResult.step }}</el-tag>
                                </el-form-item>

                                <el-form-item label="提示消息" v-if="scanResult.message">
                                    <el-tag type="danger">
                                        <span>{{ scanResult.message }}</span>
                                    </el-tag>
                                </el-form-item>

                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="submitLoading" :disabled="disabled"
                                    @click="onClickSubmit">提交</el-button>
                            </div>

                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                        </el-result>
                        <el-result v-if="initError" icon="error" class="error-result">
                            <template #extra>
                                <el-tag type="danger">请通过扫描二维码进入</el-tag>
                            </template>
                        </el-result>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import orderInput from "global@/orderInput/index.vue"

import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js";

import { scanMoid, submitScan } from "@/api"


const scanResult = $ref({

} as scanItem)

const form = $ref({

    /** 扫描的工单条码 */
    moid: "",

    /** 扫描的货架条码 */
    store: ""


});




let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    moid: [
        { required: true, message: '请扫码工单条码', trigger: 'blur' }
    ],
    store: [
        { required: true, message: '请扫码货位条码', trigger: 'blur' }
    ]
});


const disabled = $computed(() => {
    return !scanResult.enabled;
})






async function onMoidScan(moid: string) {


    const [error, result] = await to(scanMoid(moid))
    if (error) {
        return;
    }



    Object.assign(scanResult, result);







}



async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }


    try {

        submitLoading = true;



        const result = await submitScan(form.moid, form.store);

        if (!(submitDone = result.success)) {


            const { message } = result;

            ElMessageBox.confirm(
                message,
                title,
                {
                    confirmButtonText: '确定',
                    showConfirmButton: false,
                    type: 'error',
                    center: true
                }
            )


        }


    } catch {



    } finally {
        submitLoading = false;
    }




}



async function init() {

    try {

        initLoading = true;

        // await onMoidScan(form.moid = "536482");




    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref("扫码收料");

export default {
    name: "",
    title
}
</script>

<style lang="scss">
#declare {

    .testscrollList {
        background-color: white;
        z-index: 99;
    }


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
            width: 100%;

            &+.el-button {
                margin-left: 0;
            }
        }
    }


    .el-result {
        background-color: white;

        position: absolute;
        top: 0px;
        height: 100%;
        width: 100%;
        z-index: 99;

        * {
            user-select: none !important;
        }

    }

}
</style>

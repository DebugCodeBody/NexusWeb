<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content ">
                    <div class="relative">
                        <div class="p-5px">
                            <el-form :model="formData" :hide-required-asterisk="true" :rules="rules" label-width="auto"
                                ref="formEl">

                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="单号" prop="tissue">
                                            <el-tag>{{ formData.order }}</el-tag>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="金额" prop="tissue">
                                            <strong>{{ formData.amount }}</strong>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-form-item label="发票类型" class="finv_type">
                                    <el-button round v-if="formData.finv_type">{{ formData.finv_type }}</el-button>
                                </el-form-item>

                                <el-form-item label="单位名称" prop="fcompanyname">
                                    <div class="wh-full flex">
                                        <div class="flex-1">
                                            <el-input v-model="formData.fcompanyname" :readonly="formData.apply"
                                                type="textarea" autosize></el-input>
                                        </div>
                                        <div class="ml-10px">
                                            <el-button @click="onClickHistory">历史</el-button>
                                        </div>
                                    </div>
                                </el-form-item>

                                <el-form-item label="单位税号" prop="ftaxnumber">
                                    <el-input v-model="formData.ftaxnumber" :readonly="formData.apply"></el-input>
                                </el-form-item>
                                
                                <div class="phad-item">
                                    <el-form-item prop="phad">
                                        <div>
                                            <div>
                                                <span class="el-form-item__label">提供明细按明细开票</span>
                                                <el-switch v-model="formData.phad" inline-prompt active-text="是"
                                                    inactive-text="否" />
                                            </div>
                                            <div v-if="formData.phad" class="phad-tips">
                                                <span>我司将有专员联系您索要明细</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </div>

                                <el-form-item label="留言">
                                    <el-input v-model="formData.memo" type="textarea"></el-input>
                                </el-form-item>

                                <!-- <template v-if="isaddedInvoice">

                                    <el-form-item label="注册地址" prop="fcompanyaddr">
                                        <el-input v-model="formData.fcompanyaddr" :readonly="formData.apply" type="textarea" autosize></el-input>
                                    </el-form-item>
                                    <el-form-item label="注册电话" prop="ftelephone">
                                        <el-input v-model="formData.ftelephone" :readonly="formData.apply"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开户银行" prop="fbankofdeposit">
                                        <el-input v-model="formData.fbankofdeposit" :readonly="formData.apply"  type="textarea" autosize></el-input>
                                    </el-form-item>
                                    <el-form-item label="银行帐号" prop="faccountnumber">
                                        <el-input v-model="formData.faccountnumber" :readonly="formData.apply"></el-input>
                                    </el-form-item>

                                </template> -->


                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="initLoading" :disabled="true"
                                    v-if="initLoading">正在获取信息</el-button>
                                <el-button type="success" :disabled="true"
                                    v-else-if="formData.apply">本单已经确认过开票信息</el-button>
                                <el-button type="primary" :loading="submitLoading" @click="onClickSubmit"
                                    v-else>提交</el-button>

                            </div>

                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                        </el-result>
                        <el-result v-if="initError" icon="error" class="error-result">
                            <template #extra>

                                <div class="mb-10px">
                                    <el-tag type="info" v-if="formData.order">{{ formData.order }}</el-tag>
                                    <el-tag type="warning" v-else>暂无单号</el-tag>
                                </div>

                                <el-tag type="danger" v-if="noConfirm">当前不需要发票确认</el-tag>
                                <el-tag type="danger" v-else>请通过用户链接进入</el-tag>
                            </template>
                        </el-result>

                    </div>
                </div>
            </div>
        </div>

        <drawer v-if="showHistory" @select="onSlectHistory" />
    </div>
</template>

<script setup lang="ts">
import { ElForm, FormRules } from 'element-plus'

import drawer from "./drawer.vue"

import data from "./data"

import { getInfo, submitInfo } from "@/api"
import urlQuery from "@/utils/urlSearch"

if (process.env.NODE_ENV == "development") {

    urlQuery.order = urlQuery.order || "H5682";
    urlQuery.hash = urlQuery.hash || "d3c898784497189a8f7092161a6f8b19";

}


const formData = $ref({
    "type": 0,
    "amount": "",
    "finv_type": "",
    "fcompanyname": "",
    "ftaxnumber": "",
    "fcompanyaddr": "",
    "ftelephone": "",
    "fbankofdeposit": "",
    "faccountnumber": "",
    "apply": false,

    "email": "",
    "order": urlQuery.order,


    phad: false,
    memo: ""
});

let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);

/** 不需要确认 */
let noConfirm = $ref(false);
/** 显示弹窗 */
let showHistory = $ref(false);
/** 是否增值发票 */
const isaddedInvoice = $computed(() => {
    return formData.type == 2;
})


const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    fcompanyname: [
        { required: true, message: '请输入单位名称', trigger: 'blur' }
    ],
    ftaxnumber: [
        { required: true, message: '请输入单位税号', trigger: 'blur' }
    ],
    fcompanyaddr: [
        { required: true, message: '请输入注册地址', trigger: 'blur' }
    ],
    ftelephone: [
        { required: true, message: '请输入注册电话', trigger: 'blur' }
    ],
    fbankofdeposit: [
        { required: true, message: '请输入开户银行', trigger: 'blur' }
    ],
    faccountnumber: [
        { required: true, message: '请输入银行帐号', trigger: 'blur' }
    ]
})




async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }

    try {

        submitLoading = true;

        const { fcompanyname, ftaxnumber, phad, memo } = formData;

        const result = await submitInfo({
            fcompanyname,
            ftaxnumber,
            phad,
            memo
        });

        formData.apply = true;

    } catch (error: any) {

        if (error && error.code == 100) {
            init();
        }

    } finally {
        submitLoading = false;
    }




}


function onClickHistory() {

    showHistory = true;
    data.showHistory = true;

}


function onSlectHistory(item: invoiceInfo) {
    Object.assign(formData, item);

    formEl.clearValidate();


}

async function init() {

    try {

        initLoading = true;

        if (!urlQuery.order || !urlQuery.hash) {
            initError = true;
            return
        }

        const result = await getInfo();

        Object.assign(formData, result);



    } catch (error: any) {
        initError = true;

        if (error && error.code == 103) {
            noConfirm = true;
        }

    } finally {
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref("发票确认");

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
                resize: none;
            }

            .el-checkbox-group .el-checkbox,
            .el-radio-group .el-radio {
                margin-right: 10px;
                margin-bottom: 10px;
                padding: 0 10px;
            }
        }

        .phad-tips {
            color: #F56C6C
        }

        .phad-item{
            .el-form-item__label-wrap{
                display: none;
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
        width: 100%;
        z-index: 99;
        bottom: 0;

        * {
            user-select: none !important;
        }

        overflow: hidden;


    }

    .finv_type .el-button {
        color: var(--el-button-hover-text-color);
        border-color: var(--el-button-hover-border-color);
        background-color: var(--el-button-hover-bg-color);
        outline: 0;
    }



}
</style>

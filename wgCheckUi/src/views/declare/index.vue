<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap ">
                <div class="wh-full overflow-auto form-content flex flex-col">
                    <div class="relative">
                        <div class="p-5px">
                            <el-form 
                                :model="form" 
                                :hide-required-asterisk="true" 
                                :rules="rules"
                                label-width="auto"
                                ref="formEl">

                                <el-form-item label="工单号" prop="order">
                                    <order-input :search="false" :rules="onOrderRule" placeholder="请扫描订单号" v-model="form.order"  ref="orderEl"/>
                                </el-form-item>

                                <el-form-item label="检查结果" prop="result">
                                    <el-radio-group v-model="form.result" size="default">
                                        <el-radio 
                                            v-for="item in resultList" 
                                            :key="item.value" 
                                            :label="item.value"
                                            :value="item.value" 
                                            :border="true">{{ item.name }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>

                                <el-form-item label="图片" prop="imgCount">
                                    <upload-file v-model="form.imgCount" ref="imgUpload" />
                                </el-form-item>

   
                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="submitLoading" @click="onClickSubmit">提交</el-button>
                            </div>

                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                            <template #extra>
                                <el-button @click="clearForm">继续提交</el-button>
                            </template>
                        </el-result>
                        <el-result v-if="initError" icon="error" class="error-result">
                            <template #extra>
                                <el-tag type="danger">请通过扫描二维码进入</el-tag>
                            </template>
                        </el-result>

                    </div>
                    <div class="flex-1 mt-10px overflow-hidder">
                        <div class="wh-full">
                            <data-table :data="tableData" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js";


import orderInput from "global@/orderInput/index.vue"
import uploadFile from "global@/uploadFile/index.vue"
import dataTable from "./dataTable.vue";

import { messageError, messageSuccess } from "@/utils/elementLib"

import { submitCheck } from "@/api"



const resultList = $ref([
    {
        name: "正常",
        value: 1
    },
    {
        name: "异常",
        value: 2
    }
]);

const form = $ref({
    order: "",
    result: 0,
    imgCount: 0
});


let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);

let imgUpload = $ref<any>();
let orderEl = $ref<any>();

const tableData = $ref<any[]>([]);



const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    order: [
        { required: true, message: '请先扫描工单号', trigger: 'change' }
    ],
    result: [
        { required: true, min: 1, type: 'number', message: '请选择检查结果', trigger: 'change' }
    ],
    imgCount: [
        { validator(rule, value, callback, source, options) {

            let retError : Error | undefined = undefined 

            if(form.result == 2 && form.imgCount == 0 ){

                retError = new Error("请上传图片");

            }

            callback(retError);

        }, trigger: 'change' }
    ]
});


function onOrderRule(value:string){


    return true;
    // return /([a-zA-Z]\d+)-\d+(\/?-?\d+)+/g.test(value) || /([a-zA-Z]\d+-\d+)\/?/g.test(value) || /[a-zA-Z]\d+/g.test(value);

}


async function onClickSubmit() {

    try {
        await formEl.validate();
    } catch {
        return;
    }

    let imgSrc = [] as string[];



    try {
        const uploadResult = await imgUpload.uploadFile();
        imgSrc.push(...uploadResult);
    } catch {
        messageError("上传图片失败");
        return;
    }

    try {

        submitLoading = true;
        const result = await submitCheck(form.order, form.result, imgSrc);


        messageSuccess("提交成功");



        const setData = Object.assign({
            index: tableData.length + 1
        }, result)

        


        tableData.unshift(setData);

        clearForm();

    } catch {



    } finally {
        submitLoading = false;
    }




}


function clearForm() {


    submitDone = false;


    form.order = "";
    form.result = 0;

    
    imgUpload.clear();
    orderEl.clear();

    setTimeout(() => {
        formEl.resetFields();
    })

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

const title = $ref("外观检");

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
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 99;

        * {
            user-select: none !important;
        }

    }

}
</style>

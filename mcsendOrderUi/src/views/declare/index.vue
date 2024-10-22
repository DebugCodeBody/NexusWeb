<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content ">
                    <div class="relative wh-full">
                        <div class="p-5px wh-full flex flex-col">
                            <div class="flex-1">
                                <box-table />
                            </div>
                            <div class="button-block mt-10px">
                                <el-button type="warning" @click="onClickRefresh" v-if="isEmpty"
                                    :loading="submitLoading">刷新</el-button>
                                <el-button type="primary" :loading="submitLoading" @click="onClickSubmit"
                                    v-else>确定完成</el-button>
                            </div>

                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result"></el-result>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js";

import boxTable from "./boxTable.vue"
import tabManage from "./dataManage"

import { doneOrder } from "@/api"



const form = $ref({
    data: "",
    radio1: ""
});

let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
})

const isEmpty = computed(() => {
    return tabManage.table.data.length == 0;
})


async function onClickSubmit() {


    try {

        submitLoading = true;

        await doneOrder();

        submitDone = true;

    } catch {



    } finally {
        submitLoading = false;
    }




}


async function onClickRefresh() {


    try {

        initLoading = true;
        submitLoading = true;

        await tabManage.Refresh();


    } catch {

        
    } finally {
        initLoading = false;
        submitLoading = false;
    }




}



async function init() {

    await onClickRefresh();



}


init();




</script>

<script lang="ts">

const title = $ref("磨床仓送货");

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
        width: 100%;
        height: 100%;
        z-index: 99;


        * {
            user-select: none !important;
        }

    }

}
</style>

<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content ">
                    <div class="relative wh-full">

                        <div class="p-5px wh-full">
                            <data-table :data="data" />
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
import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js";
import getSearch from "@/utils/urlSearch"

import dataTable from "./dataTable.vue"

import { getInfo } from "@/api"




const form = $ref({

    id: getSearch("id"),

    key: getSearch("key")

});

const data = $ref<any[]>([]);

let initError = $ref(!(form.id && form.key));
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


async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }



    try {

        submitLoading = true;





    } catch {



    } finally {
        submitLoading = false;
    }




}



async function init() {

    try {

        initLoading = true;

        if(initError){
            return;
        }

        const result = await getInfo(form.id, form.key);

        data.push(...result);

    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref("发票详细");

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

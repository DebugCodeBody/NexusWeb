<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content flex flex-col" v-show="isSelectEmpty">
                    <div class="relative">
                        <div class="p-5px">
                            <el-form :model="form" :hide-required-asterisk="true" :rules="rules" label-width="auto"
                                ref="formEl">
                                <el-form-item label="工单号" prop="tissue">
                                    <el-input v-model="form.order" :disabled="true"></el-input>
                                </el-form-item>
                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="submitLoading" :disabled="disabled"
                                    @click="onClickSubmit">获取图纸列表</el-button>
                            </div>

                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                        </el-result>
                        <el-result v-if="initError" icon="error" class="error-result">
                            <template #extra>
                                <el-tag type="danger">请通过分享链接进入！</el-tag>
                            </template>
                        </el-result>

                    </div>
                    <div class="flex-1 overflow-hidden">
                        <div class="wh-full overflow-auto">
                            <data-table />
                        </div>
                    </div>
                </div>

                <div class="wh-full overflow-auto form-content flex flex-col" v-show="!isSelectEmpty">
                    <update-form @done="onClickSubmit"/>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

import { ElForm, FormRules } from 'element-plus'
import dataTable from "./dataTable.vue"
import updateForm from "./updateForm.vue"


import urlQuery from "@/utils/urlSearch"
import dataManage from "./dataManage"


if (process.env.NODE_ENV == "development") {

    urlQuery.order = urlQuery.order || "H5682";
    urlQuery.hash = urlQuery.hash || "d3c898784497189a8f7092161a6f8b19";
}

const form = $ref({
    order: urlQuery.order,
    hash: urlQuery.hash
});

let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);




const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
   
});
const disabled = $computed(() => {
    return !form.order || !form.hash;
});
const isSelectEmpty = $computed(() => {

    

    return !dataManage.select.item;
})



async function onClickSubmit() {

    try {
        await formEl.validate();
    } catch {
        return;
    }


    try {

        submitLoading = true;

        await dataManage.getFile(form.order, form.hash);


    } catch {



    } finally {
        submitLoading = false;
    }


}



async function init() {

    try {

        initLoading = true;

        if (disabled) {
            initError = true;
            return;
        }


        await onClickSubmit();


    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}


onMounted(() => {

    init();
    
})



</script>

<script lang="ts">

const title = $ref("图纸修改");

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
        z-index: 99;

        * {
            user-select: none !important;
        }

    }

    .error-result {
        height: 300px;
    }

}
</style>

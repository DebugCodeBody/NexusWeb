<template>
    <div id="suggest" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content " >
                    <div class="relative">
                        <div class="p-5px">
                            <el-form 
                                :model="form" 
                                :hide-required-asterisk="true" 
                                :rules="rules"
                                label-width="auto" 
                                ref="formEl">

                                <el-form-item label="图片">
                                    <upload-file ref="uploadEl" />
                                </el-form-item>

                                <el-form-item label="建议内容" prop="content">
                                    <el-input v-model="form.content" type="textarea"></el-input>
                                </el-form-item>
                                
                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="submitLoading" @click="onClickSubmit">提交</el-button>
                            </div>

                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                        </el-result>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

import uploadFile from "global@/uploadFile/index.vue";

import { ElForm,FormRules  } from 'element-plus'
import { messageError } from "@/utils/elementLib";
import { createSuggest } from "@/api"
import to from "await-to-js";



const form = $ref({
    content: ""
});

let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const formEl = $ref<typeof ElForm>();
const uploadEl = $ref<InstanceType<typeof uploadFile>>();

const rules = reactive<FormRules>({
    content: [
        { required: true, message: '请填写建议内容', trigger: 'change' }
    ]
})


async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }

    let img = [];

    try {
        img = await uploadEl.uploadFile();
    } catch {
        messageError("图片上传失败");
        return;
    }

    try{

        submitLoading = true;

        await createSuggest(form.content, img);

        submitDone = true;

    }finally{
        submitLoading = false;
    }




}



async function init(){

    try{

        initLoading = true;


    }catch{
        initError = true;
    }finally{
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref("提建议");

export default {
    name: "",
    title
}
</script>

<style lang="scss">
#suggest {

    .testscrollList{
        background-color: white;
        z-index: 99;
    }
    

    .declare_view{
        max-width: 800px;
        margin:auto;
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

            .el-form-item{
                &.line-item{
                    flex-direction: column;
                }

                &.mb-0{
                    margin-bottom: 0;
                }
            }

            textarea{
                height: 100px;
                resize: none;
            }

            .el-checkbox-group .el-checkbox,
            .el-radio-group .el-radio{
                margin-right: 10px;
                margin-bottom: 10px;
                padding: 0 10px;
            }

        }

    }

    .button-block {
        .el-button {
            width: 100%;

            &+.el-button{
                margin-left: 0;
            }
        }
    }


    .el-result {
        background-color: white;

        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        z-index: 99;

        * {
            user-select: none !important;
        }

    }

}
</style>

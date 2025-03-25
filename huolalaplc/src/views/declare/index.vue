<template>
    <div id="declare">
        <div class="declare-view">
            <h3 class="title">{{ title }}</h3>
            <div class="relative">
                <el-form :model="form" :rules="rules" ref="formEl" :hide-required-asterisk="true" label-width="auto">
                    <el-form-item label="工单单号" prop="moid">
                        <order-input 
                            :default="true" 
                            :search="false" 
                            placeholder="请扫描订单号"
                            v-model="form.moid" ref="moidInput">
                        </order-input>
                    </el-form-item>
                    <el-form-item label="登记类型" prop="type">
                        <el-radio-group v-model="form.type">
                            <el-radio :value="0" :label="0">货拉拉</el-radio>
                            <el-radio :value="1" :label="1">发货前</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="图片上传" prop="imgLen">
                        <upload-file ref="imgUpload" v-model="form.imgLen">
                        </upload-file>
                    </el-form-item>
                    <el-form-item label="留言" prop="memo">
                        <el-input type="textarea" v-model="form.memo" />
                    </el-form-item>
                </el-form>
                <div class="button-area">
                    <el-button type="primary" @click="onClickSubmit" v-if="form.moid">提交</el-button>
                    <el-button type="primary" @click="onClickScan" v-else>扫描</el-button>
                </div>
                <el-result class="wh-full" icon="success" sub-title="提交完成" v-if="done">
                </el-result>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import to from "await-to-js"


import orderInput from "global@/orderInput/index.vue"
import uploadFile from "global@/uploadFile/index.vue"

import type { FormInstance, FormRules } from 'element-plus'
import { messageError } from "@/utils/elementLib"
import { create, uploadImg } from "@/api"

const form = $ref({
    moid: "",
    imgLen: 0,
    memo: "",
    type: null
});


let done = $ref(false);

const moidInput = $ref<InstanceType<typeof orderInput>>()
const imgUpload = $ref<InstanceType<typeof uploadFile>>()
const formEl = $ref<FormInstance>();


const rules = $ref({
    type: [{
        required: true,
        message: '请选择登记类型',
        trigger: 'blur'
    }],
    moid: [{
        required: true,
        message: '请填写工单号',
        trigger: 'blur'
    }],
    imgLen: [{
        validator(a: any, b: any, c: any) {
            if (form.imgLen == 0) {
                c(new Error('请上传至少一张图片'))
            } else {
                c();
            }
        },
        trigger: 'blur'
    }]
});



async function onClickSubmit() {

    try {
        await formEl.validate();
    } catch {
        return;
    }


    const { file } = await imgUpload.getFile();


    const uploadArr = file.map((elem: any) => {
        const sendImg = new FormData();
        sendImg.append("file", (elem as any), "file.jpg");
        return uploadImg(sendImg);
    });


    let [err, result] = await to(Promise.all(uploadArr));
    if (err) {
        messageError("图片上传失败，请重试");
        return;
    }

    [err] = await to(create({

        order: form.moid,
        memo: form.memo,
        img: result,
        type: form.type

    }));

    if (err) {
        return;
    }


    done = true;






}

async function onClickScan() {
    moidInput.Scan();
}

onMounted(() => {



})

</script>

<script lang="ts">

const title = "出货前拍照";
export default {
    name: "",
    title
}

</script>

<style lang="scss">
#declare {
    flex: 1;

    .title {
        height: 50px ;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: #66b1ff;
    }

    .declare-view {
        position: relative;
        height: 100%;

        padding-top: 5px;
        max-width: 800px;
        padding-bottom: 10px;
        margin: auto;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;


    }

    .el-result {
        max-width: 800px;
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        position: relative;
        padding: 10px;
        height: 300px;

    }


    .el-input__inner[disabled] {

        color: #999 !important;
        -webkit-text-fill-color: #999 !important;
        opacity: 1 !important;

    }

    .declare_header.title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: white;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: rgb(102, 177, 255);
    }

    form {
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        position: relative;
        padding: 10px;

        &.grouperror {
            height: 350px;
        }


        .el-select {
            * {
                user-select: none;
            }
        }

        .time-input {
            &>.el-form-item__label-wrap {
                display: none;
            }
        }

        .result .el-tag__content {
            font-size: 20px;
        }

        .el-radio__input,
        .el-radio__label,
        .el-tag {
            font-size: 20px;
        }
    }

    .fun-area {
        .el-button {
            margin: auto;
            display: inherit;
            margin-top: 20px;
            width: 100%;
            height: 100%;
        }
    }


    .upload {

        .el-upload,
        .el-upload-list__item-actions,
        .el-upload-list li {
            height: 80px;
            width: 80px;
            line-height: 80px;
        }

        .el-icon-plus {
            font-size: 20px;
        }
    }

    textarea {
        height: 100px;
        resize: none;
    }

    .el-result {
        z-index: 999;
    }

    .button-area {
        margin: 10px 0px;
        display: flex;

        button {
            width: 100%;
        }
    }


    .scann-table {
        flex: 1;
    }


    .el-result {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(255, 255, 255);
        width: 100%;
        height: 100%;
    }


}
</style>

<template>
    <div id="declare">
        <div class="declare-view">
            <el-form label-width="80px" :model="ruleForm" :hideRequiredAsterisk="true" ref="dataForm" :rules="rules">
                <el-form-item label="异常订单" prop="orderid">
                    <el-radio-group v-model="ruleForm.orderid" v-if="select.length <= 2">
                        <el-radio v-for="(item, index) in select" :key="index" :label="index">{{ item.orderid }}</el-radio>
                    </el-radio-group>
                    <el-select v-model="ruleForm.orderid" v-if="select.length == 0 || select.length > 2">
                        <el-option v-for="(item, index) in select" :key="index" :label="item.orderid" :value="index" />
                    </el-select>
                </el-form-item>
                <template v-if="ruleForm.orderid! >= 0">
                    <el-form-item label="申报人员">
                        <el-input v-model="select[ruleForm.orderid!].username" disabled />
                    </el-form-item>
                    <el-form-item label="当前工艺">
                        <el-tag>{{ select[ruleForm.orderid!].whname }}</el-tag>
                    </el-form-item>
                    <el-form-item label="详细描述">
                        <el-input v-model="select[ruleForm.orderid!].reason" type="textarea" disabled />
                    </el-form-item>
                </template>
                <el-form-item label="上传图片" prop="img">
                    <upload-file ref="uploadEl" v-model="fileLength" :height="80" :width="80" />
                </el-form-item>
                <el-result icon="success" title="提交成功" v-if="done"></el-result>
                <el-result icon="warning" title="暂无异常订单" v-if="error"></el-result>
            </el-form>
            <div class="button-area" v-if="!done && !error">
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import uploadFile from "global@/uploadFile/index.vue";


import to from "await-to-js";
import { ElMessage, ElForm } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

import { zipImg } from "@/utils/other"
import { getUserName } from "@/store/user"



import { getErrorOrder, sendSubmit } from "@/api"


const ruleForm = $ref<{
    [key: string]: any,
    orderid: number | undefined
}>({
    "name": "",
    "orderid": undefined
});



const select = $ref<errorOrders>([])

const fileLength = $ref(0);
const uploadEl = $ref<InstanceType<typeof uploadFile>>();


const dataForm = $ref<FormInstance>();

let error = $ref(false);
let done = $ref(false);
let selectDone = $computed(() => {
    return ruleForm.orderid != undefined;
})

const rules = reactive<FormRules>({
    orderid: [
        { required: true, message: '请先选择异常订单', trigger: 'change' }
    ],
    img: [{
        validator(a: any, b: any, callback: any) {
            if (fileLength == 0) {
                return callback(new Error("请上传异常图片"))
            }
            callback();
        }, trigger: 'blur'
    }]
})



async function init() {

    if (process.env.NODE_ENV == "development") {

        select.push({
            /** 序号 */
            badid: 1,
            /** 工单号 */
            orderid: "orderid",
            /** 工艺 */
            whname: "whname",
            /** 描述 */
            reason: "reason",
            /** 申报姓名 */
            username: "username"
        })

    }

    const result = await getErrorOrder();



    select.push(...result)
    if (select.length == 0) {
        error = true;
    } else if (select.length == 1) {
        ruleForm.orderid = 0;
    }

}

async function onSubmit() {
    const [error] = await to(dataForm.validate());
    if (error) {
        return;
    }


    const fileArr = []
    {

        const [err, result] = await to(uploadEl.uploadFile()) as any;

        if (err) {
            ElMessage.error("上传图片错误，请重试");
        }

        fileArr.push(...result)

    }

    const [err, result] = await to(sendSubmit({
        badid: `${select[ruleForm.orderid!].badid}`,
        img: fileArr
    }));
    if (err) {
        ElMessage.error((err as any).msg || err.message || "提交错误，请联系管理员");
    } else {
        done = !err;
    }

}

async function onSelectFile(event: Event) {

}

init();

onMounted(() => {
    ruleForm.name = getUserName();
})


</script>

<script lang="ts">
const title = "品检异常";


export default {
    name: "",
    title
}
</script>

<style lang="scss">
#declare {
    flex: 1;


    .declare-view {
        position: relative;
        height: 100%;

        padding-top: 10px;
        max-width: 800px;
        padding-bottom: 20px;
        margin: auto;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;


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

        .el-result {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(255, 255, 255);
        }

        .el-select {
            * {
                user-select: none;
            }
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
        margin-top: 20px;
        display: flex;

        button {
            width: 100%;
        }
    }

    .is-max {
        .el-upload--picture-card {
            display: none;
        }
    }





}
</style>

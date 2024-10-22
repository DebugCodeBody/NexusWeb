<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full overflow-hidden flex flex-col">
            <h3 class="title">异常登记</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden relative declare_wrap">
                <div class="form-content wh-full overflow-auto flex flex-col">
                    <div class="relative overflow-hidden" :class="{
                        done: submitDone
                    }">
                        <div class="p-5px">
                            <el-form :model="form" :hide-required-asterisk="true" :rules="formRules" label-width="auto"
                                ref="formEl">
                                <el-form-item label="快捷输入">
                                    <el-radio-group v-model="form.quickReasons" size="default" @change="onQuickChange">
                                        <el-radio v-for="item in reasonsList" :key="item.name" :label="item.name"
                                            :border="true">{{
                        item.name }}</el-radio>
                                        <el-radio label="" :border="true">其他</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="报告图片" prop="fileNum">
                                    <upload-file :isPasteImg="true" v-model="form.fileNum" ref="uploadEl" />
                                </el-form-item>

                                <el-form-item label="原因" prop="reasons">
                                    <el-input v-model="form.reasons" type="textarea"></el-input>
                                </el-form-item>

                            </el-form>
                        </div>
                        <div class="button-block mt-10px flex">
                            <el-button type="success" :loading="submitLoading" @click="onClickNeedConfirm"
                                v-if="needConfirm">工单完工</el-button>

                            <el-button type="primary" :loading="submitLoading" @click="onClickSubmit">提交</el-button>

                        </div>
                        <div class="button-block mt-10px flex" v-if="order">
                            <el-button :disabled="submitLoading" @click="onClickToDocument">查看生产文档</el-button>
                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                        </el-result>
                        <el-result v-if="initError" icon="error" class="error-result">

                            <template #extra>
                                <div v-if="!moid || !supid">
                                    <el-tag type="danger">请通过扫描二维码进入</el-tag>
                                </div>
                            </template>

                        </el-result>

                    </div>

                    <div class="flex-1 overflow-hidden mt-10px" v-if="logList.length">
                        <div class="wh-full overflow-auto p-10px">
                            <template v-for="(arrItem, index) in logList" :key="index">
                                <log-item :data="arrItem" />
                            </template>
                        </div>
                    </div>

                </div>
                <el-result v-if="needDone" :icon="neetIcon" :title="neetTitle" class="success-result">
                </el-result>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus'
import type { FormRules } from 'element-plus'
import uploadFile from "global@/uploadFile/index.vue"
import getSearch from "@/utils/urlSearch"
import logItem from "./logItem.vue"

import { getReasons, setSubmit, getTrackLog, findSupid, osupDone } from "@/api"





const form = $ref({
    reasons: "",
    quickReasons: null,
    fileNum: 0
});

const uploadEl = $ref<typeof uploadFile>();
let initError = $ref(false);
let initLoading = $ref(false);

let submitDone = $ref(false);
let submitLoading = $ref(false);



const formEl = $ref<typeof ElForm>();
const reasonsList = $ref<{
    name: string,
    is_img: boolean,
    is_prefix: boolean
}[]>([]);
const logList = $ref<logItem[][]>([])

let moid = $ref(getSearch("m"));
let supid = $ref(getSearch("s"));
let order = $ref(getSearch("o"));


/** 是否有完工按钮 */
let needConfirm = $ref(false);

/** 完工结果 */
let needResult = $ref("");
/** 完工完成 */
let needDone = $ref(false);

/** 选中的快捷异常 */
let selectReasons = $computed(() => {

    return reasonsList.find((elem) => elem.name == form.quickReasons)!

})

const neetIcon = $computed(() => {
    return !needResult ? "success" : "warning"
})
const neetTitle = $computed(() => {
    return needResult || "提交成功"
})





if (process.env.NODE_ENV != "production") {

    if (!moid) {
        moid = "482965";
    }
    if (!supid) {
        supid = "95405";
    }
    if (!order) {
        order = "N8312";
    }
}


const formRules = $ref<FormRules>({
    reasons: [
        { required: true, message: '请填写原因', trigger: 'change' }
    ],
    fileNum: [
        {
            validator(rule, value, callback, source, options) {

                let retErr: any = undefined;

                if (selectReasons && selectReasons.is_img && value == 0) {

                    retErr = new Error(`${selectReasons.name} 必须上传图片`);

                }


                callback(retErr);

            }, trigger: 'change'
        }
    ],
})


function onQuickChange(value: string) {
    

    if(selectReasons){
        form.reasons = selectReasons.is_prefix ? "" : value;
    }else{
        form.reasons = "";
    }
    

    


}

/** 提交表单 */
async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }





    try {

        submitLoading = true;

        let { reasons } = form;

        const file = await uploadEl.uploadFile();


        if (selectReasons && selectReasons.is_prefix) {

            reasons = reasons.trimStart();

            if (reasons != selectReasons.name) {

                if (reasons.startsWith(selectReasons.name)) {
                    reasons = reasons.slice(selectReasons.name.length, -1);
                }

                reasons = `${selectReasons.name}:${reasons}`;

            }

        }

        const sendData = {
            reasons,
            img: file
        }

        await setSubmit(moid, supid, sendData);


        submitDone = true;

        refreshLog();


    } catch {

    } finally {
        submitLoading = false;
    }

}



/** 提交工单完工 */
async function onClickNeedConfirm() {


    try {

        submitLoading = true;

        const { result } = await osupDone(moid, supid);


        needResult = result;
        needDone = true;

        refreshLog();



    } catch {

    } finally {
        submitLoading = false;
    }

}

function onClickToDocument() {


    if (order) {
        location.href = `${location.origin}/ding/document?order=${order}`
    }

}



async function init() {


    if (!moid || !supid) {
        initError = true;
        return;
    }


    try {

        initError = false;
        initLoading = true;

        const result = await getReasons();

        reasonsList.push(...result);

        needConfirm = await findSupid(supid);



    } catch {

        initError = true;

    } finally {

        initLoading = false;
    }





}

async function refreshLog() {

    if (!moid || !supid) {
        return;
    }


    const result = await getTrackLog(moid, supid);



    logList.length = 0;
    logList.push(...result);


}


init();
refreshLog();

onMounted(() => {


    document.querySelector(".el-upload__input")!.setAttribute("accept", "image/*")



})




</script>

<script lang="ts">

const title = "异常登记";

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

    .relative.done {
        height: 150px;
    }

    .form-content {

        form {
            padding: 10px;
            box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);

            .el-form-item {
                &.line-item {
                    flex-direction: column;
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
            border-radius: 10px;

        }
    }


    .el-result {
        background-color: white;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        padding: 10px;

        * {
            user-select: none !important;
        }

    }


    .log-content {
        margin-bottom: 10px;
        padding: 10px;
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        border-radius: 5px;
        overflow: hidden;
    }

    .log-item {
        padding: 10px;
        background-color: white;

        // span.stageid:not(:first-child){
        //     display: none;
        // }

        &:last-child {
            margin-bottom: 0;
        }

        .time {
            font-size: 12px;
        }

        .info {
            font-size: 14px;
        }
    }
}
</style>

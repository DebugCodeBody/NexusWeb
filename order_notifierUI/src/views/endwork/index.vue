<template>
    <div id="declare">
        <div class="declare-view w-full" ref="declareView" v-loading="loading">
            <h3 class="declare_header title">{{ title }}</h3>

            <template v-if="id && !submitSuccess">
                <el-form :model="form" :rules="rule" :hide-required-asterisk="true" label-width="auto" ref="formEl">
                    <el-form-item label="工单单号" prop="order" v-if="false">
                        <el-input v-model="form.order" placeholder="请输入内容" :disabled="true"></el-input>
                    </el-form-item>
                    <work-step ref="step" v-model="stepList" :getTitle="getTitle"
                        style="max-height: 400px; margin-bottom: 10px">
                        <template #default="{ item } : { item: workStep }">
                            <p>操作人员：{{ item.username }}</p>
                            <p>创建时间：{{ parseTime(item.createdate) }}</p>
                            <p v-if="item.memo">留言内容：{{ item.memo }}</p>
                        </template>
                    </work-step>
                    <el-card class="step-card">
                        <el-form-item label="留言" prop="memo">
                            <el-input type="textarea" v-model="form.memo" />
                        </el-form-item>

                    </el-card>

                </el-form>
                <div class="button-area">
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                </div>
            </template>
            <el-result icon="warning" sub-title="请通过群链接进入本页面" v-if="!id">
            </el-result>

            <el-result icon="success" title="提交成功" v-if="submitSuccess"></el-result>

        </div>

    </div>
</template>

<script setup lang="ts">
import to from "await-to-js";

import workStep from "global@/workStep/index.vue";
import { getTitle, parseTime } from "@/utils/other"
import getSearch from "@/utils/urlSearch"

import { workRecall } from "@/api"
import { getStep } from "@/api/step"
import { off } from "process";
import { ElMessage } from "element-plus";




let submitSuccess = $ref(false)

const id = getSearch("id");

const formEl = $ref<any>();
const form = $ref({
    order: "",
    memo: ""
});
const rule = $ref({ memo: [{ required: true, message: '请输入留言信息', trigger: 'blur' }] });

let loading = $ref(true);

const stepList = $ref<any[]>([])

async function init() {

    const result = await getStep(id)

    stepList.push(...result);

    loading = false;

}

async function onSubmit() {
    const [formErr] = await to(formEl.validate());
    if (formErr) {
        return;
    }


    const [err] = await workRecall(id, form.memo)
    if (err) {
        ElMessage.error((err as any).msg || err.message || "提交失败，请重试")
    } else {
        submitSuccess = true;
    }

}


onMounted(() => {

    if (id) {
        init();
    }

})



</script>

<script lang="ts">

const title = "撤销结案";
export default {
    title,
    name: ""
}
</script>

<style lang="scss">
#declare {

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
        margin-bottom: 20px;
        display: flex;

        button {
            width: 100%;
        }
    }

}
</style>

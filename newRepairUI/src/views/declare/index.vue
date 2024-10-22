<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content flex flex-col justify-between">
                    <div class="relative">
                        <div class="p-5px">
                            <el-form :model="form" :hide-required-asterisk="true" :rules="rules" label-width="auto"
                                ref="formEl">
                                <el-form-item label="申报人员">
                                    <el-input v-model="form.name" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="设备名字">
                                    <el-input v-model="form.machine" disabled></el-input>
                                </el-form-item>

                                <el-form-item label="问题类型">
                                    <el-radio-group v-model="form.problem" size="default">
                                        <el-radio v-for="(item, index) in  handleResult.typename" :key="index"
                                            :label="index" :value="index" border>{{ item }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>

                                <el-form-item label="问题描述" prop="memo">
                                    <el-input v-model="form.memo" type="textarea"></el-input>
                                </el-form-item>

                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="submitLoading" @click="onClickSubmit">提交</el-button>
                            </div>

                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                        </el-result>
                        <el-result v-if="initError" icon="error" class="error-result">
                            <template #extra>
                                <el-tag type="danger">请通过扫描二维码进入</el-tag>
                            </template>
                        </el-result>

                    </div>

                    <url-list />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js";

import urlList from "./urlList.vue"

import getSearch from "@/utils/urlSearch"
import { getUserName } from "@/store/user"
import { addProblem, getDescribe } from "@/api"


const form = $ref({

    mid: getSearch("mid"),

    /** 用户名 */
    name: getUserName(),

    /** 设备名字 */
    machine: "",

    /** 问题类型 */
    problem: 0,

    /** 问题描述 */
    memo: ""
});


const handleResult = $ref({
    tid: 0,
    name: "",
    typename: [] as string[]
})


let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);

/** 是否选中了其他问题 */
const isOther = $computed(() => {
    return form.problem == (handleResult.typename.length - 1)
});
const problemLabel = $computed(() => {
    return handleResult.typename[form.problem];
})


const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    memo: [
        {
            required: true, trigger: 'blur', validator(rule, value, callback, source, options) {

                let error: Error | undefined = undefined;

                if (isOther && !value) {

                    error = new Error("请输入问题描述");

                }

                callback(error);

            }
        },
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

        await addProblem(form.name, form.mid, handleResult.tid, form.machine, problemLabel, form.memo);

        submitDone = true;


    } catch {



    } finally {
        submitLoading = false;
    }




}



async function init() {


    try {

        initLoading = true;

        const { mid } = form;
        if (!mid) {
            initError = true;
            return;
        }

        const [err, result] = await to(getDescribe(mid));
        if (err) {
            return;
        }

        form.machine = result.name;

        Object.assign(handleResult, result);

        handleResult.typename.push("其他问题");


    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref("维修申报");

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
        height: 100%;
        width: 100%;
        z-index: 99;

        * {
            user-select: none !important;
        }

    }

}
</style>

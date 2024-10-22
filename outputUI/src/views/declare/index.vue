<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">创建任务</h3>
            <div class="declare_wrap wh-full mt-10px overflow-hidden">
                <div class="form-content wh-full overflow-auto">
                    <div class="relative">
                        <div class="p-5px">
                            <el-form 
                                :model="form" 
                                :rules="rules"
                                :hide-required-asterisk="true" 
                                label-width="auto" 
                                ref="formEl">
                                <el-form-item label="负责组" prop="group">
                                    <el-select v-model="form.group" @change="onChnageGroup">
                                        <el-option v-for="item in data.group" :key="item.id" :label="item.title"
                                            :value="item.id" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="工单号" prop="orderid">
                                    <order-input v-model="form.orderid"/>
                                </el-form-item>
                                <el-form-item label="执行人员" prop="execute">
                                    <el-select v-model="form.execute">
                                        <el-option v-for="item in usernameArr" :key="item" :label="item" :value="item" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="是否紧急" prop="tight">
                                    <el-switch v-model="form.tight" />
                                </el-form-item>
                                <el-form-item label="任务内容" prop="info">
                                    <el-input v-model="form.info" type="textarea"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="button-block mt-10px">
                            <el-button type="primary" :loading="submitLoading" @click="onClickSubmit">提交</el-button>
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
import { ElForm } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

import orderInput from "global@/orderInput/index.vue"

import { getDeclare, createDeclare } from "@/api"


const form = $ref({
    group: "",
    orderid: "",
    execute: "",
    tight: false,
    info: ""
});

const data = $ref({
    group: [] as declareInfo[]
})
const usernameArr = computed(() => {

    const selectGroup = form.group;
    const retGroup = data.group.find((elem) => selectGroup == elem.id);

    return retGroup ? retGroup.username : [];

})


let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const rules = reactive<FormRules>({
    group: [
        { required: true, message: '请选择负责组', trigger: 'blur' },
    ],
    orderid: [
        { required: true, message: '请填写工单号', trigger: 'blur' },
    ],
    info: [
        { required: true, message: '请填写任务内容', trigger: 'blur' },
    ]
})

const formEl = $ref<typeof ElForm>();


async function onChnageGroup(id: number) {
    form.execute = "";
}


async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }



    try {

        submitLoading = true;

        await createDeclare(form);


        submitDone = true;



    } catch {



    } finally {
        submitLoading = false;
    }




}



async function init() {

    try {

        initLoading = true;

        const groupArr = await getDeclare();

        data.group.push(...groupArr);








    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = "创建任务";

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

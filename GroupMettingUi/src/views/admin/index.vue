<template>
    <div id="admin" class="wh-full ">
        <div class="declare-view">


            <div class="relative overflow-auto  p-10px">

                <div class="relative">
                    <el-form :model="formData" :hide-required-asterisk="true" label-width="auto" ref="DefaultFormEl"
                        :rules="defaultRules">
                        <el-form-item label="默认组织员" prop="defaultName">
                            <el-input v-model="formData.defaultName"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <div class="w-full">
                                <el-button class="w-full" @click="onSubmitDefault">提交修改</el-button>
                            </div>
                        </el-form-item>
                    </el-form>

                    <div class="h-10px"></div>

                    <el-form :model="formData" :hide-required-asterisk="true" label-width="auto" ref="groupFormEl"
                        :rules="groupRules">

                        <el-form-item label="使用群" prop="name">
                            <div class="w-full flex">
                                <el-select v-model="formData.name" placeholder="请选择组织人员" class="flex-1"
                                    @change="onGroupChange">
                                    <el-option v-for="item in groupArr" :key="item.name" :label="item.title"
                                        :value="item.name" />
                                </el-select>
                                <el-button class="ml-10px" @click="onClickAddGroup">添加</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="机器人" prop="webHook">
                            <el-input v-model="formData.webHook" type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item label="组织人" prop="tissue">
                            <div class="w-full tissue-list">
                                <el-tag v-for="item in formData.tissue" :key="item" closable @close="onTissueClose(item)">{{
                                    item }}</el-tag>
                                <el-input class="add-tissue ml-10px" v-model="formData.addTissue"></el-input>
                                <el-button class="ml-10px" :disabled="!formData.addTissue"
                                    @click="onAddTissue">添加</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <div class="w-full">
                                <el-button class="w-full" @click="onSubmitGroup">提交</el-button>
                            </div>
                        </el-form-item>

                    </el-form>

                </div>

            </div>
        </div>

        <popDialog title="添加群" v-model="addDialog">
            <div class="wh-full overflow-hidden">
                <div v-for="item in addList" :key="item.openConversationId" class="mb-10px" @click="onClickAddNewItem(item)">
                    <el-button>{{ item.title }}</el-button>
                </div>
            </div>
        </popDialog>




    </div>
</template>

<script setup lang="ts">
import popDialog from "global@/popDialog/index.vue"

import type { FormInstance, FormRules } from 'element-plus'
import { messageSuccess } from "@/utils/elementLib"

import { getSetting, setDefaultUser, setSetting, getAllGroup } from "@/api"
import to from 'await-to-js'


type groupInfo = {
    name: string,
    title: string,
    webHook: string,
    tissue: string[]
}

type info = {
    openConversationId: string,
    title: string

}




let DefaultFormEl = $ref<any>();
const defaultRules = reactive<FormRules>({
    defaultName: [
        { required: true, message: '请填写默认组织人员', trigger: 'change' }
    ]
});


const groupRules = reactive<FormRules>({
    name: [
        { required: true, message: '请选择群', trigger: 'change' }
    ],
    webHook: [
        { required: true, message: '请填写机器人链接', trigger: 'change' }
    ],
    tissue: [
        { required: true, message: '组织人员数量必须大于1', trigger: 'change' }
    ]
});



let loading = $ref(false);
let addDialog = $ref(false);
let addList = $ref<info[]>([]);




const groupArr = $ref<groupInfo[]>([]);
let selectGroup = $ref<groupInfo>({} as groupInfo);


let groupFormEl = $ref<any>();

const formData = $ref({
    title: "",
    name: "",
    addTissue: "",
    webHook: "",
    defaultName: "",
    tissue: [] as string[]
})


function onAddTissue() {


    if (formData.tissue.indexOf(formData.addTissue) == -1) {
        formData.tissue.push(formData.addTissue)
    }

    formData.addTissue = "";

}

function onTissueClose(name: string) {
    const index = formData.tissue.indexOf(name);
    if (index > -1) {
        formData.tissue.splice(index, 1);
    }



}


async function onSubmitDefault() {

    try {
        await DefaultFormEl.validate();
    } catch {
        return;
    }



    try {
        loading = true;

        const [err] = await to(setDefaultUser(formData.defaultName));
        if (err) {
            return;
        }


        messageSuccess("修改成功");
        init();


    } finally {
        loading = false;
    }

}


async function onSubmitGroup() {
    try {
        await groupFormEl.validate();
    } catch {
        return;
    }


    let change = false
    if (formData.webHook != selectGroup.webHook) {
        change = true;
    }
    if (JSON.stringify(formData.tissue) != JSON.stringify(selectGroup.tissue)) {
        change = true;
    }

    if (!change) {
        return;
    }


    const sendData = JSON.parse(JSON.stringify(selectGroup));


    sendData.webHook = formData.webHook;
    sendData.tissue = formData.tissue;



    try {


        loading = true;
        const [err] = await to(setSetting(sendData));
        if (err) {
            return;
        }

        messageSuccess("修改成功");
        init();

        selectGroup = JSON.parse(JSON.stringify(sendData));



    } finally {

        loading = false;
    }

}

async function onClickAddGroup() {

    const data = await getAllGroup();

    addList.length = 0;
    addList.push(...data);

    addDialog = true;

}

function onClickAddNewItem(item: info) {

    selectGroup = {
        name:item.openConversationId,
        title: item.title
    } as any;


    formData.name = item.title;
    formData.title = item.title;
    formData.addTissue = "";
    formData.webHook = "";
    formData.tissue = [formData.defaultName];
    

    addDialog = false;

}


function onGroupChange(value: string) {

    selectGroup = groupArr.find((elem) => elem.name == value)!;

    formData.tissue = [...selectGroup.tissue];
    formData.webHook = selectGroup.webHook;

}


async function init() {

    const data = await getSetting();

    groupArr.length = 0;
    groupArr.push(...data.list);

    formData.defaultName = data.default;

}


init()



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
#admin {
    flex: 1;

    ;

    audio {
        width: 0;
        height: 0;
    }

    .title {
        height: 50px;
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
        padding: 10px;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        background: white;


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

        .time-input {
            &>.el-form-item__label-wrap {
                display: none;
            }
        }

        .result .el-tag__content {
            font-size: 20px;
        }

        .el-checkbox.is-bordered {
            margin-right: 10px;
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

    .el-checkbox {
        margin-bottom: 5px;
        min-width: 90px;

    }

    .tissue-list {

        .el-tag:not(:first-child) {
            margin-left: 10px;
        }

    }

    .add-tissue {
        width: 100px !important;
    }


}
</style>

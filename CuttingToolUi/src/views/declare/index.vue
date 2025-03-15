<template>
    <div id="declare" class="wh-full">

        <div class="declare-view">
            <h3 class="title">刀具领取</h3>

            <div class="relative overflow-auto p-10px flex-1">

                <div class="wh-full relative flex flex-col">
                    <el-form :model="form" :rules="rules" :hide-required-asterisk="true" label-width="auto" ref="formEl">
                        <el-form-item label="类别" prop="type">
                            <el-radio-group v-model="form.type" @change="onTypeChange">
                                <el-radio size="large" v-for="(item, index) in typeArr" :label="item" :key="index">{{ item
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="状态" prop="pick_type">
                            <el-radio-group v-model="form.pick_type" class="ml-4">
                                <el-radio :label="1">领取</el-radio>
                                <el-radio :label="2">更换</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="刀具" prop="id">

                            <el-tag type="danger" v-if="!form.type">请先选择类别</el-tag>
                            <el-button v-else-if="!form.id" @click="onClickSelect">选择刀具</el-button>

                            <template v-else>
                                <el-tag>{{ form.name }}</el-tag>
                                <el-button @click="onClickSelect" class="ml-10px">修改</el-button>
                            </template>

                        </el-form-item>

                    </el-form>

                    <div class="mt-10px">
                        <el-button class="w-full" type="primary" @click="onClickSubmit" v-if="!loading">提交</el-button>
                        <el-button class="w-full" type="primary" loading v-else>正在提交</el-button>
                        <div class="mt-10px">
                            <el-button class="w-full" @click="onClickGetLast" v-if="!disbaledLast">历史领取</el-button>
                        </div>



                    </div>
                    <el-result v-if="submitDone" icon="success" title="提交成功">
                    </el-result>

                </div>

            </div>

            <el-drawer v-model="drawer" :direction="direction" @open="onDrawerOpened" @closed="onDrwaerClosed">

                <div class="wh-full overflow-hidden relative ">
                    <div class="w-full flex">
                        <el-input v-model="search" class="flex-1" placeholder="请输入文字搜索" clearable
                            @input="onSearchInput"></el-input>
                        <el-button class="ml-10px" type="primary" @click="onClickSelectConfirm">确定</el-button>
                    </div>
                    <div class="max-h-full overflow-auto pb-50px">
                        <el-radio-group v-model="selectId">
                            <el-radio size="large" v-for="(item, index) in nameArr" :label="item.id" :key="index">{{
                                item.name
                            }}</el-radio>
                        </el-radio-group>
                    </div>
                </div>

            </el-drawer>

            <el-drawer v-model="historyDrawer" :direction="direction" @open="onDrawerOpened" @closed="onDrwaerClosed">
                <div class="wh-full flex flex-col">

                    <div>
                        <div>点击历史记录，自动填写领取资料</div>
                    </div>
                    <div class="flex-1 overflow-auto mt-5px">
                        <div class=wh-full>
                            <ba-table :baTable="table" @row-click="onRowClick"></ba-table>
                        </div>
                    </div>
                </div>
            </el-drawer>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ElForm, } from "element-plus"
import type { FormInstance, FormRules } from 'element-plus'


import to from "await-to-js"

import getSearch, { getCorpId } from "@/utils/urlSearch"
import { messageWarning } from "@/utils/elementLib"
import { getType, getId, submit, getLast } from "@/api"

import BaTable from "H:\\private\\newTool\\UI\\src\\components\\BaTable\\index.vue"
import { baTableControl } from "H:\\private\\newTool\\UI\\src\\components\\BaTable\\utils\\baTable"



const table = new baTableControl({
    pk: "index",
    column: [
        {
            label: "类型",
            prop: 'ctype',
            align: 'center',
            width: 100
        },
        {
            label: "刀具",
            prop: 'name',
            align: 'center'
        },
        {
            label: "状态",
            prop: 'pick_type',
            width:"80",
            align: 'center',
            render: 'tag',
            replaceValue:{
                "1": "领取",
                "2": "更换"
            }
        },

    ],
})




type idName = {
    id: string | number,
    name: string
}




const formEl = $ref<InstanceType<typeof ElForm>>();


let submitDone = $ref(false);
let loading = $ref(false);

let historyDrawer = $ref(false);


const rules = reactive<FormRules>({
    type: [
        { required: true, message: '请选择类别', trigger: 'change' }
    ],
    id: [
        {
            validator(a: any, b: any, callback: any) {

                let setErr: Error | undefined
                if (form.type && !form.id) {

                    setErr = new Error("请选择刀具")
                }

                callback(setErr)

            },
            trigger: 'blur'
        }

    ]
});

const typeArr = $ref<string[]>([]);

let addName: idName[] = [];
const nameArr = $ref<idName[]>([]);


let drawer = $ref(false);
let direction = $ref("btt");
let selectId = $ref<string | number>("");
let search = $ref("");

/** 类型是否有变动过 */
let isTypeChange = $ref(false);
/** 禁止领取上一次 */
let disbaledLast = $ref(false);





const form = $ref({
    id: "" as string | number,
    name: "",
    type: "",
    pick_type: 1
});


function onClickSelect() {
    drawer = true;
}


async function onDrawerOpened() {

    if (!isTypeChange) {
        return;
    }

    selectId = "";
    nameArr.length = 0;


    const data = await getId(form.type);

    addName.length = 0;
    addName.push(...data);
    nameArr.push(...data);

    isTypeChange = false;

}


async function onClickGetLast() {

    const data = await getLast();
    if (!data.length) {
        disbaledLast = true;
        messageWarning("暂未领取过刀具！");
        return;
    }

    table.table.data.length = 0;
    table.table.data.push(...data);
    historyDrawer = true;




}

async function onRowClick(event:Event, data:any){

    historyDrawer = false;

    
    form.type = data.ctype;
    form.pick_type = data.pick_type


    isTypeChange = true;

    onDrawerOpened().then(() => {

        const item = addName.find((elem) => elem.id == data.cid);
        if (!item) {

            return;
        }

        form.name = item.name;
        form.id = item.id;
        nextTick(() => {
            selectId = item.id;
        })

    })


}



function onSearchInput(value: string) {

    value = value.toLocaleLowerCase();

    const searchData = addName.filter((elem) => {
        return elem.name.toLocaleLowerCase().indexOf(value) > -1;
    });

    nameArr.length = 0;
    nameArr.push(...searchData);

}

function onClickSelectConfirm() {
    if (selectId) {
        form.id = selectId;
        form.name = nameArr.find((elem) => elem.id == selectId)!.name;
    }

    drawer = false;
}


async function onDrwaerClosed() {

    return;
}

function onTypeChange(value: string) {

    search = "";
    form.id = "";
    isTypeChange = true;

}

async function onClickSubmit() {

    try {
        await formEl.validate();
    } catch (error) {
        return;
    }

    try {

        loading = true;

        const [err] = await to(submit(form.type, form.id, form.pick_type));

        if (err) {
            return;
        }

        submitDone = true;


    } finally {

        loading = false;

    }


}

async function init() {

    const [error, data] = await to(getType());
    if (error) {
        return;
    }


    typeArr.length = 0;

    const lengthArr = data.map((item) => ({
        len: item.length,
        item
    }))



    typeArr.push(...lengthArr.sort((a, b) => {

        return a.len - b.len

    }).map((elem) => elem.item))







}





init();






</script>

<script lang="ts">
export default {
    name: "",
    title: "刀具领取"
}
</script>

<style lang="scss">
.el-overlay.is-message-box .el-overlay-message-box {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-message-box {
        width: 80%;
    }
}

#declare {
    flex: 1;

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


    .el-radio {
        margin-right: 16px
    }

    .el-overlay {
        position: absolute;

        .el-drawer {
            height: 80% !important;
        }

        .el-drawer__header {
            display: none;
            overflow: hidden;


        }
    }

}
</style>

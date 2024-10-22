<template>
    <div id="hectic" class="wh-full">

        <div class="declare-view">
            <h3 class="title">{{ title }}</h3>

            <div class="relative overflow-auto p-10px flex-1">

                <div class="relative flex h-full flex-col">
                    <el-form :model="form" :rules="rules" :hide-required-asterisk="true" label-width="auto" ref="formEl"
                        class="overflow-auto">

                        <tool-collapse v-for="item in form.list" :key="item.name" :name="item.name">
                            <el-form-item>
                                <form-item :value="item.value" ref="formItemList" />
                            </el-form-item>
                        </tool-collapse>

                    </el-form>

                    <div class="mt-10px">
                        <el-button class="w-full" type="primary" @click="onClickSubmit" v-if="!loading">提交</el-button>
                        <el-button class="w-full" type="primary" loading v-else>正在提交</el-button>
                    </div>

                    <el-result v-if="submitDone" icon="success" title="提交成功">
                    </el-result>

                </div>

            </div>
        </div>

    </div>
    <pop-empty ref="emptyEl" />
</template>

<script setup lang="ts">

import { ElForm, } from "element-plus"
import type { FormRules } from 'element-plus'

import popEmpty from "./popEmpty.vue";

import getSearch, { getCorpId } from "@/utils/urlSearch"
import { getUserName } from "@/store/user"

import dayjs from "dayjs";

import to from "await-to-js";

import toolCollapse from "@/components/toolCollapse/index.vue";
import formItem from "./formItem.vue"

import { getHectic, setHectic } from "@/api/hectic"


const formEl = $ref<InstanceType<typeof ElForm>>();
let submitDone = $ref(false);

let loading = $ref(false);

const emptyEl = $ref<any>();
const formItemList = $ref<any>();



const form = $ref({

    list: [] as any[]

});


const rules = reactive<FormRules>({



});


async function onClickSubmit() {

    try {
        await formEl.validate();
    } catch {
        return;
    }


    const emptyValue = form.list.filter((item) => !item.value.length);

    if (emptyValue.length) {

        try {
            await emptyEl.open(emptyValue.map((elem) => elem.name))
        } catch {
            return;
        }

    }


    loading = true;

    const [err] = await to(setHectic(form.list));

    if (!err) {
        submitDone = true;
    }

    loading = false;

}


async function getRmoteHectic() {

    const { list } = form;

    const value = await getHectic();

    value.forEach((item) => {

        const findIndex = list.findIndex((elem) => elem.name == item.name);

        formItemList[findIndex].set(item.value)

    })

}



async function init() {


    const { list } = form;

    const weekSplit = `一二三四五六`.split("");

    weekSplit.forEach((name) => {

        list.push({
            name: `周${name}`,
            value: []
        })

    });





}

init();

onMounted(() => {


    getRmoteHectic();



})



</script>

<script lang="ts">

const title = $ref("会议繁忙设置")

export default {
    name: "",
    title
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

#hectic {
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
        margin-right: 20px;
        margin-bottom: 5px;
    }


    .el-date-editor--timerange {
        width: 220px;
    }

}
</style>

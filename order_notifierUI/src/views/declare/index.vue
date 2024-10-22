<template>
    <div id="declare">
        <div class="declare-view">
            <h3 class="declare_header title">{{ title }}</h3>

            <group-view :formItem="formItem" :group="group" v-if="!grouperror && !done && !disabled" ref="view"
                v-loading="loading" element-loading-text="正在提交" />

            <el-result v-else-if="disabled"  icon="warning" title="本表单已禁用，请联系管理员！" ></el-result>
            <el-result v-else-if="!done" title="请通过二维码或者链接进去"></el-result>

            <el-result icon="success" title="提交成功" v-if="done"></el-result>
            <div class="button-area" v-if="!done && !error">
                <el-button type="primary" 
                    @click="onSubmit" 
                    size="large" 
                    :disabled="disabledSubmit"
                    :loading="loading">提交</el-button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import groupView from "@/components/groupView/index.vue"

import to from "await-to-js";
import type { FormInstance, } from 'element-plus'
import { ElMessage } from 'element-plus'

import { getGropuForm } from "@/api"
import getSearch from "@/utils/urlSearch"




const group = getSearch("group");
let grouperror = $ref(false);
let error = $ref(false);
let done = $ref(false);
let title = $ref("");

let loading = $ref(false);
let disabled = $ref(false);

const formItem = $ref<any[]>([]);
const view = $ref<InstanceType<typeof groupView>>();
const disabledSubmit = $computed(() => {
    return grouperror || done || formItem.length == 0 || disabled;
})

async function onSubmit() {

    loading = true;
    const [error] = await to(view.onSubmit());
    if (!error) {
        done = true;
    }

    loading = false;
}

async function init() {
    if (!group) {
        grouperror = true;
        return;
    }

    const [error, result] = await to(getGropuForm(group));
    if (error || !result.form) {
        grouperror = true;
        return;
    }

    disabled = result.disabled;

    title = result.title || result.name;
    formItem.push(...result.form)


}



init();


</script>

<script lang="ts">
export default {
    name: "",
    title: ""
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

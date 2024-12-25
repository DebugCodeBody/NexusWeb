<template>
    <div id="create-group" class="wh-full">

        <div class="declare-view">
            <h3 class="title">{{ title }}</h3>

            <div class="relative overflow-hidden p-10px">
                <transition>

                    <group-info v-if="data.selectItem" />

                    <group-list v-else />

                </transition>

            </div>

        </div>

    </div>
</template>

<script setup lang="ts">

import { ElForm, } from "element-plus"
import type { FormRules } from 'element-plus'
import actorUser from "@/components/actorUser.vue"

import pySelectName from "@/components/pySelectName.vue"
import expectTime from "@/components/expectTime.vue"

import groupList from "./groupList.vue";
import groupInfo from "./groupInfo.vue";

import { getPrepare } from "@/api"

import { data, getDate } from "./data";


import to from "await-to-js"

import getSearch, { getCorpId } from "@/utils/urlSearch"




function onClickName() {

}





async function init() {


    const result = await getPrepare("cidqSg4UlaQSpDlsI9p6p347Q==");

    data.actorArr.push(...result.actor);

    data.notUserList.push(...result.actor);


    await getDate();

    if (data.list.length == 0) {

        data.action = "add";

        data.selectItem = {
            id: 0,
            name: "我的常用",
            user: []
        }


    }


}


init();




</script>

<script lang="ts">

const title = $ref("创建会议用户组")

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

#create-group {
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

    .group-item .el-button {
        margin-left: 0 !important;
        margin-right: 10px;
        margin-bottom: 10px;


    }


}
</style>

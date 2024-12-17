<template>
    <div id="group-charge" class="wh-full">

        <div class="declare-view">
            <h3 class="title">{{ title }}</h3>

            <div class="relative overflow-auto p-10px h-300px">

                <div class="relative h-full">
                    <el-result v-if="submitDone" icon="success" title="提交成功">
                        <template #extra>
                            <el-tag>
                                <div class="flex items-center">
                                    <el-icon class="mr-5px is-loading">
                                        <Loading />
                                    </el-icon>
                                    正在跳转到下一个任务
                                </div>
                            </el-tag>
                            <div>
                                <el-button class="mt-10px" @click="onClickClose">关闭页面</el-button>
                            </div>
                        </template>
                    </el-result>

                    <el-result icon="error" sub-title="请通过点击群消息进入本页面" v-if="error">

                    </el-result>

                </div>

            </div>
        </div>

    </div>
    <py-select-name />
</template>

<script setup lang="ts">

import { ElForm, } from "element-plus"
import type { FormRules } from 'element-plus'
import actorUser from "@/components/actorUser.vue"

import pySelectName from "@/components/pySelectName.vue"
import expectTime from "@/components/expectTime.vue"


import to from "await-to-js"

import getSearch, { getCorpId } from "@/utils/urlSearch"


import { toNextHandle, closeNavigation } from "@/utils/quick"

import { tissueDrawDown, tissueAbandon } from "@/api/tissue"

let submitDone = $ref(false);

let error = $ref(false);


let id = getSearch("id");


function onClickClose() {

    closeNavigation();

}





async function init() {

    if (!id) {
        error = true;
        return
    }

    const action = parseInt(getSearch("action")) || 1;

    let nextFun;
    if (action == 1) {
        nextFun = tissueDrawDown
    } else if (action == 2) {
        nextFun = tissueAbandon
    } else {
        error = true;
        return;
    }



    const [err] = await to(nextFun(id));
    if (err) {
        alert("操作失败")
        return;
    }

    submitDone = true;

    toNextHandle();

}


init();




</script>

<script lang="ts">

const title = $ref("会议群领取")

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

#group-charge {
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


}
</style>

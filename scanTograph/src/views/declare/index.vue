<template>
    <div id="declare" class="wh-full">

        <div class="declare-view">
            <h3 class="title">{{ title }}</h3>

            <div class="relative overflow-auto p-10px flex-1">
                <el-form label-width="auto" :hide-required-asterisk="true" class="mb-10px" v-if="imgArr.length">
                    <el-form-item label="工单号">
                        <el-tag>{{ moid }}</el-tag>
                    </el-form-item>
                    <el-form-item label="提示">
                        <el-tag type="danger">有多张图纸，请点击下方按钮查看</el-tag>
                    </el-form-item>
                    <el-form-item label="图纸列表" class="mb-0">
                        <div class="img-list" v-if="imgArr.length">
                            <el-button v-for="(item, index) in imgArr" :key="index" @click="onClickToUrl(item.url)">{{
                item.title
            }}</el-button>
                        </div>

                    </el-form-item>
                </el-form>
                <div class="wh-full relative flex justify-center scan">
                    <el-button type="primary" class="w-200px h-200px block " v-if="loading"
                        :loading="loading">正在查询</el-button>
                    <el-button type="primary" class="w-200px h-200px block" v-else @click="onClickScan">扫码</el-button>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup lang="ts">

import { ElForm, } from "element-plus"
import type { FormInstance, FormRules } from 'element-plus'
import { scanning } from "@/utils/other"
import { messageWarning, messageError } from "@/utils/elementLib"
import { searchMoid, searchOrder } from "@/api"

import getSearch from "@/utils/urlSearch"

type imgItem = {
    title: string,
    url: string
}



const orderid = getSearch("orderid")

let loading = $ref(false);
let imgArr = $ref<imgItem[]>([]);
let moid = $ref("");

function onClickToUrl(url: string) {
    location.href = `//cddgd.cn/ding/media/smb/` + url;
}


async function onClickScan() {

    const text = await scanning();
    if (!text) {
        messageWarning("工单号为空，请重新扫描")
        return;
    }



    getImg(text,searchMoid);

}

async function getImg(text: string, call: any) {

    try {
        loading = true;
        const result = await call(text);
        if (result.length > 1) {

            imgArr.length = 0;

            moid = text;
            imgArr.push(...result);


        } else {
            onClickToUrl(result[0].url);
        }


    } finally {
        loading = false;
    }
}


async function init() {

    if (!orderid) {
        return;
    }

    getImg(orderid, searchOrder);


}



init();









</script>

<script lang="ts">
const title = "扫码图纸";
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

        .el-form-item.mb-0 {
            margin-bottom: 0;
        }
    }

    .scan {
        button {
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }
    }

    .img-list {
        button {
            margin-left: 0px;
            margin-right: 10px;
            margin-bottom: 10px;

        }
    }



}
</style>

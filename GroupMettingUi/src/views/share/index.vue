<template>
    <div id="declare" class="wh-full share">

        <div class="declare-view">
            <h3 class="title">会议内容</h3>

            <div class="relative overflow-auto p-10px">

                <div class="relative">
                    <el-form :model="form" :rules="rules" :hide-required-asterisk="true" label-width="auto" ref="formEl">
                        <div class="p-10px item" v-if="item">
                            <meet-item 
                                :item="item" 
                                :type="nowActive" 
                                :refresh="init" 
                                :cancel="cancelUser"
                                @click-track-user="onClickTrackUser">
                            </meet-item>
                        </div>
                    </el-form>

                    <el-result icon="error" sub-title="请通过分享链接进入" v-if="!id">
                    </el-result>

                </div>

            </div>
        </div>

        <edit-track-user :refresh="init" />

    </div>
</template>

<script setup lang="ts">

import { ElForm, } from "element-plus"
import type { FormRules } from 'element-plus'
import actorUser from "@/components/actorUser.vue"


import to from "await-to-js"

import meetItem from "@/components/meetItem.vue"
import getSearch, { getCorpId } from "@/utils/urlSearch"
import { getView } from "@/api"
import { getUserName } from "@/store/user"
import { getRtime, copyText } from "@/utils/other"

import editTrackUser from "@/views/list/editTrackUser.vue"
import { showDialog } from "@/views/list/data"






type resourceType = {
    label: string,
    day: number
}


const formEl = $ref<InstanceType<typeof ElForm>>();
let submitDone = $ref(false);

let isRegist = $ref(false);
let loading = $ref(false);

const id = $ref(getSearch("id"));
const nowActive = $ref<any>(undefined);



const rules = reactive<FormRules>({
    type: [
        { required: true, message: '请选择会议类型', trigger: 'change' }
    ],
    tissue: [
        { required: true, message: '请选择开会组织人', trigger: 'change' }
    ],
    actor: [
        { required: true, message: '请选择参加人员', trigger: 'change' }
    ],
    content: [
        { required: true, message: '请填写开会内容', trigger: 'change' }
    ],
    time: [
        { required: true, message: '请选开会时间', trigger: 'change' }
    ],
    rtime: [
        { required: true, message: '请选预约时间', trigger: 'change' }
    ]
});


let error = $ref(false);

let cancelUser = $ref(false);
const tissueArr = $ref<string[]>([]);
const actorArr = $ref<string[]>([]);
const typeArr = $ref<string[]>([]);
const timeArr = $ref<string[]>([]);
const resourceTime = $ref<resourceType[]>([]);
const timePeriod = $ref<string[]>([]);
const notUserList = $ref<string[]>([]);
const responseTissue = $ref<{
    name: string,
    tissue: string[],
}[]>([]);


let item = $ref<mettItem | undefined>();


const form = $ref({
    /** 组织人 */
    tissue: "",
    /** 必须参与人 */
    actor: [] as string[],
    /** 非必须参与人 */
    notuser: [] as string[],
    /** 开会内容 */
    content: "",
    /** 会议类型 */
    type: null as any as string

});


function onClickTrackUser(item: mettItem) {


    showDialog.item = item;
    showDialog.trackUser = true;

}




function onChangeType(value: string) {


    const temp = responseTissue.find((elem) => elem.name === value)!;


    tissueArr.length = 0;
    tissueArr.push(...temp.tissue);
    if (tissueArr.length == 1) {
        form.tissue = tissueArr[0]
    } else {
        form.tissue = "";
    }


}



async function init() {

    try {

        loading = true;

        const result = await getView(id);

        item = result as any;

    } catch {

        error = true;
        

    } finally{
        loading = false;
    }


}


async function onClickSubmit() {


}

if (id) {
    init();
}




</script>

<script lang="ts">
export default {
    name: "",
    title: "开会"
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


    &.share {


        form {
            background: white;

        }

        .item {
            form {
                box-shadow: none !important;
            }


        }


    }

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

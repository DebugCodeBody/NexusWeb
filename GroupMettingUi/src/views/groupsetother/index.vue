<template>
    <div id="group-set-other" class="wh-full">

        <div class="declare-view">
            <h3 class="title">{{ title }}</h3>

            <div class="relative overflow-auto p-10px " style="min-height: 400px;">

                <div class="relative h-full flex flex-col">

                    <div class="flex-1 form-warp">
                        <el-form :model="form" :hide-required-asterisk="true" label-width="auto" ref="DefaultFormEl"
                            @submit.prevent>
                            <actor-user :actor="form.actor" :notuser="form.notuser" :hot="hotArr" :actorArr="actorArr"
                                :notuserArr="notUserList" :showNotUser="false" :show-actor-group="true"
                                :isHiddenUser="true" :actorGroupList="actorGroup" title="指派人员" :isOneUser="true"/>
                        </el-form>
                    </div>

                    <div class="mt-10px">
                        <el-button class="w-full" type="primary" @click="onClickSubmit" v-if="!loading">提交</el-button>
                        <el-button class="w-full" type="primary" loading v-else>正在提交</el-button>
                    </div>

                    <el-result v-if="submitDone" icon="success" title="提交成功">

                        <template #extra>

                            <div class="mb-10px">
                                <el-tag type="danger" v-if="noSet">在场类不允许指派执行者</el-tag>
                            </div>

                            <div v-if="isGetCount">
                                <el-tag type="warning">
                                    <div class="flex items-center">
                                        <el-icon class="mr-5px is-loading">
                                            <Loading />
                                        </el-icon>
                                        正在获取任务详细数量
                                    </div>
                                </el-tag>
                            </div>

                            <div class="mb-10px">
                                <div v-for="item in nextArr" :key="item.name" class="flex">
                                    <span class="w-70px text-right">{{ item.name }}</span>
                                    <span>：</span>
                                    <span>{{ item.count }}</span>
                                </div>
                            </div>

                            <el-tag>
                                <div class="flex items-center">
                                    <el-icon class="mr-5px is-loading">
                                        <Loading />
                                    </el-icon>
                                    正在跳转到下一个任务
                                </div>
                            </el-tag>

                            <div>
                                <el-button class="mt-10px" @click="onClickClose">跳转到待处理</el-button>
                            </div>
                        </template>

                    </el-result>

                    <el-result icon="error" sub-title="请通过点击群消息进入本页面" v-if="error">

                    </el-result>

                </div>

            </div>
        </div>


    </div>
</template>

<script setup lang="ts">

import { ElForm, } from "element-plus"

import actorUser from "@/components/actorUser.vue"


import getSearch, { getCorpId } from "@/utils/urlSearch"

import { setTrack } from "@/api/quick"
import exportData from "@/store/data"

import to from "await-to-js"

import { isExist, getPrepare, submitMeet } from "@/api"

import { toNextHandle, toHandle, getNextCount } from "@/utils/quick"




let submitDone = $ref(false);

let error = $ref(false);


let id = getSearch("id");

let loading = $ref(false);


let isGetCount = $ref(false);
let nextArr = $ref<any[]>([]);

let noSet = $ref(false);

let openConversationId = getSearch("openConversationId");


const typeArr = $ref<string[]>([]);
const timeArr = $ref<string[]>([]);
const resourceTime = $ref<resourceType[]>([]);
const timePeriod = $ref<string[]>([]);
const notUserList = $ref<userItem[]>([]);
const actorGroup = $ref<actorGroup[]>([]);
const tissueArr = $ref<string[]>([]);
/** 参加会议人员 */
const actorArr = $ref<userItem[]>([]);

/** 热度列表人员 */
const hotArr = $ref<userItem[]>([]);


if (process.env.NODE_ENV != "production") {

    /** 自己的测试群 */
    openConversationId = "cidJgKt5cWr6G7oCrh3YtA/JA==";

    /** 中高层管理群 */
    openConversationId = "cidqSg4UlaQSpDlsI9p6p347Q==";

    // openConversationId = "cidByQUlqQerQ3O141BE+4axg==";
} else {


    if (!openConversationId) {
        // 中高层管理群
        openConversationId = "cidqSg4UlaQSpDlsI9p6p347Q==";
    }

}




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
    type: null as any as string,
    /** 执行人 */
    track: "",

    /** 是否语音会议 */
    isAudio: getSearch("audio") == "1",

    /** 工单号 */
    order: "",

    expect: "",

    extend: ""

});


let selectName = $computed(()=>{
    return form.actor[0] || ""
});


function onClickClose() {

    toHandle();

}

async function onClickSubmit() {

    try {

        
        loading = true;

        const data = await setTrack(id, selectName);

        noSet = data.noSet;

        submitDone = true;

        isGetCount = true;

        const result = await getNextCount();

        nextArr.push(...result)

        isGetCount = false;

        setTimeout(() => {

            toNextHandle();

        }, 300);




    } catch (error) {

        alert("设置执行人错误");


    } finally {

        loading = false
    }


}

async function init() {

    if (!id) {
        error = true;
        return
    }





    let name = getSearch("name");

    if (name) {


        form.actor.push(name);
        
        onClickSubmit();

    } else {

        const [err, data] = await to(getPrepare(openConversationId));
        if (err) {
            return;
        }


        timeArr.push(...data.time);

        actorArr.push(...data.actor);

        notUserList.push(...data.actor);

        hotArr.push(...data.hot);

        actorGroup.push(...data.actorGroup);


    }







    // submitDone = true;

    // toNextHandle();


}





onMounted(() => {
    init();
})



</script>

<script lang="ts">

const title = $ref("会议群指派执行者")
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

#group-set-other {
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


    .form-warp {

        overflow: auto;

        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);


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

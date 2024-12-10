<template>
    <div id="declare" class="wh-full">

        <div class="declare-view">
            <h3 class="title">约会议</h3>

            <div class="relative overflow-auto p-10px">

                <div class="relative">
                    <el-form :model="form" :rules="rules" :hide-required-asterisk="true" label-width="auto"
                        ref="formEl">

                        <!-- <el-form-item label="组织人员" prop="tissue">
                            <el-select v-model="form.tissue" filterable placeholder="请选择组织人员">
                                <el-option v-for="item in tissueArr" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item> -->

                        <actor-user :actor="form.actor" :notuser="form.notuser" :hot="hotArr" :actorArr="actorArr"
                            :notuserArr="notUserList" :showNotUser="!form.isAudio" />

                        <el-form-item label="会议类型" prop="type" v-if="!form.isAudio">
                            <el-radio-group v-model="form.type" @change="onChangeType">
                                <el-radio v-for="(item, index) in typeArr" :key="index" :label="item">{{ item
                                    }}</el-radio>
                            </el-radio-group>
                        </el-form-item>


                        <el-form-item label="工单号" v-if="form.isAudio">
                            <order-input v-model="form.order" :search="false" />
                        </el-form-item>

                        <el-form-item label="响应时间" prop="expect" v-if="isNowType" v-show="!form.isAudio">
                            <expect-time v-model="form.expect" ref="expectTimeEl" />
                        </el-form-item>


                        <el-form-item label="执行者" prop="track" v-if="isFdType">
                            <el-tag class="mr-5px" v-if="form.track">{{ form.track }}</el-tag>
                            <el-button @click="onClickSelectTrack">选择</el-button>
                            <el-button @click="onClickClearTrack" v-if="form.track">清除</el-button>
                        </el-form-item>

                        <el-form-item label="图片">
                            <upload-file ref="uploadEl" />
                        </el-form-item>

                        <el-form-item label="开会内容" prop="content" v-if="!form.isAudio">
                            <el-input type="textarea" v-model="form.content" />
                        </el-form-item>

                    </el-form>

                    <div class="mt-10px">
                        <el-button class="w-full" type="primary" @click="onClickSubmit" v-if="!loading">提交</el-button>
                        <el-button class="w-full" type="primary" loading v-else>正在提交</el-button>
                    </div>

                    <el-result v-if="submitDone" icon="success" title="提交成功">
                    </el-result>

                    <el-result icon="error" sub-title="本应用只允许在钉钉群内打开" v-if="!openConversationId">
                    </el-result>

                    <el-result icon="error" sub-title="请先注册群后再进行使用本应用" v-else-if="isRegist">

                        <template #extra>
                            <el-button type="warning" @click="onClickToRegist">跳转注册</el-button>
                        </template>

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
import { isExist, getPrepare, submitMeet } from "@/api"
import { getUserName } from "@/store/user"
import { copyItemValue } from "@/utils/other"

import { messageError } from "@/utils/elementLib";
import uploadFile from "global@/uploadFile/index.vue";
import orderInput from "global@/orderInput/index.vue";


import { openGroup } from "@/utils/ddgroup";



type resourceType = {
    label: string,
    day: number

}

const uploadEl = $ref<InstanceType<typeof uploadFile>>();
const formEl = $ref<InstanceType<typeof ElForm>>();
let submitDone = $ref(false);

let isRegist = $ref(false);
let loading = $ref(false);


const expectTimeEl = $ref<any>();


const corpId = getCorpId();
let openConversationId = getSearch("openConversationId");

if (process.env.NODE_ENV != "production") {

    openConversationId = "cidJgKt5cWr6G7oCrh3YtA/JA==";

    // openConversationId = "cidqSg4UlaQSpDlsI9p6p347Q==";

    // openConversationId = "cidByQUlqQerQ3O141BE+4axg==";
} else {


    if (!openConversationId) {
        // 中高层管理群
        openConversationId = "cidqSg4UlaQSpDlsI9p6p347Q==";
    }

}


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
        {
            validator(rule, value, callback, source, options) {

                let retErr: Error | undefined = undefined;

                if (!form.isAudio && !value) {
                    retErr = new Error("请填写开会内容")
                }

                callback(retErr);

            }, trigger: 'change'
        }
    ],
    rtime: [
        { required: true, message: '请选预约时间', trigger: 'change' }
    ],
    track: [
        {
            validator(rule, value, callback, source, options) {

                let retErr: Error | undefined = undefined;

                if (isFdType && form.track == "") {
                    retErr = new Error("请选择执行人")
                }

                callback(retErr);

            }, trigger: 'change'
        }
    ],
    order: [
        {
            validator(rule, value, callback, source, options) {

                let retErr: Error | undefined = undefined;

                if (form.isAudio && form.order == "") {
                    retErr = new Error("语音会议需要扫描工单号")
                }

                callback(retErr);

            }, trigger: 'change'
        }
    ],
    expect: [
        {
            validator(rule, value, callback, source, options) {

                let retErr: Error | undefined = undefined;

                if (isNowType && !value) {
                    retErr = new Error("请选择期待响应时间")
                }

                callback(retErr);

            }, trigger: 'change'
        }
    ]


});


const tissueArr = $ref<string[]>([]);
/** 参加会议人员 */
const actorArr = $ref<userItem[]>([]);

/** 热度列表人员 */
const hotArr = $ref<userItem[]>([]);



const typeArr = $ref<string[]>([]);
const timeArr = $ref<string[]>([]);
const resourceTime = $ref<resourceType[]>([]);
const timePeriod = $ref<string[]>([]);

const notUserList = $ref<userItem[]>([]);

const responseTissue = $ref<{
    name: string,
    tissue: string[],
}[]>([]);

/** 是否防呆类 */
const isFdType = $computed(() => {

    return form.type == "防呆类"

});


/** 是否在场类 */
const isNowType = $computed(() => {

    return form.type == "在产类"

});





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

    expect: ""

});



function onChangeType(value: string) {


    const temp = responseTissue.find((elem) => elem.name === value)!;


    tissueArr.length = 0;
    if (temp) {
        tissueArr.push(...temp.tissue);
    }
    if (tissueArr.length == 1) {
        form.tissue = tissueArr[0]
    } else {
        form.tissue = "";
    }


}


function onClickToRegist() {
    location.href = `${location.origin}/ding/coolapp/index.html?corpId=${encodeURIComponent(corpId)}&openConversationId=${encodeURIComponent(openConversationId)}&redirect=${encodeURIComponent(location.href)}`;
}


/** 选择执行人 */
async function onClickSelectTrack() {

    try {

        const userList = [...hotArr, ...actorArr];

        const qianList = [] as any[];
        const houList = [] as any[];

        userList.forEach((item) => {

            if (form.actor.includes(item.name)) {

                qianList.push(item);

            } else {
                houList.push(item);
            }

        })

        form.track = await window.openNameSelect({
            title: "选择执行者",
            selectList: form.track ? [form.track] : [],
            userList: [...qianList, ...houList],
            isOne: true,
        });


    } catch {
        form.track = "";
    }




}

/** 清除执行人 */
function onClickClearTrack() {

    form.track = "";

}




async function init() {

    if (!openConversationId) {
        return;
    }

    const [err, exist] = await to(isExist(openConversationId))
    if (!exist) {
        isRegist = true;
        return;
    }

    {
        const [err, data] = await to(getPrepare(openConversationId));

        if (!err) {

            timeArr.push(...data.time);

            actorArr.push(...data.actor);

            notUserList.push(...data.actor);

            hotArr.push(...data.hot);

            responseTissue.push(...data.tissue);


            // typeArr.push(...data.type);

            // , "现场类"

            typeArr.push("在产类", "防呆类", "畅聊类");


            form.actor.push(getUserName());

            resourceTime.push({
                label: "明天",
                day: 1
            }, {
                label: "后天",
                day: 2
            }, {
                label: "三天后",
                day: 3
            }, {
                label: "一周后",
                day: 7
            })

            timePeriod.push("早上", "下午", "晚上");

            onChangeType(form.type);


            if (form.isAudio) {


                form.type = "在产类"

                await nextTick();

                expectTimeEl.clickTime(0);



            }

        }

    }

}


async function onClickSubmit() {

    try {
        await formEl.validate();
    } catch {
        return;
    }

    loading = true;

    let img = [];

    try {
        img = await uploadEl.uploadFile();
    } catch {
        messageError("图片上传失败");
        return;
    }




    const sendData = Object.assign({}, form);

    if (!isFdType) {
        sendData.track = "";
    }

    const [err, data] = await to(submitMeet(openConversationId, {
        ...sendData,
        img
    }));

    if (err) {
        return
    }

    submitDone = true;
    copyItemValue(data as any, true);

    if (form.isAudio) {


        await openGroup(data.create_group);

    }

    loading = false;

}

init();



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

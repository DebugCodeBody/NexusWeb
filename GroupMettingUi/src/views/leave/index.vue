<template>
    <div id="leave" class="wh-full">

        <div class="declare-view">
            <h3 class="title">{{ title }}</h3>

            <div class="relative overflow-auto p-10px">

                <div class="relative">
                    <el-form :model="form" :rules="rules" :hide-required-asterisk="true" label-width="auto"
                        ref="formEl">

                        <el-form-item label="申请人" prop="name">
                            <el-tag>{{ form.username }}</el-tag>
                        </el-form-item>
                        <el-form-item label="开始时间" prop="start_time">
                            <el-date-picker v-model="form.start_time" type="datetime" placeholder="请选择开始时间"
                                :default-time="defaultTime.start" />
                        </el-form-item>

                        <el-form-item label="结束时间" prop="end_time">
                            <el-date-picker v-model="form.end_time" type="datetime" placeholder="请选择结束时间"
                                :default-time="defaultTime.end" />
                        </el-form-item>
                        <el-form-item label="空闲时间" prop="view_time">

                            <el-checkbox-group v-model="form.leisure">
                                <el-checkbox v-for="item in banList" :key="item.id" :value="item.id" :label="item.id">{{
                item.name }}
                                </el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>

                        <el-form-item label="视频会议" prop="is_view" v-if="false">
                            <el-switch v-model="form.is_video" active-text="接受" inactive-text="不接受" />
                        </el-form-item>

                        <el-form-item label="繁忙时间"  class="label-top">

                            <div class="w-full hectic">
                                <tool-collapse v-for="item in form.hectic" :key="item.name" :name="item.name">
                                    <el-form-item>
                                        <form-item :value="item.value" ref="formItemList" />
                                    </el-form-item>
                                </tool-collapse>
                            </div>

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


                </div>

            </div>
        </div>

    </div>

    <py-select-name />
    <pop-empty ref="emptyEl" />

</template>

<script setup lang="ts">

import { ElForm, } from "element-plus"
import type { FormRules } from 'element-plus'
import pySelectName from "@/components/pySelectName.vue"


import getSearch, { getCorpId } from "@/utils/urlSearch"
import { getUserName } from "@/store/user"

import dayjs from "dayjs";

import to from "await-to-js";

import { getLeave, setLeave } from "@/api/leave"
import { getHectic, setHectic } from "@/api/hectic"


import toolCollapse from "@/components/toolCollapse/index.vue";
import formItem from "./formItem.vue"


import popEmpty from "./popEmpty.vue";





const formEl = $ref<InstanceType<typeof ElForm>>();
let submitDone = $ref(false);

let loading = $ref(false);


const emptyEl = $ref<any>();
const formItemList = $ref<any>();


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



const banList = $ref([
    {
        name: "早上",
        id: `1`
    },
    {
        name: "下午",
        id: `2`
    },
    {
        name: "晚上",
        id: `3`
    }
])

const defaultTime = $ref({
    start: undefined as any as Date,
    end: undefined as any as Date
})



const form = $ref({
    /** 申请人 */
    username: getUserName(),

    /** 开始时间 */
    start_time: undefined as any as Date,

    /** 结束时间 */
    end_time: undefined as any as Date,

    /** 空闲时间 */
    leisure: [] as string[],

    /** 视频会议 */
    is_video: false,

    hectic: [] as any[]


});


const rules = reactive<FormRules>({

    start_time: [
        {
            validator(rule, value, callback, source, options) {

                let retErr: Error | undefined = undefined;

                if (form.start_time && form.end_time) {

                    if (dayjs(form.start_time).isAfter(dayjs(form.end_time))) {
                        retErr = new Error("开始时间不允许大于结束时间")
                    }

                }

                callback(retErr);

            }, trigger: 'change'
        }
    ],
    end_time: [
        {
            validator(rule, value, callback, source, options) {

                let retErr: Error | undefined = undefined;


                if (form.start_time && !form.end_time) {
                    retErr = new Error("请填写结束时间")
                }

                callback(retErr);

            },
            trigger: 'change'
        }
    ]

});


async function getLeveStatus(name?: string) {

    const statusInfo = await getLeave(name);

    if (statusInfo.start_time) {
        form.start_time = new Date(statusInfo.start_time);

    }
    if (statusInfo.end_time) {
        form.end_time = new Date(statusInfo.end_time);

    }


    form.leisure = statusInfo.leisure;
    form.is_video = statusInfo.is_video;


    const { hectic } = form;
    

    statusInfo.hectic.forEach((item) => {

        const findIndex = hectic.findIndex((elem) => elem.name == item.name);

        formItemList[findIndex].set(item.value)

    })


}



function formatDay(time: string | Date) {

    return dayjs(time).format("YYYY-MM-DD HH:mm:ss");

}

async function onClickSubmit() {

    try {
        await formEl.validate();
    } catch {
        return;
    }

    const emptyValue = form.hectic.filter((item) => !item.value.length);
    if (emptyValue.length) {

        try {
            await emptyEl.open(emptyValue.map((elem) => elem.name))
        } catch {
            return;
        }
    }


    loading = true;


    const sendData = {
        ...form
    };



    if (sendData.start_time) {
        sendData.start_time = formatDay(sendData.start_time) as any;
    } else {
        sendData.start_time = formatDay(new Date()) as any;
    }

    sendData.end_time = formatDay(sendData.end_time) as any;

    const [err, data] = await to(setLeave(sendData));
    if (!err) {
        submitDone = true;
    }

    loading = false;

}



async function init() {

    const ymdTime = dayjs().format("YYYY-MM-DD");


    defaultTime.end = new Date(`${ymdTime} 21:00`);
    defaultTime.start = new Date(`${ymdTime} 09:00`);


    const { hectic } = form;

    const weekSplit = `一二三四五六`.split("");

    weekSplit.forEach((name) => {

        hectic.push({
            name: `周${name}`,
            value: []
        })

    });

}

init();


onMounted(() => {

    getLeveStatus();

})



</script>

<script lang="ts">

const title = $ref("会议请假")

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

#leave {
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


    .hectic .el-date-editor--timerange {
        width: 220px;
    }


}
</style>

<template>
    <div id="leave" class="wh-full">

        <div class="declare-view">
            <h3 class="title">{{ title }}</h3>

            <div class="relative overflow-auto p-10px">

                <div class="relative">

                    <leave-form ref="leaveFormEl">
                        <el-form-item label="申请人" prop="name">
                            <el-tag @click="onClickLeaveName" class="cursor-pointer">{{ form.username }}</el-tag>
                        </el-form-item>
                    </leave-form>

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

    <py-select-name :userList="exportData.userData" />

</template>

<script setup lang="ts">

import pySelectName from "@/components/pySelectName.vue"

import getSearch, { getCorpId } from "@/utils/urlSearch"
import { getUserName } from "@/store/user"

import { getLeave, setLeave } from "@/api/leave"

import leaveForm from "@/components/leaveForm/index.vue"

import exportData from "@/store/data"




let loading = $ref(false);
let submitDone = $ref(false);

const leaveFormEl = $ref<any>();


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


async function getLeveStatus(name: string) {

    const statusInfo = await getLeave(name);


    leaveFormEl.set(name, statusInfo);


}

async function onClickSubmit() {


    loading = true;

    try {

        const result = await leaveFormEl.submit();
        if (result) {
            submitDone = true;
        }

    } finally {
        loading = false;
    }


}

async function onClickLeaveName() {

    try {




        const selectName = await window.openNameSelect({

            title: "选择操作人员",
            isOne: true,

        });

        await getLeveStatus(selectName);
        form.username = selectName;

        


    } catch {
        return;
    }




}




onMounted(() => {

    getLeveStatus(form.username);

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




}
</style>

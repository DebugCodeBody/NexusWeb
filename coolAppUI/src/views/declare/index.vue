<template>
    <div class="registered-box" v-loading="loading" element-loading-text="加载中"
        element-loading-background="rgba(122, 122, 122, 0.8)" :class="{
            init: initLoad
        }">
        <el-result icon="error" sub-title="运行错误，请联系管理员" v-if="error">
            <template #extra>
                <el-tag type="danger" style="word-break:break-all;white-space:pre-wrap">{{ errorText }}</el-tag>
            </template>
        </el-result>
        <template v-else>
            <el-result icon="error" title="请通过群会话快捷方式进入本页面" v-if="!openConversationId"></el-result>
            <el-result icon="error" title="初始化失败，请重试" v-else-if="loadError"></el-result>
            <el-result icon="success" title="注册成功" v-else-if="done"></el-result>
            <el-result icon="info" title="点击下面按钮，选择本群进行注册" v-else></el-result>
            <el-button @click="onSelectGroup" :disabled="(done || loadError)">选择群</el-button>
        </template>

    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

import getSearch, { getCorpId } from "@/utils/urlSearch"
import { getSignature, registered, isExist } from "@/api"
import to from "await-to-js"


const corpId = getCorpId();
const redirect = getSearch("redirect");
const openConversationId = getSearch("openConversationId");

let done = $ref(false);
let loading = $ref(true);
let loadError = $ref(!openConversationId);
let initLoad = $ref(true);

let error = $ref(false)
let errorText = $ref("")



function setError(text: string) {
    error = true;
    errorText = text;
}

function onSelectGroup() {


    dd.biz.chat.chooseConversationByCorpId({
        corpId,
        isAllowCreateGroup: false,
        filterNotOwnerGroup: false,
        onSuccess: function (value: any) {

            const { chatId, title } = value;
            if (!chatId || !title) {
                // 2023-02-14,发现这里改了。以前取消操作是调用的onFail，现在改成这里了但是参数没有值
                ElMessage.info("取消操作");
                return;
            }

            registered(title, chatId, openConversationId).then(() => {
                done = true;
                if (redirect != "") {
                    location.href = redirect
                }

            }).catch((err: any) => {
                ElMessage.error(err.msg || err.message || "注册失败，请稍后重试")
            })

        },
        onFail: function (err: any) {
            if (err.errorCode == -1 && err.errorMessage == "Cancel") {
                // 用户取消操作，不往下面执行
                return;
            } else {
                setError(err.errorMessage);
            }
        }
    })


}


async function init() {
    if (!openConversationId) {
        return;
    }

    let [err, exist] = await to(isExist(openConversationId));
    if (err) {
        loadError = true;
        return;
    }

    if (exist) {
        done = true;
        return
    }

    const [signErr, signData] = await to(getSignature(location.href));
    if (signErr) {
        loadError = true;
        return;
    }


    const { timeStamp, nonceStr, signature } = signData;

    // 
    dd.config({
        agentId: '1662765423',
        corpId,
        timeStamp,
        nonceStr,
        signature,
        type: 0,
        jsApiList: [
            'runtime.info',
            'biz.contact.choose',
            'device.notification.confirm',
            'device.notification.alert',
            'device.notification.prompt',
            'biz.ding.post',
            'biz.util.openLink',
            "biz.chat.chooseConvez",
            "biz.chat.chooseConversationByCorpId"

        ]
    });

    dd.error(function (err: any) {
        setError(JSON.stringify(err));
    })

}


onMounted(async () => {

    init().finally(() => {
        loading = false;
        initLoad = false;
    })

})

</script>

<script lang="ts">
export default {
    name: "",
    title: ""
}
</script>

<style lang="scss">
.registered-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 500px;
    margin: 0 auto;
    border-radius: 10px;
    width: 100%;
    overflow: hidden;


    &.init {

        .el-result,
        .el-button {
            opacity: 0;
        }

    }

}
</style>

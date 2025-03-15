<template>

    <div id="weixin-qr" class="flex justify-center h-full mt-20% ">
        <div class="flex flex-col items-center">

            <p class="title">请选择登录方式</p>

            <div class="mb-20px">
                <el-radio-group v-model="type" @change="onInput" size="large">
                    <el-radio-button v-for="item in loginTypeArr" :label="item.value" :key="item.value">{{ item.name
                        }}</el-radio-button>
                </el-radio-group>
            </div>
            <div id="weixin-content" v-if="showQr">

            </div>
        </div>


    </div>
</template>

<script setup lang="ts">

import getSearch from "@/utils/urlSearch";


let type = $ref("");
let showQr = $ref(false);
let loginType = getSearch("loginType");



const loginTypeArr = $ref([
    {
        value: "1",
        name: "材料商"
    },
    {
        value: "2",
        name: "外发商"
    },
]);

if (loginType) {


    const filter = loginTypeArr.filter((elem) => elem.value == loginType);

    if (filter.length > 0) {

        loginTypeArr.length = 0;

        loginTypeArr.push(...filter);

        if (filter.length == 1) {
            type = filter[0].value; 
        }


    }






}




async function onInput(value: string) {
    if (!showQr) {

        showQr = true;

        await nextTick();

    }


    InitQr(value);


}


function InitQr(aType?: string) {


    const appid =  getSearch("appid") || "wx381cce832b1b83a1";
    const state = aType || type;

    let redirect_uri = getSearch("redirect") || "https://cddgd.cn/ding/osp/detaile/index.html";

    const url = new URL(redirect_uri);

    url.searchParams.set("appid", appid);

    new window.WxLogin({
        id: "weixin-content",
        appid,
        scope: "snsapi_login",
        redirect_uri: encodeURIComponent(url.toString()),
        state,
        style: "black",
        href: ""
    });


}





onMounted(() => {

    if(type){
        onInput(type);
    }


})

</script>

<script lang="ts">
export default {
    title: "微信扫码登录",
    name: ""
}
</script>

<style lang="scss">
#weixin-qr {
    margin-top: 10%;

    .title {
        margin-bottom: 10px;
        font-weight: bold;
    }
}
</style>

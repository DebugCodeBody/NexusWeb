<template>
    <div class="ding-qr_wrap flex justify-center h-full flex-col flex-wrap ">
        <div class="title">
            钉钉登录
        </div>
        <div class="qr flex">
            <div id="ding-qr">
            </div>
        </div>
        <div class="tip text-center">
            使用钉钉扫一扫登录
        </div>
    </div>
</template>

<script setup lang="ts">

onMounted(() => {


    window.DTFrameLogin(
        {
            id: 'ding-qr',
            width: 280,
            height: 280,
        },
        {
            redirect_uri: encodeURIComponent('http://192.168.1.222:8080/'),
            client_id: 'dingezzldx3msf07txc1',
            scope: 'openid',
            response_type: 'code',
            state: 'xxxxxxxxx',
            prompt: 'consent',
        },
        (loginResult: any) => {
            const { redirectUrl, authCode, state } = loginResult;

            console.log(loginResult)

        },
        (errorMsg: any) => {

            console.log("登录错误", errorMsg)


        },
    );

})

</script>

<script lang="ts">
export default {
    title: "微信扫码登录",
    name: ""
}
</script>

<style lang="scss">
.ding-qr_wrap {

    .title {
        width: 100%;
        font-size: 20px;
        line-height: 1.6;
        color: rgb(55, 55, 55);
        text-align: center;
        margin-bottom: 10px;
    }

    .qr {
        margin: auto;
    }

    #ding-qr {
        border-width: 1px;
        border-radius: 5px;
        overflow: hidden;
    }

    .tip {
        font-size: 12px;
        margin-top: 10px;
    }
}
</style>

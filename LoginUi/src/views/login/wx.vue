<template>
    <div id="weixin-qr" class="flex justify-center h-full">



    </div>
</template>

<script setup lang="ts">

onMounted(() => {
    const appid = "wx381cce832b1b83a1";
    new window.WxLogin({
        id: "weixin-qr",
        appid,
        scope: "snsapi_login",
        redirect_uri: "https%3A%2F%2Fcddgd.cn%2Fding%2Fosp%2Fdetaile%2Findex.html?appid=" + appid,
        state: "",
        style: "black",
        href: ""
    });

})

</script>

<script lang="ts">
export default {
    title: "微信扫码登录",
    name: ""
}
</script>

<style lang="scss">
</style>

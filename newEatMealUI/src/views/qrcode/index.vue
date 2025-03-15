<template>
    <div class="wh-full flex flex-center ">
        <div class="w-220px h-220px" ref="qrCodeEl">
        </div>
    </div>
</template>

<script setup lang="ts">

import viewStore from "@/store/view";


const view = viewStore();


const qrCodeEl = $ref();

onMounted(() => {

    var qrcode = new QRCode(qrCodeEl, {
        width: 220,
        height: 220
    });

    qrcode.makeCode(view.fcardid);




})
</script>

<script lang="ts">
export default {
    title: "取餐",
    name: ""
}
</script>

<style lang="scss"></style>

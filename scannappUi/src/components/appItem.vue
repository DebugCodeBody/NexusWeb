<template>
    <div class="app-item border" @click="onClickItem">
        <div class="wh-full content flex flex-col">
            <div class="img flex-1 flex">
                <div class="w-full">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3580" v-if="showSvg">
                        <path
                            d="M468.693333 16.725333a85.333333 85.333333 0 0 1 82.56 0l381.952 211.072a85.333333 85.333333 0 0 1 44.074667 74.666667v419.029333a85.333333 85.333333 0 0 1-44.074667 74.666667l-381.952 211.114667a85.333333 85.333333 0 0 1-82.56 0l-381.952-211.072A85.333333 85.333333 0 0 1 42.666667 721.493333V302.506667a85.333333 85.333333 0 0 1 44.074666-74.666667L468.693333 16.682667z m423.253334 285.781334l-381.994667-211.072L128 302.506667v418.986666l381.952 211.072 381.994667-211.072V302.506667z m-684.714667 42.197333a42.666667 42.666667 0 0 1 57.984-16.725333l244.736 135.253333 244.778667-135.253333a42.666667 42.666667 0 0 1 41.258666 74.666666l-243.370666 134.528v268.16a42.666667 42.666667 0 0 1-85.333334 0V537.173333L223.914667 402.688a42.666667 42.666667 0 0 1-16.682667-58.026667z"
                            fill="#75C82B" p-id="3581"></path>
                    </svg>
                    <img :src="imgUrl" alt="" v-if="item.img" @load="onImgLoad" v-show="imgLoad">
                </div>
            </div>
            <div class="name">{{ item.title }}</div>
            <a :href="item.url" target="_blank" ref="aEl"></a>
        </div>
    </div>
</template>

<script setup lang="ts">

import { addCount } from "@/api";

const Props = defineProps<{
    item: urlItem
}>();

const aEl = $ref<HTMLElement>();
let imgLoad = $ref(false);

const imgUrl = $computed(() => {


    let { img } = Props.item;

    if (img && !/^https?/.test(img)) {

        if (process.env.NODE_ENV == "production") {
            img = `${location.origin}/ding/media/smb/${img}`
        } else {
            img = `/api/media/smb/${img}`
        }
    }

    return img;


});

const showSvg = $computed(() => {
    return !imgLoad;
})



function onImgLoad() {

    imgLoad = true;

}

let isClick = false;

function onClickItem() {

    if(isClick){
        isClick = false;
        return;
    }

    isClick = true;


    addCount(Props.item.id);

    setTimeout(()=>{
        aEl.click();
    })

}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

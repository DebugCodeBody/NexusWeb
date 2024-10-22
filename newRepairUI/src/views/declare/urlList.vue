<template>
    <div class="url-list">
        <el-button v-for="item in showUrlList" :key="item.name" @click="onClickItem(item)">{{ item.name }}</el-button>
        <el-button @click="onClickMore" v-if="order">更多</el-button>
    </div>
</template>

<script setup lang="ts">

import { getToUrls, addToUrlCount } from "@/api"
import to from "await-to-js"
import { getUserName } from "@/store/user"


let order = $ref(false);
const urlArr = $ref<UrlItem[]>([])
const showUrlList = $computed(() => {

    const retUrl = [] as UrlItem[];

    if (urlArr.length) {


        if (order) {
            retUrl.push(urlArr[0]);
        } else {
            retUrl.push(...urlArr);
        }

    }

    return retUrl;

})


function onClickMore() {

    order = false;

}

function onClickItem(item: UrlItem) {

    const name = getUserName();

    function toUrl() {
        location.href = item.url;
    }

    addToUrlCount(item.id, name).finally(toUrl);
    setTimeout(toUrl, 500);

}



async function init() {

    const name = getUserName();

    const [err, result] = await to(getToUrls(name));

    if (err) {
        return;
    }


    order = result.order;
    urlArr.push(...result.data);

}



init();




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

.url-list{
    
    .el-button{
        margin-left: 0;
        margin-right: 5px;
        margin-bottom: 5px;
    }
}


</style>

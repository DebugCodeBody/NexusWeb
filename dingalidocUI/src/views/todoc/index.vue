<template>
    <div id="todoc" class="wh-full flex justify-center items-center" v-if="load">
        <div class="button">
            <el-button size="large">刷新页面</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">

import getSearch from "@/utils/urlSearch"
import { getDocUrl } from "@/api"




const id = getSearch("id"); 
const page = getSearch("page");

let error = $ref(false);
let load = $ref(false);


function init() {

    getDocUrl(id, page).then((src) => {

        location.href = src;

    }).catch(() => {

        error = true;
        load = true;


    })

}


if (!id || !page) {
    alert("请通过群消息进入本页面");
} else {
    init();
}











</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

#todoc{

    overflow: hidden;

}

</style>

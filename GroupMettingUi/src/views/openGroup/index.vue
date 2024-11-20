<template>
    <div></div>
</template>

<script setup lang="ts">

import to from "await-to-js";

import getSearch from "@/utils/urlSearch"
import { getSignature } from "@/api/coolapp"
import { openGroup } from "@/utils/ddgroup";




const conversation = getSearch("conversation");

async function init() {



    if (conversation) {

        try {

            await openGroup(conversation);    

            setTimeout(() => {
                dd.biz.navigation.quit();
            }, 1000);

        } catch (error) {
            
            alert(JSON.stringify(error))
            
            
        }
        

    }


}


init();


</script>

<script lang="ts">
export default {
    name: "",
    title: "会议打开群"
}
</script>

<style lang="scss"></style>

<template>
    <div>
    </div>
</template>

<script setup lang="ts">

import getSearch from "@/utils/urlSearch"



const conversation = getSearch("conversation");

if (conversation) {

    dd.biz.chat.toConversationByOpenConversationId({
        openConversationId: conversation
    });

    setTimeout(() => {
        dd.biz.navigation.quit();
    }, 1000)
}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

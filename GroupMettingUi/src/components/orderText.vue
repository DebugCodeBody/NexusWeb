<template>
    <span class="order-text">
        <template v-for="(item, index) in splitVlue" :key="index">




            <a :href="getHref(item[1])" target="_blank" v-if="item[0]">{{ item[1] }}</a>
            <span v-else>{{ item[1] }}</span>

        </template>
    </span>
</template>

<script setup lang="ts">

import { splitText } from "@/utils/orderSplit"


const Props = defineProps<{
    value: string
}>();

const splitVlue = computed(() => {


    return splitText(Props.value) as [boolean, string][];
})

function getHref(order: string) {


    let path = "";

    if (process.env.NODE_ENV == "production") {
        path = `https://cddgd.cn`;
    }else{
        path = `http://localhost`;
    }

    return `${path}/ding/order_info/index.html?order=${order}`
}

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.order-text {
    a {
        text-decoration: underline;
        color: blue
    }
}
</style>

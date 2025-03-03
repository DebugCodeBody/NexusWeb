<template>
    <span>
        <template v-for="(item,index) in split" :key="index">
            <a v-if="item[0]" :href="getUrl(item[1])" target="_blank" @click.stop="onZeroClick">{{item[1]}}</a>
            <template v-else>{{item[1]}}</template>
        </template>
    </span>
</template>

<script setup lang="ts">
import { splitText } from "./utils"

const Props = defineProps<{
    text: string
}>();

const split = splitText(Props.text);

/**
 * 这个只有在生产环境才只能正常打开
 */
function getUrl(val: string) {
    return `../order_info/index.html?order=${encodeURIComponent(val)}`
}

function onZeroClick(){}


</script>

<script lang="ts">
/**
 * 
 *  订单标签
 *  主要是用来分割内容里面的订单标签，渲染成打开订单详细页面
 * 
 */
export default {
    name: "OrderSpan"
}


</script>

<style lang="scss">

</style>

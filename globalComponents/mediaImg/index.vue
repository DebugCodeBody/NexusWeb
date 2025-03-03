<template>
    <img :src="getHref(src)" />
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

const Props = defineProps<{
    src: string
}>();

function getHref(val: string) {
    let href = ""
    if (process.env.NODE_ENV == "production") {
        href = `../media/smb/${val}`
    } else {
        href = `/media/smb/${val}`
    }

    return href;
}





</script>

<script lang="ts">
/**
 * 一个封装好的图片组件
 * 这样就可以不用一直写判断路径了
 * 
 */
export default {
    name: "mediaImg"
}


</script>

<style lang="scss">

</style>

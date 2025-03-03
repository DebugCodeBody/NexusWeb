<template>
    <el-button class="map-button" :type="type" :plain="plain" :size="size">
        <a :href="gaodeUrl(item)">打开地图</a>
    </el-button>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

const Props = withDefaults(defineProps<{
    item: {
        sndaddr,
        /** 搜索关键字 */
        sndname,
        /** 经纬度 */
        sndlocate,
    },
    type?: string
    plain?: boolean,
    size?: string
}>(), {

    plain: true,
    type: "primary",
    size: "small"

});

function gaodeUrl(item: any) {

    if (item.sndlocate) {
        const split = item.sndlocate.split(",");
        if (split.length == 2 && split[0] && split[1]) {

            let parseArr = [parseFloat(split[0]), parseFloat(split[1])];


            // // 先把高德暂停
            // if (item.sndmap == 2) {
            //     parseArr = getGCJ02_2(parseFloat(split[0]), parseFloat(split[1]));
            // }

            return `amapuri://route/plan/?dlat=${parseArr[0]}&dlon=${parseArr[1]}&dev=0&t=0`
        }
    }

    return `amapuri://route/plan/?dname=${item.sndname || item.sndaddr}&dev=0&t=0`

}




</script>

<script lang="ts">
export default {
    name: "map-button"
}


</script>

<style lang="scss">
.map-button{
    a{
        text-decoration: none;
    }
}

</style>

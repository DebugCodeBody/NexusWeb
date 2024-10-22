<template>
    <double-column label="操作人员">
        <span>{{ item.createuser }}</span>
    </double-column>
    <double-column label="操作时间">
        <span>{{ fromDate(item.createdate) }}</span>
    </double-column>
    <double-column label="移动流程" v-if="item.stageid == 2">
        <span>{{ arr[0] }}</span>
    </double-column>
    <double-column label="留言内容" v-if="memo">
        <span>{{ memo }}</span>
    </double-column>
</template>

<script setup lang="ts">
import DoubleColumn from "@/components/douCol/index.vue"

import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { fromDate } from "@/utils/other"

const Props = defineProps<{
    item: step
}>()

const itemMemo = Props.item.memo || "";


const arr = itemMemo.split(";");

const memo = computed(() => {
    if (Props.item.stageid == 2) {
        return itemMemo.slice(arr[0].length + 1);
    } else {
        return Props.item.memo
    }
})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

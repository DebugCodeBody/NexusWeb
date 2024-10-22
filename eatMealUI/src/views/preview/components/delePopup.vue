<template>
    <div class="dele-popu-view" v-if="item">
        <div v-for="(key, index) in time.time" :key="index" class="item">
            <food-item v-if="item[index].length > 0" :date="time.activeDateStr" :time="index" :data="item[index]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import foodItem from "@/components/foodItem.vue"


import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { Toast } from 'vant';
import { timeStore } from "@/store/time"
import { orderStore } from "@/store/order"


const Props = defineProps<{
    modelValue: boolean,
    data: foodItem,
}>();

const order = orderStore();
const time = timeStore();
const item = ref();

if (order.getDayNum(time.activeDateStr, Props.data) > 0) {
    item.value = order.getFood(time.activeDateStr, Props.data);
}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.dele-popu-view {
    flex: 1;

    padding-top: 10px;
    box-sizing: border-box;

    .van-checkbox__icon {
        display: none;
    }

    .van-checkbox__label {
        margin-left: 0;
    }
}
</style>

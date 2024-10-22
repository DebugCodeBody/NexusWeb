<template>
    <div class="board-top-view">
        <template v-if="!empty">
            <div class="item" v-for="{name,data} in list" :key="name">
                <div class="food-top" v-if="false">
                    <span class="title">{{ name }}</span>
                </div>
                <div class="food-view">
                    <van-grid :gutter="5" :column-num="2">
                        <food-item v-for="elem in data" :key="elem.name" :data="elem" :dateEnd="dateEnd" />
                    </van-grid>
                </div>
            </div>
        </template>


        <van-empty description="当天未排餐" v-else />
    </div>
</template>

<script setup lang="ts">
import foodItem from "./foodItem.vue"

import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onUpdated, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { timeStore } from "@/store/time"
import { foodStore } from "@/store/food"


const Props = defineProps<{
    date: string,
    item: foodData
}>();


const time = timeStore();
const food = foodStore();

const dateEnd = time.getDateEnd(Props.date);

const empty = computed(() => {
    return Props.item.reduce((val, elem) => (val + elem.length), 0) == 0
})


const list = computed(() => {
    const { activeDateTime } = time;

    return Props.item[activeDateTime];
});


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.board-top-view {
    flex: 1;
    padding: 10px;
    overflow: auto;

    .item {
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 10px;

        background-color: white;

        .food-top {
            margin-bottom: 10px;

            .title {
                font-size: 16px;
                font-weight: bold;
            }
        }

    }


}
</style>

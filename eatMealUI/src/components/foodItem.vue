<template>
    <div class="food-item-container" v-if="totla > 0">
        <div class="time">{{ timeStr.time[time] }}</div>
        <div class="food-li-view">
            <template v-for="elem in data" :key="`${elem.token}${elem.taste.fid}`">
                <div class="food-item" v-if="elem.weight > 0">
                    <div class="food-item-left">
                        <van-checkbox v-model="elem.pack" shape="square" @change="onPack">
                            <food-name :name="elem.name" :taste="elem.taste.prop" />
                        </van-checkbox>
                    </div>
                    <van-tag type="primary" plain v-if="elem.pack" class="pack-tag">打包</van-tag>
                    <van-tag type="danger" plain v-if="elem.iscache" class="cache-tag">未提交</van-tag>
                    <div class="food-item-right">
                        <span v-if="false">{{ elem.taste.prop }}</span>
                        <van-stepper 
                            v-model="elem.weight" 
                            :long-press="false" 
                            :disable-input="true" 
                            :min="0"
                            :before-change="beforeChange"
                            @plus="onPlus(elem)" 
                            @minus="onMinus(elem)" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import foodName from "@/components/foodName.vue"

import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { orderStore } from "@/store/order"
import { timeStore } from "@/store/time"



const Emits = defineEmits<{
    (e: 'onPack', value: boolean): void;
    (e: 'onAdd', value: orderItems): void;
    (e: 'onDel', value: orderItems): void;
}>();

const Props = defineProps<{

    /**
     * 日期
     */
    date: string,
    /**
     * 时间段
     */
    time: number,
    /**
     * 点餐
     */
    data: orderItems
}>();

const order = orderStore();
const timeStr = timeStore();

const totla = computed(() => {
    return Props.data.reduce((val, elem) => {
        return val + elem.weight
    }, 0)
})


function onPack(value: boolean) {
    Emits('onPack', value);
}

async function onPlus(item: orderItem) {
    try {
        await order.addActionPrompt();
        order.addFood(Props.date, Props.time, item.taste.parent, item.taste, 1);
    } catch (error:any) {
        error.message
        
    }
}

function onMinus(item: orderItem) {
    order.delFood(Props.date, Props.time, item.taste.parent, item.taste);
}


/** 这里全部返回false, 增减数量通过 onPlus 和 onMinus 函数进行*/
function beforeChange(){
    return false;
}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" >
.food-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 14px;
    color: #969799;
    position: relative;

    &:not(:last-child) {
        margin-bottom: 10px;
        border-bottom: 1px solid #ebedf0
    }

    .food-item-left,
    .food-item-right {
        margin-bottom: 5px;
    }

    .van-stepper {
        margin-left: 30px;
    }

    .pack-tag {
        display: none;
        position: absolute;

        left: 50%;
    }

    .cache-tag{
        position: absolute;

        left: 50%;
    }

}
</style>

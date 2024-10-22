<template>

    <div class="cart-wrap" :class="{ 'error':  !isNowDay && data.error  }" v-if="!isFuture">
        <div class="header">
            <span>{{ getWeekText(data.time) }}</span>
            <span class="abnormal" v-if="!isNowDay">打卡异常</span>
            <span v-if="isNowDay">当天</span>
            <span>{{ data.time }}</span>
        </div>
        <div class="detailed-wrap">
            <div class="detailed">
                <div class="wrap">
                    <div>打卡</div>
                    <div v-for="(item,index) in clock" :key="index" :class="{ 'blank': isEmpty(item)   }">{{item}}</div>
                </div>
                <div class="wrap center">
                    <div>请假</div>
                    <div v-for="(item,index) in leave" :key="index" :class="{ 'blank': isEmpty(item)   }">
                        {{getText(item)}}</div>
                </div>
                <div class="wrap other">
                    <div>其他</div>
                    <div v-for="item in other" :key="item" class="blank">:</div>
                    <div>津贴：{{data.allowance}}</div>
                    <div>加班：{{data.work}}</div>
                    <div>餐费：{{data.meals}}</div>
                    <div>补贴：{{data.buckle}}</div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { WorkTable } from "@/layout/module"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, computed, watch, onBeforeMount, onMounted, onUpdated, onBeforeUnmount, onUnmounted } from "vue"
import { getWeekText } from "@/utils/moment"

import moment from "moment";


const Props = defineProps<{
    data: WorkTable
}>()




const other = computed(() => {

    const retVal = (Props.data && Props.data.clock && Props.data.clock.length - 4) || 0;

    return retVal > 0 ? retVal : 0
})

const clock = computed(() => {
    const { clock, leave } = Props.data;


    if ((clock.length == 0 && leave.length == 0)) {
        return Array(4).fill(":")
    }
    /**
     * 如果当前所有的打卡时间都是冒号，当天可能请假了
     * 请假的时间表是绝对大于3的数量
     */
    // if(clock.every((elem)=>{return elem == '  :  '})){
    //     clock.length = 0;

    //     return Array(leave.length || 3).fill(":") 
    // }

    if (clock.length < 4) {
        return clock.concat(Array(4 - clock.length).fill(":"))
    }


    return clock
})

const leave = computed(() => {
    const { leave } = Props.data;


    if (clock.value.length == 0 && leave.length == 0) {
        return Array(4).fill(":")
    }

    if (leave.length == 0) {
        return Array(clock.value.length).fill(":")
    }

    // BUG: 这里有可能会减出负数，所以需要判断一下才可以 
    const arrLen = clock.value.length - leave.length;

    return leave.concat(Array(arrLen < 0 ? 0 : arrLen).fill(":"))
})

/**
 * 是否为当天
 */
const isNowDay = computed(() => {
    return moment().format("MM-DD") == Props.data.time
})

/**
 * 是否为未来的日子，未来的日子不显示出来
 */
const isFuture = computed(() => {

  
    let now = moment();
    let time = moment(`${moment().format("YYYY")}-${Props.data.time}`);
    if(parseInt(Props.data.time.split("-")[0]) == 12 && parseInt(now.format("MM")) == 1){
        return false;
    }

    return moment(now.format("YYYY-MM-DD")).diff(moment(time.format("YYYY-MM-DD")), "days") < 0
})




function isEmpty(text: string) {
    return text == ":" || text == ""
}
function getText(text: string) {
    return text == "" ? ":" : text;
}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" scoped>
$border: 1px solid rgb(235, 235, 235);

.blank {
    color: white !important;
}

.cart-wrap {
    background-color: white;
    border-radius: 5px;
    border-top: none;
    margin-bottom: 15px;
    overflow: hidden;

    border: $border;

    &.error * {
        color: #f56c6c !important;
        background: #fef0f0 !important;

        .abnormal {
            display: block;
        }
    }

}

.header {
    display: flex;
    background-color: white;
    border-bottom: $border;


    span {
        width: 50%;
        padding: 10px;
        box-sizing: border-box;
        display: inline-block;
        text-align: center;


        line-height: 25px;

    }

    .abnormal {
        color: white;
    }

}

.detailed-wrap {
    font-size: 14px;
    font-weight: 400;

    .detailed {
        display: flex;
        background-color: white;


        .wrap {
            width: 33.33%;
            text-align: center;

            div {
                padding: 2px;
                line-height: 25px;
                border-bottom: $border;

                &:last-child {
                    border-bottom: none;
                }
            }

            &.center {
                border-right: $border;
                border-left: $border;
            }

        }

    }

}
</style>

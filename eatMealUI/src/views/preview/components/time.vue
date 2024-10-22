<template>
    <van-tabbar v-model="active" class="time-view" :fixed="false" @change="onChange">
        <van-tabbar-item v-if="time.next">
            <van-badge :dot="lastDot">
                <div @click.stop="onLastWeek">上周</div>
            </van-badge>
        </van-tabbar-item>

        <van-tabbar-item v-for="item in time.date" :key="item.str" :class="{'day-end': dayEnd(item) }">
            <van-badge :dot="showDot(item)">
                <div>{{item.weekday}}</div>
                <div class="date">{{ item.str }}</div>
            </van-badge>
            <stop-icon />
        </van-tabbar-item>
        <van-tabbar-item v-if="!time.next">
            <van-badge :dot="nextDot">
                <div @click.stop="onNextWeek">下周</div>
            </van-badge>
        </van-tabbar-item>
    </van-tabbar>


</template>
<script setup lang="ts">
import stopIcon from "@/components/stop.vue"


import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { getWeekTime, getNowTime, getWeekDate } from "@/utils/time"

import { timeStore } from "@/store/time"
import { dotStore } from "@/store/dot"


const dot = dotStore();
const time = timeStore();
const active = ref(time.selectDate);



/**
 * 下周红点显示
 */
const nextDot = computed(() => {

    if (dot[time.nextWeek[0].date]) {
        return time.nextWeek.some(({ date, str }) => {
            return dot[date] && dot[date].some(a => a) && !time.getDateEnd(str);
        })

    } else {
        return dot.next[0]
    }
})

/**
 * 上周红点显示
 */
const lastDot = computed(() => {

    if (dot[time.nowWeek[0].date]) {
        return time.nowWeek.some(({ date, str }) => {
            return dot[date] && dot[date].some(a => a) && !time.getDateEnd(str);
        })

    } else {
        return dot.schedu[0]
    }

})




const thisWeek = {
    time: 1,
    date: -1
};
const nextWeek = {
    time: 1,
    date: 1
};

if (time.next) {
    thisWeek.date = 5;
    thisWeek.time = 0;

    active.value = 1;

    time.setDate(0);
    time.setKeepTime(0);

} else {
    nextWeek.date = 0;

}


function onChange(value: number) {
    if (time.next) {
        value -= 1;
    }
    time.setDate(value);
    time.setKeepTime(1);
}

function saveData(week: any) {
    week.date = time.selectDate;
    week.time = time.activeDateTime;
}

function setData(week: any) {
    if (week.date != -1) {
        active.value = week.date;
        time.setDate(week.date)

        /**
         * 每次切换都弄成中餐
         */
        time.setKeepTime(1);

        // time.setKeepTime(week.time);
    }
}

function onLastWeek() {
    saveData(nextWeek);
    setData(thisWeek);

    time.next = false;
}

function onNextWeek() {
    saveData(thisWeek);
    setData(nextWeek);
    active.value += 1;

    time.next = true;
}

function showDot({ date, str }: storeDate) {
    return dot.schedu[0] != null && dot[date] && dot[date].some((a) => a) && !time.getDateEnd(str);
}

function dayEnd({ date, str }: storeDate){
    return time.getDateEnd(str);
}


</script>

<script lang="ts">
export default {
    name: "timeView"
}
</script>

<style lang="scss">
.time-view {
    width: 100%;
    background-color: white;
    font-size: 14px;

    .time-view-ul {
        display: flex;
        justify-content: space-between;

        li {

            padding: 10px;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

        }
    }

    .date {
        margin-top: 5px;
    }

    .van-tabbar-item {
        text-align: center;
        position: relative;

        .van-icon {
            position: absolute;
            top: 0;
            left: 0;

        }
    }

}
</style>

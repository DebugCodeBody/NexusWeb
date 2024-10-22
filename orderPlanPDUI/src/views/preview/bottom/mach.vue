<template>
    <div style="display: flex; flex-direction: column; height: 100%;">
        <div class="title">
            <span>{{data.name}}</span>
            <span class="time" v-if="totleTime.hours || totleTime.minutes">总时:
                <time-span :time="totleTime" />
            </span>
            <span v-if="nowTotle.hours || nowTotle.minutes">今天:
                <time-span :time="nowTotle" />
            </span>
        </div>
        <el-scrollbar>
            <draggable :data="data.data" :bind="data" itemkey="moid" :resize="onResize" :move="onMove">
                <template #default="{element}">
                    <item :data="element" :menu="!isOrderList" />
                </template>
            </draggable>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import item from "./item.vue"
import TimeSpan from "./time.vue"
import Draggable from "global@/Draggable/index.vue"
import type { Resize } from "global@/Draggable/index.vue"

import moment from "moment"


const Emit = defineEmits<{
    (e: 'add', mcid: number, moid: number): void;
    (e: 'move', value: Resize): boolean;
}>();


const Props = defineProps<{
    data: Mach
}>()

/** 是否为订单列表 */
let isOrderList = $computed(() => {
    return Props.data.id == 0
})

let totleTime = $ref<Time>({} as Time)
let nowTotle = $ref<Time>({} as Time)


watch(() => {
    return Props.data
}, (value) => {
    if (isOrderList) { return; }

    const nowTime = moment();
    const fromat = nowTime.format('YYYY-MM-DD');

    let hours = 0;
    let minutes = 0;
    let nowHours = 0;
    let nowMinutes = 0;

    value.data.forEach((elem) => {
        hours += elem.workhour.hours;
        minutes += elem.workhour.minutes;
        if (fromat == elem.plan_done) {
            nowHours += elem.workhour.hours;
            nowMinutes += elem.workhour.minutes;
        }

    });

    totleTime = {
        hours,
        minutes
    };

    nowTotle = {
        hours: nowHours,
        minutes: nowMinutes
    }

}, {
    deep: true,
    immediate: true
})


function onResize(event: Resize<Mach>) {

    return !isOrderList
}

function onMove(event: Resize<Mach>) {
    if (event.fromData.id == 0) {
        Emit("add", event.toData.id, event.fromData.data[event.fromIndex].moid);
    } else {
        Emit("move", event);
    }
}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" scoped>
.title {
    font-size: 12px;
    font-weight: bolder;
    margin-bottom: 10px;

    .time {
        margin: 0 10px;
    }

}

.testc {

    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.testd {

    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;

}
</style>

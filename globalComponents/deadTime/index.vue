<template>
    <span class="highlig-end-time" :class="showClass">{{ showTime }} 截止</span>
</template>

<script setup lang="ts">
import moment from "moment"

const Props = defineProps<{
    time: string
}>();

let showTime = $ref("");
let showClass = $ref("default");
const nowDate = moment();
const taskDate = moment(Props.time);

let diffDays = moment(nowDate.format('YYYY-MM-DD')).diff(moment(taskDate.format('YYYY-MM-DD')), "days");

// 如果是截至是当天
if (diffDays == 0) {

    // 判断一下当前时间是否过去了
    if (taskDate.diff(nowDate, "minute") > 0) {
        showClass = "warning"
    } else {
        showClass = "danger"
    }

    showTime =  `今天 ${taskDate.format("HH:mm")}`
    
// 如果截至时间间隔绝对值超过2以上，那么就显示日期
} else if (Math.abs(diffDays) > 2) {
    // 如果间隔时间大于零，就代表这时间已经过期了
    if (diffDays > 0) {
        showClass = "danger"
    }
    showTime = `${taskDate.format('MM-DD')}`

// 如果间隔时间小于零，那就代表着时间还没有到
} else if (diffDays < 0) {
    showTime = ['明天', '后天'][Math.abs(diffDays) - 1]
} else {
// 如果间隔时间大于零，就代表这时间已经过期了
    showClass = "danger";
    showTime = ['昨天', '前天'][Math.abs(diffDays) - 1]
}


</script>

<script lang="ts">
/** 
 * 截止日期显示组件
 * 通过对比时间来决定时间的显示内容与颜色
 */
export default {
    name: "deadTime"
}
</script>

<style lang="scss">
.highlig-end-time {
    padding: 2px 10px;
    border-radius: 4px;
    color: #fff;

    &.default {
        background: #1b9aee;
    }

    &.warning {
        background: #fa8c15;
    }

    &.danger {
        background: red;
    }
}
</style>

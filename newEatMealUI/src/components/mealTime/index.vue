<template>
    <div class="p-10px flex justify-between navbar_time ">

        <div class="time-item" v-for="(item, index) in timeList" :key="item.value" @click="onClick(item)">
            <van-badge :dot="!!utipTime[index]">
                <van-button plain size="small" :type="item.value == select ? 'primary' : 'default'"
                    :disabled="!!item.disabled">{{ item.key }}</van-button>
            </van-badge>
        </div>

    </div>
</template>

<script setup lang="ts">


const Emit = defineEmits<{
    (e: 'click', value: MealTime): void;
}>();


const Porps = defineProps<{
    timeList: timeItem[],
    utipTime: any[],
    select: MealTime
}>();



function onClick(item: timeItem) {

    if (item.event) {
        item.event();
    } else {
        Emit("click", item.value);
    }
}











</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.navbar_time {

    .time-item {
        width: 20%;
        display: flex;
        justify-content: center;
        text-align: center;

        .van-badge__wrapper {
            width: 80%;

            button {
                width: 100%;
            }
        }

    }
}
</style>

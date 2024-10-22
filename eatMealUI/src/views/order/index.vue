<template>
    <div id="order-view" :class="{'submit-done':submitDone}">
        <div class="order-top-view">
            <van-collapse v-model="activeNames" ref="collapse">
                <template v-for="item in order.dataList" :key="item.str">
                    <van-collapse-item :title="`${item.str} ${item.weekday}`" :name="item.str"
                        v-if="order[item.str].num > 0">
                        <div v-for="(key, index) in time.time" :key="index" class="item">
                            <food-item v-if="orderlen(item.str, index)" :date="item.str" :time="index" :data="order[item.str].data[index]" @onPack="onPack"  />
                        </div>
                    </van-collapse-item>
                </template>
            </van-collapse>
        </div>
        <div class="order-bottom-view">
            <van-action-bar>
                <div class="left" v-if="!submitDone">
                    <van-checkbox v-model="allPack" shape="square" >全部打包</van-checkbox>
                </div>
                <van-action-bar-button type="danger" text="返回" @click="onClickReturn" />
                <van-action-bar-button type="primary" text="提交" @click="onClickButton" :disabled="disabled" v-if="!submitDone" />
            </van-action-bar>
        </div>
        <submit-dialog ref="submitEl" />
    </div>
</template>

<script setup lang="ts">
import foodItem from "@/components/foodItem.vue"
import submitDialog from "./components/submitDialog.vue"

import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { Dialog } from 'vant';
import { dataSubmit } from "@/api"

import { timeStore } from "@/store/time"
import { orderStore } from "@/store/order"
import { dotStore } from "@/store/dot"



const time = timeStore();
const order = orderStore();
const dot = dotStore();

const activeNames = ref([]);
const collapse = ref();
const submitEl = ref();
const submitDone = ref(false);


const disabled = computed(() => {
    const length = order.length.value;

    return length == 0 && !dot.submit[0];

})

const allPack = computed({
    get() {
        const { value } = order.length;

        return value > 0 && value == order.packLen.value;
    },
    set(value: boolean) {
        onAllPack(value);
    }
})

function onAllPack(value: boolean) {

    order.dataList.forEach((elem) => {
        order[elem.str].data.forEach((item) => {
            item.forEach((orderItem) => {
                orderItem.pack = value;
            })
        })
    })

    nextTick(() => {
        if (value) {
            order.packLen.value = order.length.value
        } else {
            order.packLen.value = 0
        }

        order.writePostData();
    })

}

function onPack(value: boolean) {
    if (value) {
        order.packLen.value += 1
    } else {
        order.packLen.value -= 1
    }
    order.writePostData();
}

function onClickReturn() {
    window.toPath("preview");
}

async function onClickButton() {
    const result = await submitEl.value.dialog();
    if (!result) {
        return;
    }

    // const postMap = {} as any;

    // order.dataList.forEach((elem) => {
    //     const obj = postMap[elem.date] = {} as any;

    //     order[elem.str].data.forEach((item, index) => {
    //         if (item.length == 0) {
    //             return;
    //         }

    //         obj[index + 1] = item.map((food) => {
    //             let name = food.name;
    //             let taste = food.taste.prop;

    //             if (taste != null && taste != "正常") {
    //                 name += `(${taste})`
    //             }

    //             return {
    //                 name,
    //                 pack: food.pack,
    //                 qty: food.weight
    //             }

    //         })

    //     })
    // })



    try {
        await dataSubmit(order.generatePostData());


        order.clearPostData();

        submitDone.value = true;
        dot.submit[0] = false;

        order.dataList.forEach((elem) => {
            order[elem.str].data.forEach((item) => {
                item.forEach((orderItem) => {
                    orderItem.iscache = false;
                })
            })
        })

        Dialog.alert({
            message: "提交成功"
        });


    } catch (err: any) {

        Dialog.alert({
            message: err.msg || err.message,
        })

    }

}


function orderlen(date: string, time: number) {
    return order[date] && order[date].data[time] && order[date].data[time].length > 0
}

onMounted(() => {
    collapse.value.toggleAll();
})


</script>

<script lang="ts">
export default {
    name: "",
    title: "提交"
}
</script>

<style lang="scss">
#order-view {
    display: flex;
    overflow: hidden;

    .order-top-view {
        width: 100%;

        overflow: auto;
        padding-bottom: 50px;



    }

    .order-bottom-view {
        display: flex;

        .van-action-bar {
            padding: 0 10px;
        }

        .left {
            display: flex;
            margin-right: 10px;
        }

        .right {
            flex: 1;
        }

    }

    &.submit-done {

        .van-checkbox__icon,
        .van-stepper__minus,
        .van-stepper__plus {
            display: none;
        }

        .van-checkbox__label {
            margin-left: 0;
        }

        .pack-tag {
            display: block;
        }
        .cache-tag{
            display: none;
        }
    }

}


.van-collapse-item {
    .van-collapse-item__title {
        font-weight: bold;
    }

    .van-collapse-item__title--expanded:after{
        display: none;
    }

}

.time {
    font-size: 14px;
    color: black;
    margin-bottom: 5px;
}
</style>

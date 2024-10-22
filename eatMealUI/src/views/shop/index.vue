<template>
    <div id="shop-view">
        <div class="shop-top-view">
            <div style="padding: 10px;background-color: white;">本月消费：{{cost}}</div>
            <van-collapse v-model="activeNames" ref="collapse">
                <template v-for="date in time.date" :key="date.str">
                    <van-collapse-item :title="`${date.str} ${date.weekday}`" :name="date.str" v-if="!!list[date.date]">
                        <div v-for="(key, index) in time.time" :key="index" class="item">
                            <div class="food-item-container" v-if="list[date.date][index].length > 0">
                                <div class="time">{{ key }}</div>
                                <van-grid :column-num="2" :center="false" :gutter="10" class="food-item">
                                    <van-grid-item v-for="item in list[date.date][index]" :key="item.name"
                                        class="item-item">
                                        <div>{{ item.name }}</div>
                                        <div class="arrt">
                                            <!-- <van-stepper v-model="item.weight" disable-input /> -->
                                            <span>{{item.weight}}</span>

                                            <van-tag type="primary" plain v-if="item.pack">打包</van-tag>
                                        </div>

                                    </van-grid-item>
                                </van-grid>
                            </div>
                        </div>
                    </van-collapse-item>
                </template>
            </van-collapse>
        </div>
        <div class="shop-bottom-view">
            <van-button color="linear-gradient(to right, #ff6034, #ee0a24)" @click="onClickReturn" block round>返回
            </van-button>
        </div>


    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { getWeekOrder, getTotleCost } from "@/api"

import { timeStore } from "@/store/time"


const time = timeStore();
const collapse = ref();

const activeNames = ref([]);
const list = ref<Record<string, Array<orderItems>>>({});
const cost = ref(0)


async function init() {

    try {

        const allResult = await Promise.all([getTotleCost(), getWeekOrder(time.date[0].date)]);

        cost.value = (allResult[0] as any).cost;
        list.value = allResult[1] as any;

        nextTick(() => {
            collapse.value.toggleAll();

        })
    } catch (error) {
        console.log(error);
    }

}

function onClickReturn() {
    window.toPath("preview");
}



init();

</script>

<script lang="ts">
export default {
    name: "",
    title: "已点详细"
}
</script>

<style lang="scss">
#shop-view {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;

    .shop-top-view {
        flex: 1;
        overflow: auto;
    }

    .shop-bottom-view {
        background-color: white;

    }

    .food-item {
        display: flex;
        color: black;
        flex-wrap: wrap;

        .van-grid-item__content {
            padding: 5px;
            border: 1px solid #dcdfe6;
            border-radius: 10px;
        }

        .item-item {


            .arrt {
                display: flex;
                justify-items: self-end;

                margin-top: 5px;

                span {
                    margin-right: 10px;
                }
            }

            .van-stepper {
                margin: 0;

                .van-stepper__minus,
                .van-stepper__plus {
                    display: none;
                }
            }




        }

    }

}
</style>

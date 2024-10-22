<template>
    <van-grid-item class="food-item-view" @click="onClick" :class="{ 'date-end': dateEnd }">
        <div class="grad-view" >
            <div class="grad-left-view">
                <div class="name">
                    <food-name :name="data.name" :taste="selectProp.prop" />
                </div>
                <div class="other">
                    <span class="price">{{ price }}</span>
                    <!-- <van-tag plain type="warning" v-if="dateEnd">已停售</van-tag> -->
                    <van-tag plain type="primary" class="number" v-if="stepper>0 && !shoppEnd">已选购：{{stepper}}</van-tag>
                    <van-tag plain type="danger" v-else-if="shoppEnd">售罄</van-tag>
                    <div v-else style="text-align: right;">
                        <div  v-for="(str,index) in data.raw" :key="index">
                            <span style="font-size: 12px;color:#969799"  plain type="primary" class="number">{{str}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </van-grid-item>
</template>

<script setup lang="ts">
import foodName from "@/components/foodName.vue"


import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { selectStore } from "@/store/select"
import { orderStore } from "@/store/order"
import { timeStore } from "@/store/time"

const Props = defineProps<{
    data: foodItem,
    /**
     * 今天是否已经结束点餐了
     */
    dateEnd: boolean
}>();


const time = timeStore();
const order = orderStore();
const select = selectStore();
const stepper = ref(Props.data.num);

const selectProp = computed(() => {
    const { data } = Props;
    const { id } = data;

    if (!id) {
        return {} as propItem
    } else {
        return data.prop.find((elem) => {
            return elem.fid == id;
        })!
    }
})


const isSelect = computed(() => {
    return stepper.value > 0
})

const price = computed(() => {

    if (selectProp.value) {
        return selectProp.value.price
    } else {
        return ""
    }

})


/**
 * 是否只有一种份量或者口味
 */
const sole = computed(() => {
    const { data } = Props;

    return data.prop.length == 1;

})

/**
 * 是否卖完了
 */
const shoppEnd = computed(() => {
    return Props.data.qty == 0
})

watch(() => {
    return Props.data.num
}, (value) => {
    stepper.value = value;
})


function onClick() {
    if (!Props.dateEnd) {
        onSelectFood();
        onSelectSpec();
    }

}

function onSelectFood() {
    select.item = Props.data
}

function onSelectSpec() {
    select.seleAttr = true;
}

function onShopp() {
    order.addFood(time.activeDateStr, time.activeDateTime, Props.data, selectProp.value!, 1);
}

/**
 * 步进器异步修改数量，返回false直接不让他们他们修改
 */
function beforeChange(val: number) {
    if (val > stepper.value) {
        if (sole.value) {
            onShopp();
        } else {
            onSelectSpec();
        }
    } else {
        if (sole.value) {
            order.delFood(time.activeDateStr, time.activeDateTime, Props.data, selectProp.value!);
        } else {
            const foodItem = order.getFood(time.activeDateStr, Props.data);
            if (foodItem[time.activeDateTime].length == 1) {
                order.delFood(time.activeDateStr, time.activeDateTime, Props.data, foodItem[time.activeDateTime][0].taste);
            } else {
                select.deleAttr = true;
            }
        }
    }

    return false;
}

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.food-item-view {

    .van-grid-item__content {
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        padding: 5px;

        &::after {
            border: none;
        }

    }

    &.date-end .van-grid-item__content{
        background: rgb(243 243 247);
        border-color: rgb(243 243 247);
    }

}

.grad-view {
    display: flex;
    width: 100%;
    


    .grad-left-view {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;

        .name {
            font-size: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 10px;
        }

        .other {
            font-size: 14px;

            display: flex;
            justify-content: space-between;
        }

        .price {
            font-weight: 400;
            color: rgb(238, 10, 36);
        }

        .attribute {
            font-size: 12px;
        }

    }

    .grad-right-view {
        height: 70px;

        flex-shrink: 0;
        font-size: 14px;
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;

        margin-left: 5px;

        & .skeleton {
            opacity: 0;
        }

        span {
            padding: 5px;
            border: 1px solid red;
            border-radius: 5px;

            background: #fff;
            border: 1px solid #dcdfe6;
            color: #606266;

            &.end {
                color: #fff;
                background-color: #f56c6c;
                border-color: #f56c6c
            }
        }

        .van-stepper {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

    }

}
</style>

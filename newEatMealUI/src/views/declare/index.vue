<template>
    <div class="w-full h-full flex flex-col overflow-hidden ">
        <div class="w-full flex-1 overflow-auto p-10px pb-0" :class="{
            'date-end': dayDisabled,
        }">
            <template v-if="!loadError">

                <template v-if="foodDataType.length">
                    <div class="w-full p-10px mb-10px rounded-10px flex flex-wrap overflow-y-auto food-block "
                        v-for="foodType in foodDataType" :key="foodType.name" :class="{
                            'food-odd-block': foodType.data.length % 2 == 1
                        }">

                        <div class="w-1/2 mb-10px food-item-block " v-for="foodItem in foodType.data"
                            :key="foodItem.name" @click="onClickFoodItem(foodItem)">
                            <div class="rounded-5px p-5px h-full food-item">
                                <div class="mb-10px text-16px overflow-hidden show-name">
                                    <span>{{ foodItem.showName }}</span>
                                </div>
                                <div>
                                    <div class="flex justify-between items-end">
                                        <span>
                                            <span class="text-0.85em price">{{ foodItem.showPrice }}</span>
                                        </span>
                                        <div>
                                            <div class="raw-container"
                                                v-if="foodItem.cartNum == 0 && foodItem.raw.length > 0">
                                                <p v-for="(rowItem, index) in foodItem.raw" :key="index">{{ rowItem }}
                                                </p>
                                            </div>
                                            <span class="text-16px" v-if="foodItem.cartNum > 0">
                                                <van-tag plain type="primary">已选购：{{ foodItem.cartNum }}</van-tag>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </template>
                <van-empty v-else-if="!loadList" description="当天未排餐" />

            </template>

            <van-empty image="network" description="获取数据失败，请重试" v-else>
                <van-button type="primary" @click="getDataList(time.getActiveWeekDateYMD)">刷新</van-button>
            </van-empty>

        </div>

        <div class="h-105px w-full navbar flex flex-col">

            <div class="p-10px flex justify-between navbar_time ">

                <div class="time-item" v-for="(item, index) in time.MealTimeArr" :key="item.value"
                    @click="time.setMealTime(item.value)">
                    <van-badge :dot="!!utipTime[index]">
                        <van-button plain size="small" :type="item.value == time.selectMealTime ? 'primary' : 'default'
                        ">{{ item.key }}</van-button>
                    </van-badge>
                </div>

                <div class="time-item">
                    <van-badge :dot="false">
                        <van-button plain type="default" size="small" @click="view.toView('details')">已点</van-button>
                    </van-badge>
                </div>

                <div class="time-item">
                    <van-badge :dot="cart.dot">
                        <van-button plain type="default" size="small" @click="view.toView('orderCart')">提交</van-button>
                    </van-badge>
                </div>

            </div>

            <div class="flex-1 flex justify-between navbar_date">

                <div class="flex-1 text-center navbar_date-item" v-if="!time.isNow" @click="onClickSetSelectWeek(true)">
                    <van-badge :dot="utip.now">
                        <div class="flex flex-col content-center text-12px">
                            <span>上周</span>
                        </div>
                    </van-badge>
                </div>
                <div class="flex-1 text-center navbar_date-item" v-for="dateItem in time.getActivaWeekTime"
                    @click="time.setSelectTime(dateItem)" :key="dateItem.YMD" :class="{
                        disabled: dateItem.disabled,
                        select: dateItem.select
                    }">
                    <van-badge :dot="getUtipYMD(dateItem)">
                        <div class="flex flex-col content-center text-12px">
                            <p>{{ dateItem.week }}</p>
                            <p class="mt-5px">{{ dateItem.MD }}</p>
                        </div>
                    </van-badge>
                    <time-stop v-if="dateItem.disabled"></time-stop>
                </div>
                <div class="flex-1 text-center navbar_date-item" v-if="time.isNow" @click="onClickSetSelectWeek(false)">
                    <van-badge :dot="utip.next">
                        <div class="flex flex-col content-center text-12px">
                            <span>下周</span>
                        </div>
                    </van-badge>
                </div>
            </div>
        </div>

        <property-selector />
    </div>
</template>

<script setup lang="ts">
import to from "await-to-js"
import { debounce } from "@/utils/other"

import propertySelector from "./propertySelector.vue"

import timeStop from "@/components/stop.vue"


import { getDateFood, getUtip } from "@/api"
import { timeStore, viewStore, cartStore, foodListStore, utipStore } from "@/store"
import { getShowName, getDefautlDayArray } from "@/utils/other"

/**
* 生成一个ref的菜单
*/
function generateReFood(food: Datum) {


    const s: any = $ref({
        ...food,
        cartNum: 0,
        showPrice: "",
        showName: "",
        selectAttri: computed(() => {


            return getShowName(s.name, s.attributes, s.specFoods)

        }),
        selectPrice: computed(() => {

            if (s.details.price) {
                return food.details.price
            } else {

                const piceItem: any = [].concat(...s.specFoods.map((elem: any) => elem.details) as any).find((elem: any) => elem.selected);

                if (piceItem) {
                    return piceItem.price
                } else {
                    return "价格"
                }
            }

        })

    })


    s.showPrice = s.selectPrice;
    s.showName = s.selectAttri;

    return s;

}


const view = viewStore();
const cart = cartStore();
const time = timeStore();
const foodList = foodListStore();
const utip = utipStore();

let loadList = $ref(true);
let loadError = $ref(false)
let stopStorage = false;
let subscribeEditStop = false;


cart.$subscribe(debounce((event, data) => {
    if (!data.stopStorage && !stopStorage) {
        cart.saveStorage();
    } else if (subscribeEditStop) {
        stopStorage = false;
        subscribeEditStop = false;
    }

}))



const dayDisabled = $computed(() => {
    return time.order.nowTime.disabled;
});

const foodDataType = $computed(() => {
    var retVal = foodList.getDateFood(time.getActiveWeekDateYMD);
    return retVal ? retVal[time.selectMealTime] : [];
})

/** 某一天中四个时间段的红点显示，默认不显示 */
const utipTime = $computed(() => {

    let retVal = utip[time.getActiveWeekDay.YMD];
    if (!retVal || time.getActiveWeekDay.disabled) {
        retVal = [0, 0, 0, 0];
    }

    return retVal
})


function getUtipYMD(week: Time) {
    return !week.disabled && (utip[week.YMD] || [0, 0, 0, 0]).some((elem: number) => elem == 1)
}

function onClickFoodItem(value: any) {
    if (!dayDisabled) {
        foodList.setSelect(value);
    }
}

function onClickSetSelectWeek(value: boolean) {
    time.setSelectWeek(value);
}


watch(cart.data, (value) => {
    const foodList = value.get(time.getActiveWeekDay) || getDefautlDayArray();

    foodList.forEach((elem, mealIndex) => {
        if ([1, 2].indexOf(mealIndex) == -1) {
            return;
        }
        let rice = false;
        let dishes = false

        if (elem.length >= 2) {

            for (let index = 0; index < elem.length; index++) {
                const element = elem[index];

                if (element.food.type == "主食") {
                    rice = true
                } else if (element.food.type == "菜") {
                    dishes = true
                }
                if (rice && dishes) {
                    break;
                }
            }

        }

        try {
            utip[time.getActiveWeekDay.YMD][mealIndex] = !(rice && dishes);
        } catch {
            return;
        }

    })


})

async function getDataList(value: string) {

    if (!foodList.date[value]) {

        loadList = true;
        loadError = false;


        const [respErr, response] = await to(getDateFood(value));

        if (respErr) {
            loadError = true;
            return;
        }

        foodList.date[value] = response.data.map((typeData) => {

            return typeData.map((elem) => {

                for (let index = 0; index < elem.data.length; index++) {

                    const element = elem.data[index];
                    elem.data[index] = generateReFood(element);
                }

                return elem;
            })


        }) as any;


        time.getActiveWeekDay.disabled = response.end;

        stopStorage = true;

        cart.setHistory(time.getActiveWeekDay, foodList.date[value], response.shop)
        if (time.getActiveWeekDay.disabled) {
            cart.clearDayStorage(time.getActiveWeekDay)
        } else {
            cart.loadStorage(time.getActiveWeekDay, foodList.date[value])
        }


        subscribeEditStop = true;
        loadList = false;

    }


}



async function init() {

    const response = await Promise.all([getUtip(), getDataList(time.getActiveWeekDateYMD)])

    utip.nowWeek = response[0].nowWeek
    utip.nextWeek = response[0].nextWeek

    const { allTime } = time;
    for (const [key, value]  of Object.entries(Object.assign({}, utip.nowWeek, utip.nextWeek))) {

        if (allTime[key].disabled) {
            (value as any[]).forEach((elem, index) => {
                (value as any[])[index] = 0
            })
        }

        utip[key] = value
    }



}



watch(() => time.getActiveWeekDateYMD, async (value) => {
    getDataList(value)
},)


init()







</script>

<script lang="ts">
export default {
    title: "点餐",
    name: "eatmeal"
}
</script>

<style lang="scss">
.price {
    font-weight: 400;
    color: rgb(238, 10, 36);
}

.date-end {
    .food-block .food-item-block .food-item {
        background: #f3f3f7;

        border-color: #f3f3f7;
    }
}

.food-block {
    background-color: white;


    .food-item-block {

        align-self: stretch;

        &:nth-child(odd) {
            padding-right: 2.5px;
        }

        &:nth-child(even) {
            padding-left: 2.5px;
        }

        .food-item {
            border: 1px solid #dcdfe6;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .raw-container {
            font-size: 12px;
            line-height: 16px;
            color: rgb(150, 151, 153);
        }

        .show-name,
        .show-name span {
            line-height: 18px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;

        }
    }

    &.food-odd-block .food-item-block:nth-last-child(-n+1) {
        margin-bottom: 0;
    }

    &:not(.food-odd-block) .food-item-block:nth-last-child(-n+2) {
        margin-bottom: 0;
    }


}

.navbar {
    background-color: white;
    border-top: 1px solid rgb(240, 241, 242);

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

    .navbar_date {
        border-top: 1px solid #ebedf0;
        box-sizing: border-box;


        .navbar_date-item {
            position: relative;
            color: #646566;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .select {
            color: #1989fa;
        }

        svg.time-ban {
            display: flex;
            z-index: 99
        }

    }

}

.popup-attribute-select {
    h5 {
        display: block;
        font-size: 0.83em;
        font-weight: bold;
    }

    .attribute-head {

        .price {
            font-weight: 400;
            font-size: 14px;
            margin-right: 10px;
            color: rgb(238, 10, 36);
            margin-top: 5px;
        }



    }

    .attribute-list {



        .value {
            display: inline-block;
            padding: 5px 20px;
            border-radius: 5px;
            border: 1px solid red;
            margin-right: 10px;
            margin-bottom: 10px;
            background: #fff;
            border: 1px solid #dcdfe6;
            color: #606266;


            &.select {
                color: #409eff;
                background: #ecf5ff;
                border-color: #b3d8ff;

            }

            &.disable {
                color: #c0c4cc;
                background-color: rgb(243, 243, 247);
            }
        }

    }

}
</style>


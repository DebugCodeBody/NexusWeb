<template>
    <div class="w-full h-full flex flex-col overflow-hidden ">
        <div class="w-full flex-1 overflow-auto p-10px pb-0" :class="{
            'date-end': dayDisabled,
        }">
            <template v-if="!loadError">

                <template v-if="foodDataType.length">
                    <dishes-type v-for="foodType in foodDataType" :key="foodType.name" :class="{
                        'food-odd-block': foodType.data.length % 2 == 1
                    }" :food-list="foodType.data" @click="onClickFoodItem" />
                </template>
                <van-empty v-else-if="!loadList" description="当天未排餐" />

            </template>

            <van-empty image="network" description="获取数据失败，请重试" v-else>
                <van-button type="primary" @click="getDataList(time.getActiveWeekDateYMD)">刷新</van-button>
            </van-empty>

        </div>

        <div class="h-105px w-full navbar flex flex-col">

            <meal-time :time-list="MealTimeArr" :utip-time="utipTime" :select="time.selectMealTime"
                @click="onClickMealTime" />

            <div class="flex-1 flex justify-between navbar_date">

                <div class="flex-1 text-center navbar_date-item" v-if="!time.isNow" @click="onClickSetSelectWeek(true)">
                    <van-badge :dot="utip.now">
                        <div class="flex flex-col content-center text-12px">
                            <span>上周</span>
                        </div>
                    </van-badge>
                </div>
                
                <template v-for="dateItem in time.getActivaWeekTime" :key="dateItem.YMD">
                    <div class="flex-1 text-center navbar_date-item" v-if="dateItem.show"
                        @click="time.setSelectTime(dateItem)" :class="{
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


                </template>

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
import dishesType from "@/components/dishesType/index.vue"
import mealTime from "@/components/mealTime/index.vue"




import timeStop from "@/components/stop.vue"


import { getDateFood, getUtip, getSundayShow } from "@/api"
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

    let retVal = [...utip[time.getActiveWeekDay.YMD]];
    if (!retVal || time.getActiveWeekDay.disabled) {
        retVal = [0, 0, 0, 0];
    }

    retVal.push(0);
    retVal.push(cart.dot);


    return retVal
})


const MealTimeArr = $computed(() => {

    const retVal = [...time.MealTimeArr];

    retVal.push({
        key: "已点",
        dot: false,
        value: "details" as any
    });
    retVal.push({
        key: "提交",
        dot: false,
        value: "orderCart" as any
    });

    return retVal;

})



function getUtipYMD(week: Time) {
    return !week.disabled && (utip[week.YMD] || [0, 0, 0, 0]).some((elem: number) => elem == 1)
}

/** 选中某个菜品 */
function onClickFoodItem(value: any) {
    if (!dayDisabled) {
        foodList.setSelect(value);
    }
}

/** 选中某个时间段或者其他 */
function onClickMealTime(value: any) {

    const findItem = MealTimeArr.slice(-2).find((elem) => elem.value == value)
    if (findItem) {
        view.toView(value)
    } else {
        time.setMealTime(value)
    }


}

/**
 * 切换周
 * @param value 是否选中当前周
 */
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


    if (!time.order.getSundayShow) {

        const val = await getSundayShow(time.isNow);
        time.setSundayShow(val);

    }


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


        /** 添加历史记录 */
        cart.setHistory(time.getActiveWeekDay, foodList.date[value], response.shop);

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
    for (const [key, value] of Object.entries(Object.assign({}, utip.nowWeek, utip.nextWeek))) {

        if (allTime[key] && allTime[key].disabled) {
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


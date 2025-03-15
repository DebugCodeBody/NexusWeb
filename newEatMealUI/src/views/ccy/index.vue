<template>
    <div id="ccy-view" class="w-full h-full flex flex-col overflow-hidden ">

        <div class="w-full flex-1 overflow-auto p-10px pb-0">

            <template v-if="!loadError">

                <template v-if="foodDataType.length">
                    <dishes-type v-for="foodType in foodDataType" :key="foodType.name" :class="{
                        'food-odd-block': foodType.data.length % 2 == 1
                    }" :food-list="foodType.data" @click="onClickFoodItem" />
                </template>
                <van-empty v-else-if="!loadList" description="当天未排餐" />

            </template>

            <van-empty image="network" description="获取数据失败，请重试" v-else>
                <van-button type="primary" @click="init">刷新</van-button>
            </van-empty>

        </div>

        <div class="flex p-10px done-date-tag">

            <van-tag plain type="primary"  class="" v-for="(item, index) in dateDataArr" :key="index">
                <div class="flex-1 flex flex-col text-12px text-center " >
                    <div class="mb-2px">{{ item.week }}</div>
                    <div class="mb-2px">{{ item.value }}</div>
                    <div class="flex">
                        <span class="noon" :class="item.noon + '-status'">中餐</span>
                        <span class="w-2px"></span>
                        <span class="night" :class="item.night+ '-status'">晚餐</span>
                    </div>
                </div>
            </van-tag>

        </div>
        
        <div class="h-105px w-full navbar flex flex-col h-54px">
            <meal-time :time-list="MealTimeArr" :utip-time="utipTime" :select="time.selectMealTime" @click="onClickMealTime"  />
        </div>
        <div v-show="false">{{ doneDate.length }}</div>

        <property-selector :date-list="allDate" v-if="allDate.length"/>
    </div>
</template>

<script setup lang="ts">

import { debounce } from "@/utils/other"

import propertySelector from "./propertySelector.vue"
import dishesType from "@/components/dishesType/index.vue"


import { timeStore, viewStore, cartStore, foodListStore, utipStore } from "@/store"

import { getCcyData } from "@/store/foodList"


import { getShowName, getDefautlDayArray } from "@/utils/other"

import dayjs from "dayjs"

import mealTime from "@/components/mealTime/index.vue"




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


const foodDataType = $ref<any[]>([]);
const allDate = $ref<any[]>([]);

const dateDataArr = $ref<{
    value: string,
    week: string,
    noon: boolean,
    night: boolean
}[]>([]);


// cart.$subscribe(debounce((event, data) => {

//     if (!data.stopStorage && !stopStorage) {
//         cart.saveStorage();
//     } else if (subscribeEditStop) {
//         stopStorage = false;
//         subscribeEditStop = false;
//     }

// }))


const MealTimeArr = $computed(() => {

    const retVal = [] as any[];

    retVal.push({
        key: "返回主页",
        dot: false,
        event(){

            location.reload();

        }
    });

    retVal.push({
        key: "提交",
        dot: false,
        value: "orderCart" as any
    });
    

    return retVal;

})

/** 某一天中四个时间段的红点显示，默认不显示 */
const utipTime = $computed(() => {

    let retVal = [] as any[];
    

    retVal.push(0);
    retVal.push(cart.dot);

    return retVal
})

const doneDate = $computed(() => {


    const promptArr = [] as any[];

    try{

        const testArr = {} as any;

        [...cart.data.entries()].forEach(([dayTime, carItem]) => {


            carItem.forEach((foodItem, index) => {

                /** 早餐不需要判断 */
                if (index == MealTime.breakfast) {
                    return;
                }

                if (foodItem.length == 0) {
                    return;
                }

                const typeObj: {
                    [key: string]: number
                } = {};

                foodItem.forEach((elem) => {
                    typeObj[elem.food.type] = typeObj[elem.food.type] || 0;
                    typeObj[elem.food.type] += 1;
                });


                ["主食", "菜"].filter((elem) => typeObj[elem]).forEach((elem) => {


                    const tempArr = testArr[dayTime.MD] = testArr[dayTime.MD] || []


                    tempArr[index] = tempArr[index] || [] 


                    tempArr[index].push(elem)




                })

            })



        })

        Object.keys(testArr).forEach((keyItem)=>{

            const dateItem = dateDataArr.find((dateItem) => dateItem.value == keyItem)!;

            dateItem.noon = (testArr[keyItem][1] || []).length == 2
            dateItem.night = (testArr[keyItem][2] || []).length == 2

        })


    }catch(error:any){

        console.log(error)

    }

    return promptArr
    
})


/** 选中某个菜品 */
function onClickFoodItem(value: any) {


    allDate.length = 0;

    allDate.push(...value.date);

    
    setTimeout(() => {
        foodList.setSelect(value);

    })

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


/** 选中某个时间段或者其他 */
function onClickMealTime(value: any) {


    view.toView(value)

}


async function init() {

    
    const [ { data, date, next }, shopResult] = await getCcyData() as any[]


    time.setSelectWeek(!next);



    date.map((value:string) => {

        const timeDay = dayjs(value);


        dateDataArr.push({
            value: timeDay.format('MM.DD'),
            week: timeDay.format('ddd'),
            noon: false,
            night: false,

        })

    })


    const foodArr = data.map((item: any) => {

        item.data = item.data.map((meetItem: any) => generateReFood(meetItem));

        return item;

    })

    foodDataType.push(...foodArr);
    
    {

        shopResult.forEach((shopItem:any) => {

            /** 添加历史记录 */
            cart.ccySetHistory(time.getOrderTime(shopItem.date), data, shopItem.data);

        })

    }





}



init()







</script>

<script lang="ts">
export default {
    title: "餐餐有点餐",
    name: "ccy"
}
</script>

<style lang="scss">


#ccy-view{

    
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


    .done-date-tag{

        .van-tag {
            
            padding: 2px;


            margin-right: 5px;

        }
    }

    .navbar_time .time-item {
        width: 25%;
        display: flex;
    
        justify-content: center;
        text-align: center;
    }

    .noon,
    .night{
        color: var(--van-tag-primary-color);
    } 
    .noon.false-status,
    .night.false-status{
        color: red
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

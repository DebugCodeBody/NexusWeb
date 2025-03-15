<template>
    <div class="auto-content wh-full ">
        <div class="wh-full flex flex-col overflow-hidden">
            <div class="flex-1 p-10px overflow-auto">
                <template v-if="foodDataType.length">

                    <div class="pb-10px" v-if="showCasual">
                        <van-checkbox v-model="casualChecked">当前所选中全没有上架，选中当天任意一款提交</van-checkbox>
                    </div>

                    <template v-for="foodType in foodDataType" :key="foodType.name">

                        <dishes-type :name="foodType.name" v-if="showType.includes(foodType.name)" :class="{
                            'food-odd-block': foodType.data.length % 2 == 1
                        }" :food-list="foodType.data" @click="onClickFoodItem" />

                    </template>

                </template>
                <van-empty v-else description="你最近没有点过餐，请先点餐后再使用自动点餐" />

            </div>
            <div class="navbar">
                <meal-time :time-list="MealTimeArr" :utip-time="utipTime" :select="time.selectMealTime"
                    @click="onClickMeal" />
            </div>
        </div>

        <property-selector />


    </div>
</template>

<script setup lang="ts">

import dishesType from "@/components/dishesType/index.vue"
import mealTime from "@/components/mealTime/index.vue"

import auto from "@/store/auto"
import { timeStore, viewStore } from "@/store"
import foodListStore from "@/store/autoFoodList";

import propertySelector from "./propertySelector.vue"


import { getShowName, getDefautlDayArray } from "@/utils/other"
import { getList } from "@/api/auto"
import cartStore from "@/store/autoCart"



const view = viewStore();
const autoStore = auto();
const foodList = foodListStore();
const time = timeStore();
const cart = cartStore();


let nowIndex = $ref(0);
const allType = $ref<string[]>([]);
let showType = $ref<string[]>([]);

/** 是否显示任意选中 */
let showCasual = $ref(false);
/** 是否随便选中一款 */
let casualChecked = $ref(false);


const MealTimeArr = $computed(() => {

    const retVal = [];


    retVal.push({
        key: "返回",
        dot: false,
        value: "return" as any
    });

    retVal.push({
        key: "上一步",
        dot: false,
        disabled: nowIndex == 0,
        value: "lastStep" as any,
        event: onLastType

    });

    if (allType.length - 1 > nowIndex) {

        retVal.push({
            key: "下一步",
            dot: false,
            value: "nextStep" as any,
            event: onNextType
        });

    } else {

        retVal.push({
            key: "提交",
            dot: false,
            value: "orderCart" as any
        });

    }


    return retVal;

})

const utipTime = $ref([0, 0, 0, 0, 0]);




/**
* 生成一个ref的菜单
*/
function generateReFood(food: any) {


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


const foodDataType = $ref<any>([]);




function onClickFoodItem(item: any) {
    foodList.setSelect(item);
}

function onClickMeal(item: any) {


    if (item == "return") {
        view.toView("main");

    } else {
        view.toView("autoCart");
    }


}



function dialogConfirm() {
    autoStore.casual[showType[0]] = true;

    onClickStep(1);

}

function dialogCancel() {
    autoStore.casual[showType[0]] = false;

    onClickStep(1);

}


function onLastType() {
    onClickStep(-1);
}

function onNextType() {
    onClickStep(1);

}


function onClickStep(step: number) {

    autoStore.casual[showType[0]] = casualChecked;

    nowIndex += step;


    let nextType = allType[nowIndex];

    showType.splice(0, showType.length, nextType);

    showCasual = ["菜", "汤"].some((item) => showType.includes(item));

    casualChecked = autoStore.casual[showType[0]];




}




async function init() {

    const data = await getList();

    const dataType = data.list.map((elem) => {

        for (let index = 0; index < elem.data.length; index++) {

            const element = elem.data[index];
            elem.data[index] = generateReFood(element);
        }

        return elem;

    });

    const typeArr = dataType.map((elem) => elem.name);



    showType.push(typeArr[0])


    allType.push(...typeArr);


    foodDataType.push(...dataType);

    /** 添加历史记录 */
    cart.setHistory(time.getActiveWeekDay, [[], data.list] as any, [[], data.shop] as any);












}

init();



</script>

<script lang="ts">

export default {
    name: "eatmeal",
    title: "自动点餐"
}
</script>

<style lang="scss">
.auto-content {

    .time-item {
        width: 50%;
    }

}
</style>

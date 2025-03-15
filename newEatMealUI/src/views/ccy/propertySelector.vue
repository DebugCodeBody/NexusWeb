<template>
    <van-popup v-model:show="foodList.propertySelector" round position="bottom" class=" p-10px pt-20px "
        @open="onPopupOpen" @closed="onPopupClose">
        <div class="flex flex-col popup-attribute-select" ref="popupSelect">

            <template v-if="!showCart">
                <div class="attribute-head">
                    <h5><span>{{ selectFood.selectAttri }}</span></h5>
                    <span class="price"><span class="text-12px">¥</span>{{ selectFood.selectPrice }}</span>
                </div>

                <div class="flex justify-between mt-10px">
                    <h5>数量</h5>
                    <food-step v-model="foodNum" :data="selectFood" :disabled="true" @numChange="onNumChange" :min="1"></food-step>
                </div>

                <!-- 口味属性 -->
                <div class="mt-10px attribute-list ">

                    <div class="attribute-item mb-15px" v-for="item in selectFood.specFoods" :key="item.name">
                        <h5>{{ item.name }}</h5>
                        <div class="mt-10px">
                            <span class="value" :class="{
                                select: tableItem.selected,
                                disabled: tableItem.disabled
                            }" @click="onSelectAttr(item, tableItem)" v-for="tableItem in item.details"
                                :key="tableItem.name">{{ tableItem.name }}</span>
                        </div>
                    </div>


                    <div class="attribute-item mb-15px" v-for="item in selectFood.attributes" :key="item.name">
                        <h5>{{ item.name }}</h5>
                        <div class="mt-10px">
                            <span class="value" :class="{
                                select: tableItem.selected,
                                disabled: tableItem.disabled
                            }" @click="onSelectAttr(item, tableItem)" v-for="tableItem in item.details"
                                :key="tableItem.name">{{ tableItem.name }}</span>
                        </div>
                    </div>
                </div>

                <!-- 日期 -->
                <div class="mt-10px">
                    <div class="attribute-item mb-15px" v-for="(item,index ) in showDateList" :key="item.date">
                        <h5>{{ item.date }} {{ item.week }}</h5>
                        <div class="mt-10px flex date-time-checkbox-select">
                            <van-checkbox :name="1" v-model="dayTimeSelect[index].time[0].select" v-if="dayTimeSelect[index].time[0].disabled">中餐</van-checkbox>
                            <van-checkbox :name="2" v-model="dayTimeSelect[index].time[1].select" v-if="dayTimeSelect[index].time[1].disabled">晚餐</van-checkbox>
                            <van-checkbox :name="3" v-model="dayTimeSelect[index].time[2].select" v-if="dayTimeSelect[index].time[2].disabled">夜宵</van-checkbox>

                        </div>
                    </div>
                </div>

           
            </template>

            <div class="flex-1" v-else>
                <item-collapse :data-list="dataList" :show-time="false">
                    <template #default="{ mdTime, item }">
                        <foot-list :mdTime="mdTime" :item="item" />
                    </template>
                </item-collapse>
            </div>

            <div class="flex">
                <template v-if="!showCart">
                    <div class="flex-1" v-if="showCartButton">
                        <van-badge :content="barNum" class="w-full" :show-zero="false">
                            <van-button icon="cart-o" type="primary" round block @click="onClickShowCart"></van-button>
                        </van-badge>
                    </div>
                    <div class="w-20px" v-if="showCartButton"></div>
                    <div class="flex-1">
                        <van-button type="primary" round block @click="onAddCart">加入购物车</van-button>
                    </div>
                </template>
                <van-button type="primary" round block @click="onHideenPup" v-else>确定</van-button>
            </div>

        </div>
    </van-popup>
</template>

<script setup lang="ts">

import cartStore from "@/store/cart";
import timeStore from "@/store/time"
import foodListStore from "@/store/foodList";

import foodListItem from "@/views/components/foodListItem.vue"
import foodStep from "@/views/components/foodStep.vue";
import collapseItem from "@/views/components/collapseItem.vue"

import itemCollapse from "@/views/components/itemCollapse.vue"
import footList from "@/views/components/footList.vue"

import { addNumReminder, getSelectAttributeObject, getDefautlDayArray } from "@/utils/other"

import dayjs from "dayjs"


const Props = defineProps<{
    dateList: {
        value: string,
        status: boolean[]
    }[]
}>();



const popupSelect = $ref<HTMLDivElement>();
const cart = cartStore();
const time = timeStore();
const foodList = foodListStore();

let isAdd = false;
let barAttributes: attribute[];
let barSpecFoods: SpecFood[];
let barNum = $ref(0)

let foodNum = $ref(1)
let selectFood = $ref<reFood>({} as any);

let showCart = $ref(false);

let dayTimeSelect = $ref<{
    date: string,
    time: {
        select: boolean,
        disabled: boolean
    }[]
}[]>([]);


const showDateList = $computed(() => {
    
    return Props.dateList.map(({ value }) => {

        const timeDay = dayjs(value)

        return {
            date: timeDay.format("MM-DD"),
            week: timeDay.format('ddd')
        }

    })

})


const dataList = $computed(() => {

    const retVal = getDefautlDayArray() as any;


    retVal[time.selectMealTime] = [];

    const selectCart = cart.data.get(time.getActiveWeekDay);
    if (selectCart) {
        selectCart[time.selectMealTime].forEach((elem) => {
            if (elem.food == selectFood) {
                retVal[time.selectMealTime].push(elem)
            }
        })
    } else {
        foodList.setSelectProperty(false);
    }

    return [[time.getActiveWeekDay, retVal]] as Array<[Time, dateFoodCard]>

})

watch($$(dataList), (value) => {
    try {
        if (showCart && value[0][1][time.selectMealTime].length == 0) {
            onHideenPup()
        }
    } catch {
        return;
    }
})



const showCartButton = computed(() => {

    return false;
    // return barNum > 0;
})

let height = 0;

/** 选中属性 */
function onSelectAttr(food: attribute, detail: AttributeDetail) {
    if (detail.disabled) {
        return;
    }
    const lastSelect = food.details.find((elem) => elem.selected)
    if (lastSelect) {
        lastSelect.selected = false;
    }

    detail.selected = true;
}


async function onAddCart() {


    // if (selectFood.cartNum > 0 && foodNum == 1) {
    //     try {
    //         await addNumReminder()
    //     } catch {
    //         return;
    //     }
    // }

    isAdd = true;
    selectFood.showPrice = selectFood.selectPrice;
    selectFood.showName = selectFood.selectAttri;

    /** 取出选中口味属性 */
    const attributes: attribute[] = getSelectAttributeObject(selectFood.attributes);

    /** 取出选中的影响价格属性 */
    const specFoods: SpecFood[] = getSelectAttributeObject(selectFood.specFoods) as SpecFood[];


    dayTimeSelect.forEach(({ date, time: dateTime }) => {


        dateTime.forEach(({ select }, index) => {

            if(!select){
                return;
            }
            
            
            const selectTime = time.order.time.find((elemTime) => elemTime.YMD === date)!;

            cart.addDateFoot(selectTime, index + 1, selectFood, attributes, specFoods, foodNum, {
                oneOff: true
            });

        })

    })



    


    onHideenPup();

}

function onNumChange(value: number) {
    foodNum += value;
}

function onHideenPup() {
    foodList.setSelectProperty(false);
}

function onClickShowCart() {
    showCart = true;
    popupSelect.style.height = `${height}px`
}

function barAttriJson() {

    function barJson(a: any[]) {
        return a.map((elem) => {
            const retVal = JSON.parse(JSON.stringify(elem)) as typeof elem;
            return retVal
        })
    }

    barAttributes = barJson(selectFood.attributes);
    barSpecFoods = barJson(selectFood.specFoods);

}


function onPopupClose() {
    foodNum = 1;

    if (!isAdd) {

        /** 
         * 如果当前没有确定加购过属性
         * 在属性选择器下去的时候需要把选中的属性给还原
         * 
         */
        function resetSelect(a: attribute[], b: attribute[]) {
            a.forEach((elem, index) => {
                b[index].details.forEach((item, index) => {
                    elem.details[index].selected = item.selected
                })
            })
        }

        resetSelect(selectFood.attributes, barAttributes)
        resetSelect(selectFood.specFoods, barSpecFoods)

    }


    isAdd = false;
    showCart = false;

    popupSelect.style.height = `auto`



}


function onPopupOpen() {

    

    barNum = selectFood.cartNum;
    barAttriJson();



    dayTimeSelect.length = 0;

    Props.dateList.forEach(({ value, status }) => {

        


        dayTimeSelect.push({
            date: value,
            time: status.map((item) => {

                return {
                    select: false,
                    disabled: item
                }
            })
            
        })

        



    })




    // setTimeout(() => {
    //     height = popupSelect.clientHeight
    // })

}


function getCartCcy() {






}



watch(() => foodList.select, (value) => {
    selectFood = value;

    if(selectFood){
        getCartCcy()
    }

});



</script>

<script lang="ts">
export default {
    name: "property-Selector"
}
</script>

<style lang="scss">
.popup-attribute-select {
    .select-week-date {
        width: 16.66%;
    }

    .attribute-item {
        span.value.disabled {
            color: #c0c4cc;
            background-color: #f3f3f7;
        }
    }

    .van-hairline--top-bottom:after,
    .van-hairline-unset--top-bottom:after {
        display: none;
    }

    .van-collapse-item__content {
        padding: 0;
    }

    .date-time-checkbox-select{
        .van-checkbox{
            margin-right: 10px;
        }
    }
}
</style>

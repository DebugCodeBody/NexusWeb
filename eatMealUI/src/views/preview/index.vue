<template>
    <div id="meal">
        <div class="board-view">
            <transition-group>
                <template v-for="[date, value] in Object.entries(food.data)" :key="date">
                    <food-list :date="date" :item="value" v-show="time.activeDateStr == date" :datestr="date">
                    </food-list>
                </template>
            </transition-group>
        </div>
        <div class="board-bottom-view">
            <div class="type-checked">
                <div class="item" v-for="(name, index) in time.time" :key="index" :class="{ 'day-end': dayEnd }">
                    <van-badge :dot="showDot(index)">
                        <van-button plain :type="timeType(index)" size="small" @click="onSelectTime(index)">{{ name }}
                        </van-button>
                        <stop-icon />
                    </van-badge>
                </div>
                <div class="item">
                    <van-badge :dot="false">
                        <van-button plain type="default" size="small" @click="onToShop">已点</van-button>
                    </van-badge>
                </div>
                <div class="item">
                    <van-badge :dot="dot.submit[0]">
                        <van-button plain type="default" size="small" @click="onToOrder">提交</van-button>
                    </van-badge>
                </div>
            </div>
            <Time></Time>
        </div>
        <sele-attr-popup v-model="select.seleAttr" v-if="select.seleAttr" :data="select.item" />
    </div>
</template>

<script setup lang="ts">
import Time from "./components/time.vue"
import foodList from "./components/foodList.vue"
import seleAttrPopup from "./components/seleAttrPopup.vue"
import stopIcon from "@/components/stop.vue"


import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, onActivated } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { dotStore } from "@/store/dot"
import { selectStore } from "@/store/select";
import { timeStore } from "@/store/time"
import { foodStore } from "@/store/food"
import { orderStore } from "@/store/order"
import { getUserName } from "@/store/user"


import { getDateFood } from "@/api"


const select = selectStore();
const order = orderStore();
const time = timeStore();
const food = foodStore();
const dot = dotStore();
const tempPostData = order.readPostData();

const dayEnd = computed(() => {
    return time.getDateEnd(time.activeDate.str);
})


watch(() => {
    return time.activeDateStr
}, (value) => {

    if (food.isEmpty(value)) {
        return;
    }

    getDateFood(time.activeDate.date).then(({ data, end, shop }) => {
        food.setFoods(value, data);
        time.setDateEnd(value, end);

        let last = dot.submit[0];

        if (!time.getDateEnd(time.activeDate.str)) {
            const doneItem = mergeOrderItems(time.activeDate.date, shop);
            if (doneItem) {
                shop.forEach((elem,index)=>{
                    if(!last){
                        last = elem.length != doneItem[index].length;
                    }

                    const temp = [...doneItem[index]];
                    elem.length = 0;
                    elem.push(...temp)
                })
            }
        }

        food.setOrder(value, shop);
        order.setAnchor(shop.length);


        dot.submit[0] = last;

    }).catch((error) => {
        console.log(error)
        food.setFoods(value, [[], [], [], []]);
    })

}, {
    immediate: true
})


function mergeOrderItems(date: string, remte: orderItems[]) {
    const temp = tempPostData[date] || {};
    const retVal: any = [];

    remte.forEach((elem, index) => {
        let tempData = temp[index + 1] 
        if(tempData){
            // 缓存有商品，就优先使用缓存
            // 缓存没有的话，再使用已经提交的

            const retData:any = [];
            
            /** 是否为缓存并集服务端数据 */
            let tempFor = true;
            // 缓存与提交的并集，这样才有效果
            const lengtSore = [tempData,elem];
            if(tempData.length < elem.length ){
                tempFor = false;
                [lengtSore[0],lengtSore[1]] = [lengtSore[1],lengtSore[0]];
            }

            lengtSore[0].forEach((item:any)=>{
                let elemIndex = lengtSore[1].findIndex((tempElem:any) => item.name == tempElem.name);

                if(elemIndex > -1){

                    let iscache = false;
                    const [spliceItem] = lengtSore[1].splice(elemIndex, 1);


                    // 如果服务端数据的打包和缓存的打包不一致
                    // 如果服务端数据的数量和缓存的数量不一致
                    // 那就把它设置成未提交的
                    if(tempFor && (spliceItem.pack != item.pack ||  (item.weight || item.qty != spliceItem.weight || spliceItem.qty))){
                        iscache = true
                    }

                    spliceItem.weight =  Math.max(item.weight || item.qty, spliceItem.weight || spliceItem.qty);
                    spliceItem.pack = spliceItem.pack || item.pack;
                    retData.push(spliceItem);

                    spliceItem.iscache = iscache;

                }else{
                    retData.push(item);
                    if(tempFor){
                        retData[retData.length - 1].iscache = true;
                    }   
                }


            })

            tempData = retData;

        } else {
            tempData = elem; 
        }
        retVal[index] = tempData;
    })

    return retVal

}




function onToShop() {
    window.toPath("shop");
}

function onToOrder() {
    window.toPath("order");
}

function onSelectTime(index: number) {
    time.setKeepTime(index);
}

function timeType(index: number) {
    return time.activeDateTime == index ? "primary" : "default"
}

function showDot(index: number) {
    const { date, str } = time.activeDate;

    if (!dot[date] || dot[date][index] == null || time.getDateEnd(str)) {
        return false
    }

    return !order[str] || !order[str].data[index] || order[str].data[index].length == 0

}


onMounted(() => {
    dot.init(time.nowWeek[0].date);
    dot.init(time.nextWeek[0].date);

})

</script>

<script lang="ts">
export default {
    name: "preview",
    title: "点餐"
}
</script>

<style lang="scss">
#meal {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;


    .board-view {
        flex: 1;

        display: flex;
        flex-direction: column;
        overflow: hidden;

    }

    .board-bottom-view {
        flex-shrink: 0;
    }


    .type-checked {

        font-size: 8px;

        display: flex;
        justify-content: space-between;

        padding: 10px;

        background-color: white;
        border-top: 1px solid rgb(240, 241, 242);

        .item {

            width: 20%;
            display: flex;

            justify-content: center;
            text-align: center;

            &:not(:last-child) {
                border-right: 1px solid rgb(240, 241, 242);
            }

            div.van-badge__wrapper {
                width: 80%;

                button {
                    width: 100%;
                }
            }


        }
    }


}

.day-end {
    svg.time-ban {
        display: flex;
    }
}
</style>


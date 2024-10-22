<template>
    <div class="w-full h-full " id="order-cart">
        <div class="h-full flex flex-col" :class="{
            'submit-done': submitDone
        }">

            <item-collapse :data-list="dataList" :submitDone="submitDone">

                <template #default="{ mdTime, item }">
                    <foot-list :mdTime="mdTime" :item="item" :submitDone="submitDone" />
                </template>

                <template #footer>
                    <van-action-bar class="px-10px">
                        <div class="mr-10px left" v-if="!submitDone && dataList.length ">
                            <van-checkbox v-model="allPack" shape="square">全部打包</van-checkbox>
                        </div>
                        <van-action-bar-button type="danger" text="返回" @click="view.toView('declare')" />

                        <van-action-bar-button type="primary" text="重新编辑" v-if="submitDone && dataList.length" @click="onClickResetEdit" />
                        <van-action-bar-button type="primary" text="提交" v-if="!submitDone " @click="onClickSubmit" />
                    </van-action-bar>
                </template>

            </item-collapse>

            <van-dialog v-model:show="promptShow" title="确认提交？" show-cancel-button class="dialog-view"
                @confirm="confirm" @cancel="cancel">
                <div class="dialog-list-view-warn">
                    <div class="warn" v-for="(item, index) in promptArr" :key="index">
                        <span class="date">{{ item.MD }}</span>
                        <span>{{ item.time }}</span>
                        <span>{{ item.type }}</span>
                        <span>没有点</span>
                    </div>
                </div>
            </van-dialog>

        </div>
    </div>
</template>

<script setup lang="ts">
import { viewStore, timeStore, cartStore } from "@/store";

import itemCollapse from "@/views/components/itemCollapse.vue"
import footList from "@/views/components/footList.vue"

import { dataSubmit } from "@/api"
import to from "await-to-js"
import { Dialog } from 'vant';




const view = viewStore();
const cart = cartStore();
const time = timeStore();

const allPack = $computed({
    get() {
        return cart.allPack;
    },
    set(value) {
        cart.setAllPack(value);
    }
});



let submitDone = $ref(false);
let promptShow = $ref(false);

const promptArr: {
    MD: string,
    time: string,
    type: string
}[] = [];



let dayArr: [Time, dateFoodCard][] = [];
const dataList = $computed(() => {

    /** 日期升序排序 */
    const arr = [...cart.data.keys()].sort((a, b) => {
        return a.day.diff(b.day, "day");
    }).filter((elem)=> !elem.disabled);

    return arr.map<[Time, dateFoodCard]>((key) => [key, cart.data.get(key)!])

})

function onClickSubmit() {

    promptArr.length = 0;
    dataList.forEach(([dayTime, carItem]) => {

        carItem.forEach((foodItem, index) => {
            /** 早餐不需要判断 */
            if (index == MealTime.breakfast) {
                return;
            }
            if(foodItem.length == 0){
                return;
            }

            const typeObj: {
                [key: string]: number
            } = {};

            foodItem.forEach((elem) => {
                typeObj[elem.food.type] = typeObj[elem.food.type] || 0;
                typeObj[elem.food.type] += 1;
            });


            ["主食", "菜"].filter((elem) => !typeObj[elem]).forEach((elem) => {

                promptArr.push({
                    MD: dayTime.MD,
                    time: time.MealTimeArr[index].key,
                    type: elem
                })

            })


        })

    })

    promptShow = true;

}

async function confirm() {

    const sendData: any = {};

    dayArr.forEach(([dayTime, dayFood]) => {

        const data: any = {};

        dayFood.forEach((foodList, index) => {
            if(foodList.length == 0){
                return
            }
            data[index + 1] = foodList.map((item) => {
                return {
                    name: item.name,
                    pack: item.pack,
                    qty: item.num
                }
            })

        })

        sendData[dayTime.YMD] = data;

    })



    cart.stopStorage = true;
    const [err] = await to(dataSubmit(sendData))
    if (err) {

        Dialog.alert({
            message: (err as any).msg || err.message || "提交失败，请重试！"
        })

    } else {

        Dialog.alert({
            message: "提交成功"
        });

        cart.clearStorage();
        cart.setAllSubmit(true);
        submitDone = true;


    }

}

function onClickResetEdit() {
    cart.stopStorage = false;
    submitDone = false;
}

function cancel() {


}


onMounted(() => {
    dayArr = dataList.map((elem) => elem)
})
onUnmounted(() => {
    onClickResetEdit();
})


</script>

<script lang="ts">
export default {
    title: "提交",
    name: "orderCart"
}
</script>

<style lang="scss">
#order-cart {

    .reminder-tab {
        transform: translateY(-50%);
        top: 50%;
    }


    .dialog-list-view-warn {
        font-size: 12px;
        padding: 0 20px;
        color: #ee0a24;
        text-align: center;
        margin: 10px 0;

        .warn {
            line-height: 20px;

            .date {
                margin-right: 2px;
                font-weight: bolder;

            }
        }
    }

    .submit-done {

        .van-stepper__minus,
        .van-stepper__plus,
        .van-checkbox__icon {
            display: none;
        }

        .van-checkbox__label {
            margin: 0;
        }
    }



}
</style>

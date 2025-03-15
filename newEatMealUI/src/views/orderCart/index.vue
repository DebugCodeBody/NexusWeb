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
                        <div class="mr-10px left" v-if="!submitDone && dataList.length">
                            <van-checkbox v-model="allPack" shape="square">全部打包</van-checkbox>
                        </div>
                        <van-action-bar-button type="danger" text="返回" @click="toReturnView" />

                        <van-action-bar-button type="primary" text="重新编辑" v-if="submitDone && dataList.length"
                            @click="onClickResetEdit" />
                        <van-action-bar-button type="primary" text="提交" v-if="!submitDone" @click="onClickSubmit" />
                    </van-action-bar>

                </template>

            </item-collapse>

            <van-dialog v-model:show="resultShow" class="dialog-view" @confirm="errorConfirm">

                <div class="dialog-list-view-warn">

                    <div class="mb-10px error-div" v-if="stopTime.length">
                        <div class="text-left" v-for="item in stopTime" :key="item.YMD">{{ item.YMD }}</div>
                        <div class="text-left ml-10px">
                            <div class="red">已停止点餐</div>
                        </div>
                    </div>

                    <template v-if="errArr.length">
                        <div class="error-div mb-10px" v-for="(item, index) in errArr" :key="index">
                            <div class="text-left">{{ item[0].MD }} {{ item[0].week }} </div>
                            <template v-for="(errTimeArr, errIndex) in item[1]">
                                <div class="text-left ml-10px" v-if="errTimeArr.length" :key="errIndex">
                                    <div>{{ time.MealTimeArr[errIndex].key }}</div>
                                    <div class="red" v-for="(str, strIndex) in errTimeArr" :key="strIndex">{{ str }}</div>
                                </div>
                            </template>
                        </div>
                    </template>

                </div>

            </van-dialog>

            <van-dialog v-model:show="promptShow" title="确认提交？" show-cancel-button class="dialog-view" @confirm="confirm"
                @cancel="cancel">
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

const submitDisabled = $computed(() => {

    return cart.flattenFood.every((elem) => elem.submit)

})


let submitDone = $ref(false);
let promptShow = $ref(false);
let resultShow = $ref(false);

const promptArr: {
    MD: string,
    time: string,
    type: string
}[] = [];


const stopTime = $ref<Time[]>([]);

const errArr: [Time, string[][]][] = $ref([]);
let dayArr: [Time, dateFoodCard][] = $ref([]);


const dataList = $computed(() => {

    /** 日期升序排序 */
    const arr = [...cart.data.keys()].sort((a, b) => {

        return a.day.diff(b.day, "day");

    }).filter((elem) => !elem.disabled);

    const result = arr.map<[Time, dateFoodCard]>((key) => [key, cart.data.get(key)!]);

    

    return result

})

function onClickSubmit() {


    /** 判断一下遗漏，比如点了菜没点主食，点了主食没点菜 */
    promptArr.length = 0;
    dataList.forEach(([dayTime, carItem]) => {

        

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
    const delData: any = cart.getDelData();

    errArr.length = 0;
    stopTime.length = 0;

    dayArr.forEach(([dayTime, dayFood]) => {

        const data: any = {};

        dayFood.forEach((foodList, index) => {
            if (foodList.length == 0) {
                return
            }

            index += 1;
            /** 只提交经过修改过的 */
            data[index] = [];
            foodList.forEach((item) => {

                if (!item.submit) {

                    data[index].push({
                        name: item.name,
                        pack: item.pack,
                        qty: item.num
                    })

                    const delYMD = delData[dayTime.YMD];
                    if (delYMD && delYMD[index]) {

                        const delIndex = delYMD[index].findIndex((delElem: string) => delElem === item.name);
                        if (delIndex > -1) {
                            delYMD[index].splice(delIndex, 1);
                            if (delYMD[index].length == 0) {
                                delete delYMD[index];
                            }

                            if (Object.keys(delYMD).length == 0) {
                                delete delData[dayTime.YMD];
                            }
                        }

                    }

                }

            });

        })

        sendData[dayTime.YMD] = data;

    });


    /** 
     * 当提交的删除，但是提交的数据里没有日志，服务端就会报错
     * 这个是在菜单列表里，把某一天的菜全部删除了然后再提交才会触发
     * 
     */

    const delKey = Object.keys(delData);
    const sendKey = Object.keys(sendData);
    if (delKey.length > sendKey.length) {
        delKey.forEach((key) => {
            if (!sendData[key]) {
                sendData[key] = {};
            }
        })
    }


    cart.stopStorage = true;
    const [err, result] = await to(dataSubmit({
        data: sendData,
        deldata: delData
    }))
    if (err) {

        Dialog.alert({
            message: (err as any).msg || err.message || "提交失败，请重试！"
        })

    } else {


        const errorArr = Object.keys(result.error);

        if (result.stop.length == 0 && errorArr.length == 0) {

            Dialog.alert({
                message: "提交成功"
            });

            cart.clearStorage();
            cart.setAllSubmit(true);
            cart.setAllNewAdd(false);
            submitDone = true;

        } else {

            const setAllSubmit = (arr: foodCard[]) => {
                arr.forEach((foodiTEM) => {
                    foodiTEM.submit = true;
                    foodiTEM.isNewAdd = false;
                })
            };

            result.stop.forEach((elem: string) => {
                stopTime.push(time.allTime[elem]);
            })


            dataList.forEach(([date, list]) => {

                if (errorArr.indexOf(date.YMD) > -1) {

                    const errStr: string[][] = [[], [], [], []];
                    const dateErr = result.error[date.YMD];


                    list.forEach((elem, index) => {

                        index += 1;

                        if (dateErr[index]) {

                            elem.forEach((foodiTEM) => {

                                const item = dateErr[index].find((errItem: any) => errItem.name === foodiTEM.name)
                                if (!item) {
                                    foodiTEM.submit = true;
                                    foodiTEM.isNewAdd = false;
                                } else {
                                    errStr[index - 1].push(item.msg as any);
                                }

                            })

                        } else {
                            setAllSubmit(elem);
                        }

                    })


                    errArr.push([date, errStr])

                } else {

                    list.forEach((elem) => {
                        setAllSubmit(elem);
                    })

                }

            })

            resultShow = true;

        }





    }

    cart.stopStorage = false;

    cart.clearDelData();
    cart.saveStorage();
    cart.clearStorage();

}


function errorConfirm() {

    if (stopTime.length > 0) {


        Dialog.alert({
            message: "是否删除已经停止点餐的菜单？",
            showCancelButton: true
        }).then(() => {

            stopTime.forEach((elem) => {

                cart.data.delete(elem);
                const index = dayArr.findIndex(([date]) => date === elem);
                dayArr.splice(index, 1);

            })

        })

    }


}


function onClickResetEdit() {
    cart.stopStorage = false;
    submitDone = false;
}

function cancel() {


}


function toReturnView() {

    view.toLast()

}



onMounted(() => {
    dayArr.push(...dataList.map((elem) => elem));
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


    .error-div {
        color: black;
        font-size: 14px;
    }

    .red {
        color: red;
    }

    .van-action-bar .van-button--danger {
        border-top-left-radius: 999px !important;
        border-bottom-left-radius: 999px !important;
    }


}
</style>

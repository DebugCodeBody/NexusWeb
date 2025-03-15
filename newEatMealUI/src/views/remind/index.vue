<template>
    <div class="wh-full pt-10px remind ">
        <van-radio-group v-model="radio">

            <van-cell-group inset @click="onGroupClick">
                <van-cell title="默认提醒" clickable @click="radio = '1'">
                    <template #right-icon>
                        <van-radio name="1" />
                    </template>
                </van-cell>
                <van-cell title="永不提醒" clickable @click="radio = '2'">
                    <template #right-icon>
                        <van-radio name="2" />
                    </template>
                </van-cell>
                <van-cell title="指定日期不提醒" clickable @click="radio = '3'">
                    <template #right-icon>
                        <van-radio name="3" />
                    </template>
                </van-cell>
                <van-cell title="本周不提醒" clickable @click="radio = '4'">
                    <template #right-icon>
                        <van-radio name="4" />
                    </template>
                </van-cell>
                <van-cell title="本月不提醒" clickable @click="radio = '5'">
                    <template #right-icon>
                        <van-radio name="5" />
                    </template>
                </van-cell>
                <van-cell>
                    <van-button type="primary" block round style="margin-top: 20px;" @click.stop="set"
                        :disabled="submitDisabled">提交
                    </van-button>
                    <van-button block round @click="view.toView('main')" style="margin-top: 10px;" >返回
                    </van-button>
                </van-cell>

            </van-cell-group>

            <van-cell-group inset style="margin-top: 20px;">
                <van-cell>
                    <span>如果在食堂<strong style="color:red; ">截止</strong>点菜之前，发现你没有进行点餐，将会通过<strong
                            style="color:red; ">电话</strong>询问你是否遗忘了点餐</span>
                </van-cell>
            </van-cell-group>


            <van-popup v-model:show="popupShow" position="bottom" :style="{ height: '50%' }" @close="cancelPopup">
                <div class="date-popup">
                    <van-checkbox-group v-model="selectDate">
                        <van-cell-group>
                            <van-cell v-for="(item, index) in list" clickable :key="item.week"
                                :title="`${item.date} ${item.week}`" @click="toggle(index)">
                                <template #right-icon>
                                    <van-checkbox :name="item.date" ref="checkboxes" />
                                </template>
                            </van-cell>
                        </van-cell-group>
                    </van-checkbox-group>
                    <van-row gutter="10">
                        <van-col span="12">
                            <van-button block round @click="popupShow = false">取消
                            </van-button>
                        </van-col>
                        <van-col span="12">
                            <van-button type="primary" block round :disabled="selectDate.length == 0"
                                @click="onClickDonePopup">确定
                            </van-button>
                        </van-col>
                    </van-row>
                </div>

            </van-popup>

        </van-radio-group>


    </div>
</template>

<script setup lang="ts">

import dayjs from "dayjs";

import { getNotice, setNotice } from "@/api/notice"
import { Toast } from 'vant';
import viewStore from "@/store/view";

const view = viewStore();


type dateType = {
    date: string,
    week: string
}
type dateTypes = dateType[]

let radio = $ref("1");
let submitDisabled = $ref(false);
let popupShow = $ref(false);
let selectDate = $ref<string[]>([]);
const list = $ref<dateTypes>([]);
const checkboxes = $ref<any[]>();

let responseTime: string[] = [];

let responseRadio = "";
let lastRadio = "";



watch($$(radio), (newVal, oldVal) => {

    lastRadio = oldVal;

})

function onGroupClick() {

    if (radio == "3") {
        popupShow = true;

        const time = dayjs().startOf('day');
        const weekEnd = dayjs().endOf("week");

        let diff = weekEnd.diff(time, "days");


        if (diff == 0) {
            time.add(1, "week");
            diff = 7;
        }

        list.length = 0;

        for (let i = 0; i < diff; i++) {
            const addTime = time.add(1, "days");

            list.push({
                date: addTime.format("YYYY-MM-DD"),
                week: addTime.format("dddd")
            })
        }


        if (responseTime.length > 0) {

            selectDate = list.map(elem => elem.date).filter((elem) => {
                return responseTime.includes(elem);
            });

            responseTime.length = 0;

        }

    }

}

async function set() {

    selectDate.map((elem) => {
        return dayjs(elem)
    }).sort();


    setNotice(radio, selectDate).then(() => {

        Toast.success('提交成功');
        responseRadio = radio;

    }).catch(() => {
        Toast.success('提交失败');
    })


}
function toggle(index: number) {

    checkboxes[index].toggle();

}
function cancelPopup() {
    if (lastRadio != undefined) {
        radio = lastRadio;
    }

}

function onClickDonePopup() {

    popupShow = false;

    if (list.length == selectDate.length) {
        nextTick(() => {
            radio = "4"
            selectDate = [];
        })
    }



}


async function init() {

    const data = await getNotice();


    if (data == null) {
        responseRadio = lastRadio = radio = "1";
    } else {
        responseRadio = lastRadio = radio = `${data.model}`;

        responseTime = data.time
    }


    const time = dayjs().startOf('day');

    time.startOf('day');

    let start;
    let end;

    if (radio == "3") {
        end = dayjs(data.time[data.time.length - 1]);
    } else if (["4", "5"].includes(radio)) {
        end = dayjs(data.time[1]);
    }
    if (end && end.diff(time, "days") <= 0) {
        radio = "1";
        responseTime = [];
    }



}

init();


</script>

<script lang="ts">
export default {
    title: "点餐提醒",
    name: ""
}
</script>

<style lang="scss">
.date-popup {
    display: flex;
    flex-direction: column;
    height: 100%;

    .van-checkbox-group {
        flex: 1;
    }

    .van-row {
        padding: 10px;
    }
}
</style>

<template>
    <div id="replenish" class="wh-full flex flex-col">
        <div class="mt-10px">


            <van-empty image="error" v-if="errorMessage">
                <van-tag type="danger">{{ errorMessage }}</van-tag>
            </van-empty>
            <van-form @submit="onSubmit" ref="formEl" v-else>
                <van-cell-group inset>

                <van-field name="checkboxGroup" label="日期">
                    <template #input>
                        <span>{{ formData.date }} {{ formData.week }}</span>
                    </template>
                </van-field>


                </van-cell-group>
                <time-form v-for="item in timeList" :key="item" :time="item" ref="timeFormEl" />
            </van-form>
            <div class="instructions ">
                <div class="line">
                    <div class="title"><strong>随机菜品的说明</strong></div>
                    <div class="value">除了以上米饭和辣椒的选项，其他菜品将会随机分配。我们会根据当前的菜品可用性，为您提供新鲜、美味的随机菜品组合。</div>
                </div>
                <div class="line">
                    <div class="title"><strong>当天补餐说明</strong></div>
                    <div class="value">
                        <div>当您进行当天的补餐时，请在取餐时使用扫码功能，补餐费用为<span class="red">8元</span>每餐。</div>
                        <div>请注意，补餐是独立核算的，这笔费用不会统计到您的月费中。</div>
                        <div>请放心，扫码付款不会导致额外费用的叠加。</div>
                    </div>
                    
                </div>
                <div class="line">
                    <div class="title"><strong>补餐时间截止说明</strong></div>
                    <div class="value">
                        <div>中餐的补餐截止时间为早上9点之前。</div>
                        <div>晚餐的补餐截止时间为下午2:30之前。</div>
                    </div>
                </div>
            </div>


        </div>
        <van-action-bar class="px-10px">
            <van-action-bar-button type="danger" text="返回" @click="view.toView('main')" />
            <van-action-bar-button type="primary" text="提交" @click="onSubmit" v-if="!done && !errorMessage" />
        </van-action-bar>
    </div>
</template>

<script setup lang="ts">

import { viewStore, cartStore, timeStore } from "@/store";

import { check, add } from "@/api/replenish"

import { Dialog } from 'vant';

import timeForm from "./timeForm.vue"

import to from "await-to-js"




const view = viewStore();



const timeList = $ref<string[]>([])


let done = $ref(false);
let errorMessage = $ref("");


const formEl = $ref<any>();
const timeFormEl = $ref<any[]>();

const formData = $ref({
    /** 日期 */
    date: "",
    /** 周几 */
    week: ""
})

async function onSubmit() {

    try {
        await formEl.validate()
    } catch {
        return
    }

    const data = timeFormEl.map((elem) => elem.getInfo());
    await add({
        date: formData.date,
        data
    })


    Dialog.alert({
        message: "提交成功"
    });


    done = true;






}



async function init() {


    const [err, result] = await to(check());
    if (err) {
        return
    }

    timeList.push(...result.time);

    /** 如果有下一餐可以点的话，就提示 */
    if (result.shopp) {
        errorMessage = `今日已点餐，暂不需要补餐操作`
    } else if (result.next) {
        errorMessage = `已经超过补餐时限，请返回点选下个工作日的餐`
    } else if (result.list == false) {
        errorMessage = `今日未开餐，不需要补餐操作`
    }

    formData.date = result.date;
    formData.week = result.week;

}


init();



</script>

<script lang="ts">
export default {
    name: "",
    title: "补餐"
}
</script>

<style lang="scss">
#replenish {
    .field-weight {

        .van-radio {
            margin-bottom: 10px;
        }

    }

    .van-cell-group {
        margin-bottom: 10px !important;
    }

    .instructions {

        padding: 0 16px;
        
        .title{
            margin-bottom: 5px;
            font-size: 14px;
        }

        .value {
            font-size: 12px
        }

        .line{
            margin-bottom: 10px
        }

        .red{
            color:red;
        }
    }
}
</style>

<template>
    <div id="meal-amount" class="h-full flex flex-col overflow-hidden ">

        <item-collapse :data-list="dataList" ref="collapse">
            <template #header>
                <div class="p-10px pl-5px bg-white">
                    <div class="flex">
                        <van-field v-model="fieldValue" is-link readonly label="查询月份" placeholder="选择月份"
                            @click="showPicker = true" />
                        <van-popup v-model:show="showPicker" round position="bottom">
                            <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
                        </van-popup>
                    </div>
                    <div class="flex justify-between">
                        <div>
                            总补贴：<van-tag plain type="danger">{{ total.allowance }}</van-tag>
                        </div>
                        <div>
                            总消费：<van-tag plain type="primary">{{ total.consume }}</van-tag>
                        </div>
                        <div>
                            总补扣：<van-tag plain>{{ total.amount }}</van-tag>
                        </div>
                    </div>


                </div>
            </template>

            <template #title="{ item }">
                <div class="flex justify-between">
                    <div>{{ item.MD }} {{ item.week }}</div>
                    <div class="mr-5px">
                        <span class="inline-block w-80px "><van-tag plain type="danger">补贴：{{
                            dateMap[item.MD].allowance }}</van-tag></span>
                        <span class="inline-block w-80px "><van-tag plain type="primary">消费：{{
                            dateMap[item.MD].consume }}</van-tag></span>
                        <span class="inline-block w-80px "><van-tag plain>补扣：{{ dateMap[item.MD].amount }}</van-tag></span>
                    </div>
                </div>
            </template>



            <template #default="{ item }">
                <collapse-item :data="item" :list-class="'details-list'" v-if="item.length">
                    <template #default="{ foodItem }">
                        <div class="flex justify-between">
                            <div class="name">{{ foodItem.name }}</div>
                            <div class="absolute right-1/3 reminder-tab" v-if="foodItem.pack.value">
                                <span><van-tag plain type="primary">打包 * {{ foodItem.pack.price }}</van-tag></span>
                            </div>
                            <div>
                                {{ foodItem.price }} * {{ foodItem.num }}
                            </div>
                        </div>
                    </template>
                </collapse-item>
                <div v-else>
                    <van-empty description="当天未点餐" />
                </div>


            </template>

            <template #empty>
                <van-empty description="本周暂未点餐"> </van-empty>
            </template>

            <template #footer>
                <van-action-bar class="px-10px">
                    <van-action-bar-button type="danger" text="返回" @click="view.toView('declare')" />
                </van-action-bar>
            </template>
        </item-collapse>

    </div>
</template>

<script setup lang="ts">
import itemCollapse from "@/views/components/itemCollapse.vue"
import collapseItem from "@/views/components/collapseItem.vue"

import { viewStore, cartStore, timeStore } from "@/store";
import { getMealAmount } from "@/api"


const view = viewStore();
const dataList = $ref<any[]>([]);

const dateMap: {
    [key: string]: any
} = {};

const total = $ref({
    allowance: "",
    amount: "",
    consume: "",
})

const columns: {
    text: string,
    value: string
}[] = [];

let fieldValue = $ref('');
let showPicker = $ref(false);
let selectMonth = 0;


{
    selectMonth = new Date().getMonth() + 1;

     
    fieldValue =  `${selectMonth}月`;
    for (let index = 0; index < selectMonth; index++) {

        const value = `${index + 1}月`;
        columns.push({
            text: value,
            value: `${index + 1}`
        })

    }

}




const onConfirm = (selectedOptions: any) => {

    showPicker = false;
    fieldValue = selectedOptions.text;
    selectMonth = selectedOptions.value;

    init();
};


async function init() {

    getMealAmount(selectMonth).then((data) => {


        Object.assign(total, data.total);

        const tempData = data.list.map((elem) => {



            const card = elem.list


            delete elem["list"];

            elem.MD = elem.work_date.slice(elem.work_date.indexOf("-") + 1);

            dateMap[elem.MD] = elem;

            return [elem, card]

        })
        

        dataList.length = 0;
        dataList.push(...tempData);


    });


}

init();





</script>

<script lang="ts">
export default {
    title: "点餐记录",
    name: "meal-amount"
}
</script>

<style lang="scss">
#meal-amount {

    .details-list .item {
        color: var(--van-checkbox-label-color);

    }

    .van-field {
        padding-left: 0;
        padding-right: 0;
    }

    .van-cell:after {
        border: 0;
    }
}
</style>

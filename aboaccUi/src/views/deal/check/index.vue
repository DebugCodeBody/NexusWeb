<template>
    <div class="wh-full  overflow-hidden ">

        <div class="wh-full flex flex-col overflow-hidden ">

            <div class="flex mb-10px">
                <div class="mr-10px">
                    <el-select v-model="selectVal" @change="onSelectChange">
                        <el-option v-for="(item) in option" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <div>
                    <el-select v-model="selectMonth" @change="onSelectChange">
                        <el-option v-for="item in monthArr" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>

            </div>
            <div class="flex-1">
                <Table :pagination="false"></Table>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

import to from "await-to-js"
import { getDeal } from "@/api"


import getSearch from "@/utils/urlSearch"

import Table from '@/components/testtable/index.vue'
import TableHeader from '@/components/testtable/header/index.vue'
import popDialog from "global@/popDialog/index.vue"
import { testBaTable, testBaTableBefore } from '@/components/testtable/utils/baTable'
import { tableApi } from "@/components/testtable/api/common"

import item from "./item.vue"

import selectItem  from "@/store/data"


type column = {
    /** 日期 */
    scandate: string,
    /** 总数量 */
    totalcount: number,
    /** 总金额 */
    sboctotprice: number,
    /** 发票 */
    ticket: number,
    /** 状态 */
    okstage: string

}

const option = $ref([
    {
        label: "全部",
        value: 0
    },
    {
        label: "钢精板",
        value: 1
    },
    {
        label: "铝精板",
        value: 2
    }
]);

const selectVal = $ref(parseInt(getSearch("type")) || 0);


const monthArr = $ref<{
    label: string,
    value: number
}[]>([]);



Array((new Date).getMonth() + 1).fill(1).forEach((elem, index) => {

    index += 1;
    monthArr.push({
        label: `${index}月份`,
        value: index
    });
});

const selectMonth = $ref(monthArr[monthArr.length - 1].value)



const before: Partial<testBaTableBefore<column>> = {

}

const Api = {

    async index(filter: any): Promise<any> {

        const [err, data] = await to(getDeal(selectMonth, selectVal));

        return {
            list: data,
            totalCount: 0
        }

    }

} as tableApi




const table = {
    pk: "index",
    column: [

        {
            label: "序号",
            type: "index",
            align: 'center',
            width: 80,
            prop: '',
        },
        {
            label: "日期",
            prop: 'scandate',
            align: 'center',
            width: 120
        },
        {
            label: "总数量",
            prop: 'totalcount',
            align: 'center',
            width: 120,
        },
        {
            label: "总金额",
            prop: 'sboctotprice',
            align: 'center',
            width: 200,
        },
        {
            label: "订单数",
            prop: 'ticket',
            align: 'center',
            width: 120

        },
        {
            label: "明细",
            align: "center",
            render: "customRender",
            customRender: shallowRef(item),
            width: 120
        },


    ],

    dblClickNotEditColumn: [undefined],
} as BaTable

const baTable = new testBaTable<column>(table, before, {}, Api);


provide('baTable', baTable);

function onSelectChange(value: string) {

    selectItem.deal.type = value as any;

    baTable.Refresh();
}


onSelectChange(`${selectVal}`);

</script>

<script lang="ts">
export default {
    name: "下单明细表"
}
</script>

<style lang="scss"></style>

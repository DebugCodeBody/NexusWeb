<template>
    <div class="wh-full  overflow-hidden ">

        <div class="wh-full flex flex-col overflow-hidden ">

            <div class="flex mb-10px">
                <div class="mr-10px">
                    <el-select v-model="selectVal" @change="onSelectChange" :disabled="true">
                        <el-option v-for="(item) in option" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <div>
                    <el-date-picker v-model="selectDate" type="date" placeholder="请选择日期" :disabled="true"/>
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
import { getDealDetail } from "@/api"


import getSearch from "@/utils/urlSearch"

import Table from '@/components/testtable/index.vue'
import { testBaTable, testBaTableBefore } from '@/components/testtable/utils/baTable'
import { tableApi } from "@/components/testtable/api/common"

import selectItem from "@/store/data"
import { useRouter } from "vue-router"



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

let selectVal = $ref(parseInt(getSearch("type")) || 0);



let selectDate = $ref("")



const before: Partial<testBaTableBefore<column>> = {

}

const Api = {

    async index(filter: any): Promise<any> {

        const { item, type } = selectItem.deal;

        const [err, data] = await to(getDealDetail(item.scandate, type));

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
            label: "单号",
            prop: 'ordid',
            align: 'center',
            width: 120
        },

        {
            label: "材料",
            prop: 'mat_name',
            align: 'center',
            width: 200,
        },

        {
            label: "材料规格",
            prop: 'spec1',
            align: 'center',
            width: 180,
        },

        {
            label: "件数",
            prop: 'count',
            align: 'center',
            width: 100,
        },
        {
            label: "报价名",
            prop: 'sbocsup',
            align: 'center',
            width: 150,
        },

        {
            label: "结算金额",
            prop: 'sboctot',
            align: 'center',
            width: 180
        },

        {
            label: "下单日期",
            prop: 'bdate',
            align: 'center',
            width: 180
        }


    ],
    dblClickNotEditColumn: [undefined],
} as BaTable

const baTable = new testBaTable<column>(table, before, {}, Api);


provide('baTable', baTable);

function onSelectChange() {
    baTable.Refresh();
}



onActivated(() => {

    const { item, type } = selectItem.deal;

    if (!item) {

        const router = useRouter();

        router.push({
            path: "/deal/check"
        });


    } else {


        selectDate = item.scandate;
        selectVal = type - 0;

        onSelectChange();
    }



})



</script>

<script lang="ts">
export default {
    name: "下单明细表"
}
</script>

<style lang="scss"></style>

<template>
    <div class="beian-view">
        <boxTable :boxTable="tableData" @rowClick="onRowClick" />
    </div>
</template>

<script setup lang="ts">



import boxTable from "global@/table/index.vue";
import { boxTableControl } from "global@/table/utils/boxTable"




import { getBeiliao } from "@/api"

import to from "await-to-js"

const order = inject<string>("order")!;

const tableData = new boxTableControl<any>({
    pk: "index",
    column: [
        {
            label: "序号",
            type: "index",
            align: 'center',
            width: 80,
        },
        {
            label: "订单类型",
            prop: 'ty',
            align: 'center',
            width: 90,

        },
        {
            label: "订单号",
            prop: 'ordid',
            align: 'center',
            width: 90

        },
        {
            label: "备料仓库",
            prop: 'cutstore_name',
            align: 'center',
            width: 100,
        },
        {
            label: "资材名称",
            prop: 'mat_name',
            align: 'center',
            width: 180,
        },
        {
            label: "需求规格",
            prop: 'spec',
            align: 'center',
            width: 130,
        },
        {
            label: "采购规格",
            prop: 'bspec',
            align: 'center',
            width: 130,
        },
        {
            label: "数量",
            prop: 'count',
            align: 'center',
            width: 80,
        },
        {
            label: "当前状态",
            prop: 'stage',
            align: 'center',
            width: 90,
        },
        {
            label: "材料来源",
            prop: 'matfrom',
            align: 'center',
            width: 100,
        },
        {
            label: "外发商",
            prop: 'osupname1',
            align: 'center',
            width: 100,
        },
        {
            label: "送货方式",
            prop: 'delimode',
            align: 'center',
            width: 100,
        },
        {
            label: "外发",
            prop: 'outsourcing1',
            align: 'center',
            width: 80,
        },
        {
            label: "精磨加工商",
            prop: 'sbocsup',
            align: 'center',
            width: 180,
        },
        {
            label: "送料车间",
            prop: 'fathousename1',
            align: 'center',
            width: 180,
        }
    ],
} as any,
    {

    },
    {

    },
    {
        async index() {

            const list = await getBeiliao(order);

            return {
                list,
                totalCount: list.length
            }

        }

    });


function onRowClick(event: MouseEvent, item: any) {

    window.onBeiliaoLog(item)



}



tableData.Refresh();



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.beian-view {
    width: 100%;
    height: 100%;
    overflow: hidden;


    .flex-1 {
        flex: 1;
    }

    .form-content {}


}
</style>

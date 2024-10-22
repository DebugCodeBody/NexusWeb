<template>
    <div class="table-view">
        <boxTable :boxTable="tableData" />
    </div>
</template>

<script setup lang="ts">

import boxTable from "H:/private/newTool/UI/src/components/boxTable/index.vue"
import { boxTableControl } from 'H:/private/newTool/UI/src/components/boxTable/utils/boxTable'

import data from "@/store/data"



const tableData = new boxTableControl<any>({
    pk: "index",
    column: [
        {
            label: "序号",
            type: "index",
            align: 'center',
            width: 70,
        },
        {
            label: "工单单号",
            prop: 'order',
            align: 'center',
            width: 100,

        },
        {
            label: "工艺",
            prop: 'process',
            align: 'center',
            width: 120

        },
        {
            label: "结果",
            prop: 'result',
            align: 'center',
        }
    ],
} as any,
    {

    },
    {

    },
    {
        async index() {

            const { list } = data;

            return {
                list,
                totalCount: list.length
            }

        }

    });




tableData.Refresh();



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.table-view {
    width: 100%;
    height: 100%;
    overflow: hidden;


    .flex-1 {
        flex: 1;
    }


}
</style>

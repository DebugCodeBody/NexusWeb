<template>
    <div class="wh-full">
        <box-table :boxTable="dataManage">
            <template #url="props" >
                <div>
                    <a :href="(props as any).renderValue" target="_blank">查看</a>
                </div>
            </template>
        </box-table>
    </div>
</template>

<script setup lang="ts">

import boxTable from "H:/private/newTool/UI/src/components/boxTable/index.vue";
import { boxTableControl } from "H:/private/newTool/UI/src/components/boxTable/utils/boxTable";



const boxTableEl = $ref<any>();

const Props = defineProps<{
    data: any[]
}>()

const dataManage = new boxTableControl({
    column: [
        {
            label: "序号",
            type: "index",
            width: 90,
            align: 'center',
        },
        {
            label: "订单号",
            prop: "saleno",
            align: 'center',
            width: 80
        },
        {
            label: "发票号",
            prop: "invno",
            align: 'center',
            width: 210
        },
        {
            label: "金额",
            prop: "amount",
            align: 'center',
            width: 90
        },
        {
            label: "开票日期",
            prop: "opendate",
            align: 'center',
            width: 130
        },
        {
            label: "发票网址",
            prop: "url",
            align: 'center',
            render: "url",
        },

    ]
}, {} as any, {} as any, {
    async index() {

        const list = Props.data;

        return {
            list,
            totalCount: 0
        }

    }
});

dataManage.Refresh();



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
a{
    color: -webkit-link !important;
}
</style>

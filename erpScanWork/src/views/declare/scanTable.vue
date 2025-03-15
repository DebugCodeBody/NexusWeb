<template>
    <div class="scan-table wh-full">
        <box-table :boxTable="tableControl">
            <template #state="props">
                <state-column  v-bind="(props as any)" />
            </template>
        </box-table>
    </div>
</template>

<script setup lang="ts">

import boxTable from "H:/private/newTool/UI/src/components/boxTable/index.vue"
import { boxTableControl }  from "H:/private/newTool/UI/src/components/boxTable/utils/boxTable"

import stateColumn from "./stateColumn.vue"

const Props = defineProps<{
    modelValue: any[]
}>();


const table = {
    column: [
        {
            label: "序号",
            type: "index",
            align: 'center',
            width: 55
        },
        {
            label: "条形码",
            prop: 'code',
            align: 'center',
            width: 80
        },
        {
            label: "工单号",
            prop: 'orderid',
            align: 'center',
            width: 90
        },
        {
            label: "扫描结果",
            prop: 'state',
            align: 'center',
            render: "customRender",
            customRender : stateColumn
        }
    ]

} as any;



const tableControl = new boxTableControl<any>(table, {}, {}, {
    async index(){

        return {
            list: Props.modelValue
        } as any
        

    }
});



tableControl.Refresh();



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

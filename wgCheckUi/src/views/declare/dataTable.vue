<template>
    <div class="wh-full">
        <box-table :boxTable="dataManage" ref="boxTableEl"/>
    </div>
</template>

<script setup lang="ts">


import { boxTableControl } from "H:/private/newTool/UI/src/components/boxTable/utils/boxTable";



const boxTableEl = $ref<any>();

const Props = defineProps<{
    data: any[]
}>()

const dataManage = new boxTableControl({
    column: [
        {
            label: "序号",
            prop: "index",
            width: 90,
            align: 'center',
        },
        {
            label: "工单号",
            prop: "orderid",
            align: 'center',
        },
        {
            label: "结果",
            prop: "qcrtmsg",
            align: 'center',
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

watch(() => Props.data.length, (value) => {

    boxTableEl.setCurrentRow(Props.data[0]);

})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

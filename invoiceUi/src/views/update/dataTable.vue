<template>
    <div class="wh-full">
        <box-table :box-table="tableManage" />
    </div>
</template>

<script setup lang="ts">


import boxTable from "global@/table/index.vue";
import { boxTableControl } from "global@/table/utils/boxTable"

import dataManage from "./dataManage" 


const tableManage = new boxTableControl<pdfItem>({
    column: [
        {
            label: "序号",
            type: "index",
            align: 'center',
            width: 80,
        },
        {
            label: "图纸名",
            align: 'center',
            prop: "name"
        },
        {
            label: "新图纸名",
            align: 'center',
            prop: "new_file",
        },

        {
            label: "操作",
            align: 'center',
            width: 80,
            render: 'buttons',
            buttons: ['edit'],
            operator: false,
        }
    ]
},
    {
        edit(item: pdfItem) {

            dataManage.setSelectItem(item);
            return false;
            
        }
    } as any,
    {} as any,
    {
        index() {

            

            const retVal = {
                list: dataManage.dataList,
                totalCount: 0
            };

            return Promise.resolve(retVal);

        }
    });



tableManage.Refresh();

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

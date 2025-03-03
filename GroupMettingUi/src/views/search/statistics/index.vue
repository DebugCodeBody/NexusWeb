<template>
    <div class="wh-full overflow-hidden statistics-table">
        <boxTable :box-table="tabManage" @sort-change="onSortChange" />
    </div>
</template>

<script setup lang="ts">

import boxTable from "global@/table/index.vue";

import { boxTableControl } from "global@/table/utils/boxTable"



import thisManage from "../manage";



const tabManage = new boxTableControl({
    column: [
        {
            label: "姓名",
            align: 'center',
            prop: "name"
        },
        {
            label: "创建次数",
            align: 'center',
            prop: "create",
            sortable: 'custom'
        },
        {
            label: "参与次数",
            align: 'center',
            prop: "actor",
            sortable: 'custom'
        }
    ],
    defaultOrder: {
        prop: "create",
        order: "desc"
    }
},
    {} as any,
    {} as any,
    {
        index() {

            const retVal = {
                list: thisManage.compute,
                totalCount: 0
            };

            return Promise.resolve(retVal);

        }
    });


function onSortChange() {

    thisManage.search();

}


thisManage.setTabManage(tabManage);
tabManage.Refresh();





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

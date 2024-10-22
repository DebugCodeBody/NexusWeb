<template>
    <popDialog 
        title="关联会议" 
        class="dialog-link" 
        custom-class="dialog-link" 
        v-model="dialog.visible" 
        :showCancelButton="false"
        @open="onOpenEd" 
        @confirm="onConfirm" >

        <el-scrollbar :height="scrollbarHeight">
            <collapse-list :data="dialog.data">
                <template #item="{ item }">
                    <meet-item :item="item" :type="0" :refresh="refresh" :isLink="true">
                    </meet-item>
                </template>
            </collapse-list>
        </el-scrollbar>

    </popDialog>
</template>

<script setup lang="ts">

import popDialog from "global@/popDialog/index.vue"
import collapseList from "@/components/collapseList.vue"
import meetItem from "@/components/meetItem.vue"


import { getLick } from "@/api"


const Props = defineProps<{
    refresh: any
}>();


let thisView:mettItem;

let scrollbarHeight = $ref(0);
const dialog = $ref({
    visible: false,
    data: [] as mettItems
});



async function refresh() {

    const dataList = await getLick(thisView.id);

    dialog.data.length = 0;
    dialog.data.push(...dataList);

    dialog.visible = true;
    
}

function onOpenEd(){

    nextTick(()=>{

        const dialogEl = document.querySelector<HTMLDivElement>(".dialog-link")!
        const body = dialogEl.querySelector<HTMLDivElement>(".el-dialog__body")!
        

        const { clientHeight} = dialogEl;

        scrollbarHeight = clientHeight  - 124 - 60;

    })

}


function onConfirm() {
    
    dialog.visible = false;

}

function linkView(item: mettItem) {

    thisView = item;
    refresh();


}




onMounted(() => {

    window.linkView = linkView;

})
</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.el-dialog.dialog-link {
    height: 90%;
    overflow: hidden;
    margin-top: 50px;
    width: 90% !important;
}
</style>

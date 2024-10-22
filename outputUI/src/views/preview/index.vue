<template>
    <div class="cell-content wh-full overflow-hidden">

        <div class="wh-full  overflow-hidden">

            <el-row :gutter="20">

                <template v-for="(item, index) in tableData" :key="index">


                    <el-col :span="8">
                        <el-scrollbar>
                            <div class="grid-content ep-bg-purple  overflow-auto">

                                <Draggable :data="item" :bind="item" itemkey="info" :resize="onDragResize"
                                    :move="onDragMove">

                                    <template #default="{ element }: { element: viewInfo }">
                                        <div class="w-full items" @click="onClickItem">
                                            <div class="content flex">
                                                <div class="image w-80px border">

                                                </div>
                                                <div class="right-content flex flex-col ml-5px flex-1">
                                                    <div class="info mb-10px">{{ element.info }}</div>
                                                    <div class="flex mb-10px">
                                                        <div class="group mr-5px">{{ element.group }}</div>
                                                        <div class="group">{{ element.group }}</div>
                                                    </div>
                                                    <div class="flex others">
                                                        <div class="user">{{ element.create_user }}</div>
                                                        <div class="time">{{ formTime(element.create_date) }}</div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>

                                    </template>

                                </Draggable>
                            </div>
                        </el-scrollbar>

                    </el-col>

                </template>



            </el-row>
        </div>

        <assign-dialog />


    </div>
</template>

<script setup lang="ts">
import Draggable, { Resize } from "global@/Draggable/index.vue"


import assignDialog from "./assignDialog.vue"

import storeData from "./storeData"

import { getView } from "@/api"
import dayjs from "dayjs"




const tableData = $ref<viewInfoList>([[], [], []]);


function onDragResize() {
    console.log("上下移动")
}

function onDragMove(resizeData: Resize<typeof tableData[0]>) {
    storeData.showAssign = true;



    const fromData = resizeData.fromData[resizeData.fromIndex];
    const toData = resizeData.toData[resizeData.toIndex];


    storeData.selectItem = fromData;



}


function onClickItem() {

}


function formTime(time: string) {

    return dayjs(time).format("MM-DD HH:mm");
}



async function init() {


    const result = await getView();


    tableData[0].push(...result)



}


init();



</script>

<script lang="ts">
export default {
    name: "",
    title: "采购看板"
}
</script>

<style lang="scss">
.cell-content {
    overflow: hidden;

    .el-col {
        width: 100%;
        height: 100%;
        overflow: hidden;

    }

    .el-row {
        margin: 0 !important;

        width: 100%;
        height: 100%;

        .grid-content {
            width: 100%;
            height: 100%;
        }
    }


    .items {

        border-radius: 5px;
        margin-bottom: 10px;
        font-size: 14px;
        cursor: pointer;


        .content {
            padding: 5px;
            background-color: white;

            .info {}

            .others {
                font-size: 12px;

                div:not(:last-child) {
                    margin-right: 5px
                }
            }
        }

    }



}
</style>

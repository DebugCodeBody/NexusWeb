<template>

    <div class="search wh-full">
        <div class="search-view flex flex-col">
            <form-el></form-el>
            <div class="flex justify-between">
                <div class="flex items-center">
                    <span>总计: {{ data.length }}</span>
                </div>
                <div class="button">
                    <el-button type="primary" @click="onClickSearch" :loading="thisManage.other.loading">搜索</el-button>
                    <el-button @click="onClickReset">重置</el-button>
                </div>
            </div>
            <div class="flex-1 mt-10px  rounded-5px overflow-hidden">
                <el-tabs type="border-card" class="h-full">
                    <el-tab-pane label="统计">
                        <div class="h-full">
                            <statistics></statistics>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="内容">
                        <data-list></data-list>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>

    <py-select-name :user-list="thisManage.actorUser" />

</template>

<script setup lang="ts">
import to from "await-to-js";

import pySelectName from "@/components/pySelectName.vue"

import formEl from "./form.vue"
import dataList from "./dataList.vue"
import statistics from "./statistics/index.vue"



import thisManage from "./manage";

const { formData, data } = thisManage;



function onClickSearch() {

    thisManage.search();

}


function onClickReset() {

    thisManage.reset();

}




async function init() {

    thisManage.init();

}

init();







</script>

<script lang="ts">

const title = $ref("会议搜索");
export default {
    name: "",
    title
}
</script>

<style lang="scss">
.search {
    .search-view {
        position: relative;
        height: 100%;

        max-width: 1200px;
        margin: auto;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        background-color: white;
        border-radius: 5px;
        padding: 10px;


    }

    .el-select {
        width: 100%;
    }

    .el-tabs{
        display: flex;
        flex-direction: column;
    }

    .el-tabs__content{
        flex: 1;
    }

    .collapse-list{
        border: 0;
    }

    .el-tab-pane{
        height: 100%;
    }

    
    .statistics-table{
        .line{
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid black;
        border-bottom: 0;

        &.title{
            font-weight: bolder;
        }

        &:last-child{
            border: 1px solid black;
        }

        .name,
        .create,
        .actor{
            flex: 1;
            text-align: center;
            height: 40px;
                display: flex;
            align-items: center;
            justify-content: center;
        }

        .left{
            border-right: 1px solid black;
        }
    }


    }



}
</style>

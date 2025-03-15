<template>
    <div id="list" class="wh-full overflow-auto">

        <tab-management v-model="activeTag" :tag-list="tagList" :dataList="dataList" :refresh="refreshData">

            <template #item="{ itemData }">
                <div class="p-10px">
                    <el-form label-width="auto">
                        <div class="flex w-full">
                            <el-form-item class="flex-1" label="申请人">
                                <span>{{ itemData.fname }}</span>
                            </el-form-item>
                            <el-form-item class="flex-1" label="申请时间">
                                <span>{{ itemData.create_time }}</span>
                            </el-form-item>
                        </div>

                        <el-form-item label="刀具类型">
                            <span>{{ itemData.ctype }}</span>
                        </el-form-item>
                        <el-form-item label="刀具名字">
                            <span>{{ itemData.cname }}</span>
                        </el-form-item>
                        <el-form-item label="审核结果" v-if="activeTag.id == 2">
                            <el-tag type="success" size="small" v-if="itemData.fstatus == 2">通过</el-tag>
                            <el-tag type="danger" size="small" v-else>拒绝</el-tag>
                        </el-form-item>
                    </el-form>
                    <div class="mt-10px pt-10px border-t flex justify-end" v-if="activeTag.id == 1">
                        <el-button type="warning" size="small" @click="onClickCancel(itemData)">拒绝</el-button>
                        <el-button type="success" size="small" @click="onClickConfirm(itemData)">通过</el-button>
                    </div>
                </div>
            </template>

        </tab-management>




    </div>
</template>

<script setup lang="ts">
import to from "await-to-js"

import tabManagement from "@/components/tabManagement/index.vue"
import { tagItem } from "@/components/tabManagement/type"
import { MessageBoxWarning } from "@/utils/elementLib"

import { getList, setApproved } from "@/api/audit"

import dayjs from "dayjs"

type dataTag = {
    event: (status: any) => Promise<any[]>,
    status: number
} & tagItem


const dataList = $ref<any[]>([])

const tagList = $ref<dataTag[]>([
    {
        id: 1,
        label: "待审核",
        event: getList,
        status: 1
    },
    {
        id: 2,
        label: "已审核",
        event: getList,
        status: 2

    }
]);
const activeTag = $ref(tagList[0]);


async function refreshData(item: dataTag) {


    const [error, data] = await to(item.event(item.status));

    if (!error) {




        dataList.length = 0;
        dataList.push(...data.map((elem)=>{
            elem.create_time = dayjs(elem.create_time).format("MM-DD HH:mm")
           
            return elem;

        }));

    }

    return !error;
}

async function onClickConfirm(item: any) {

    try {
        await MessageBoxWarning("确定通过此审核？");
    } catch {
        return;
    }


    const [error] = await to(setApproved(item.id, 1));
    if (error) {
        return;
    }

    refreshData(activeTag);

}


async function onClickCancel(item: any) {

    try {
        await MessageBoxWarning("确定拒绝此此审核？");
    } catch {
        return;
    }

    const [error] = await to(setApproved(item.id, 0));
    if (error) {
        return;
    }

    refreshData(activeTag);



}







</script>

<script lang="ts">
export default {
    title: "刀具申请列表",
    name: ""
}
</script>

<style lang="scss">
#list {}
</style>

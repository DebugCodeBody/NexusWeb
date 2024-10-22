<template>
    <el-drawer class="history-drawer" v-model="data.showHistory" title="历史输入" size="80%" direction="btt" @closed="onClosed">
        <div class="wh-full overflow-hidden">
            <tab-management :dataList="dataList" :refresh="refresh">
                <template #item="{ itemData }: { itemData: invoiceInfo }">
                    <div class="item-content" @click="onSelect(itemData)">
                        <el-form :hide-required-asterisk="true" label-width="auto" ref="formEl">
                            <template v-for="item in showLabel" :key="item.label">
                                <el-form-item v-if="!!itemData[item.propy]" :label="item.label">
                                    <span>{{ itemData[item.propy] }}</span>
                                </el-form-item>
                            </template>
                        </el-form>
                    </div>
                </template>
            </tab-management>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">

import tabManagement from "@/components/tabManagement/index.vue"

import data from "./data"
import { getHistory } from "@/api"

interface Emits {
    (e: 'select', value: any): void;
}

const Emit = defineEmits<Emits>();

const dataList = $ref<invoiceInfo[]>([]);


const showLabel = $ref([
    {
        label: "单位名称",
        propy: "fcompanyname"
    },
    {
        label: "单位税号",
        propy: "ftaxnumber"
    },
    // {
    //     label: "注册地址",
    //     propy: "fcompanyaddr"
    // },
    // {
    //     label: "注册电话",
    //     propy: "ftelephone"
    // },
    // {
    //     label: "开户银行",
    //     propy: "fbankofdeposit"
    // },
    // {
    //     label: "银行帐号",
    //     propy: "faccountnumber"
    // },
    
])

function onClosed() {
    data.showHistory = false;
}



async function refresh() {

    const result = await getHistory()

    dataList.length = 0;
    dataList.push(...result);


    return true;
}





function onSelect(item: invoiceInfo) {
    Emit('select', item);
    data.showHistory = false;
}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>


<style lang="scss">
.el-drawer__body {
    padding: 0;
}

.el-tabs {
    border: none;
}

.el-tabs__header {
    display: none;
}
</style>

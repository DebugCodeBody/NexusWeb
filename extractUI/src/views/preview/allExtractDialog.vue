<template>
    <popDialog :title="title" v-model="allExtractDialogShow" v-if="allExtractDialogShow" @confirm="onDiaLogconfirm"
        ref="DialogEl">
        <el-form label-width="auto" ref="formEl">
            <el-form-item label="供应商：">
                <span>{{ select[0].supname }}</span>
            </el-form-item>
            <el-form-item label="订单号：">
                <el-tag type="success" v-for="item in select" :key="item.orderid"
                    style="margin-right: 10px;margin-bottom: 15px;">{{ item.orderid }}</el-tag>
            </el-form-item>
        </el-form>
    </popDialog>

    <popDialog title="提示" v-if="alertDialog" v-model="alertDialog" @confirm="onAlertConfirm" ref="alertDialogEl">
        <div style="margin-bottom: 10px;">
            <el-tag type="danger">以下订单未到交期时间，是否继续提货？</el-tag>
        </div>
        <el-form label-width="auto" ref="formEl">
            <el-form-item>
                <el-tag type="warning" v-for="item in selectItem" :key="item.orderid"
                    style="margin-right: 10px;margin-bottom: 10px;">{{ item.orderid }}</el-tag>
            </el-form-item>
        </el-form>

    </popDialog>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

import type { FormInstance } from 'element-plus'

import { supUpdate } from "@/api"
import popDialog from "global@/popDialog/index.vue"


import { selectItem, allExtractDialogShow, submitData } from "@/store/data"
import { gtNowDate } from "@/utils/other"


const Props = defineProps<{
    extract: boolean
}>();

const title = $computed(() => {
    return `全部${Props.extract ? "提货" : "撤销"}`;
})



const DialogEl = $ref<InstanceType<typeof popDialog>>();
const alertDialogEl = $ref<InstanceType<typeof popDialog>>();

let alertDialog = $ref(false);

const formEl = $ref<FormInstance>();
const fillArr = $ref<any[]>([]);

const select = $computed(() => {
    return selectItem.value;
})

function onSubmuitData() {
    submitData(DialogEl, supUpdate, [Props.extract, select[0].supid]);
}

async function onDiaLogconfirm() {

    fillArr.splice(0, fillArr.length);

    if (Props.extract) {

        select.forEach((elem: any) => {
            if (!gtNowDate(elem.delivery)) {
                fillArr.push(elem);
            }
        });

    }

    if (fillArr.length > 0) {
        alertDialog = true;
    } else {
        onSubmuitData();
    }

}


async function onAlertConfirm() {

    alertDialogEl.close();
    onSubmuitData();
}

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

<template>
    <pop-dialog class="pop-set_next_time" title="设置期待响应时间" v-model="popValue" v-if="renderValur" @confirm="onConfirm"
        @opened="onOpenEd" @closeed="onCloseEd">

        <el-form :model="formData" label-width="auto" :rules="formRules" :hide-required-asterisk="true" ref="formEl">

            <!-- <el-form-item label="日期" prop="date" v-show="false">
                <div>
                    <div><el-date-picker v-model="formData.date" type="date" placeholder="请选择日期" /></div>
                    <div class="mt-10px">
                        <el-button size="small">明天</el-button>
                        <el-button size="small">后天</el-button>
                    </div>
                </div>
            </el-form-item> -->

            <el-form-item label="时间" prop="expect">
                <expect-time v-model="formData.expect" />
            </el-form-item>

        </el-form>

    </pop-dialog>

</template>

<script setup lang="ts">

import { setExpectTime } from "@/api/nexttime"

import type { FormRules } from 'element-plus'
import dayjs from "dayjs";

import popDialog from "global@/popDialog/index.vue";

import expectTime from "@/components/expectTime.vue"

import { setTagContent } from "@/api/tag"
import { onOpenEd, onCloseEd } from "@/utils/popKey";


const Props = defineProps<{
    refresh: any
}>()


let renderValur = $ref(false);
let popValue = $ref(false);

const formEl = $ref<any>();
let selectItem = $ref({} as mettItem);

const formRules = reactive<FormRules>({
    date: [
        { required: true, message: '请选择日期', trigger: 'change' }
    ],
    expect: [
        { required: true, message: '请选择时间', trigger: 'change' }
    ]
});

const formData = $ref({
    expect: ""
});





async function onConfirm() {

    try {
        await formEl.validate();
    } catch {
        return;
    }



    try {

        await setExpectTime(selectItem.id, formData.expect)

    } finally {

        popValue = false;

        Props.refresh();

    }







}

window.onSetNextTime = function (item: mettItem) {

    popValue = true;
    renderValur = true;

    selectItem = item;

    if (item.expect) {
        
        const value = [item.expect.time];

        if (item.expect.banci) {
            value.push(item.expect.banci);
        }

        formData.expect = value.join(";");

    } else {

        formData.expect = "";

    }


    if (formEl) {
        formEl.clearValidate();
    }




}





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

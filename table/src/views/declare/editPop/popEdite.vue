<template>

    <popDialog title="编辑回复日期" v-model="popValue" custom-class="edito-delay_date" :destroyOnClose="true"
        @opened="onOpenEd" @confirm="onConfirm" v-if="ifValue">

        <el-form :model="form" :rules="rules" ref="formEl">
            <el-form-item prop="value">
                <el-date-picker v-model="form.value" type="date" placeholder="填写回复日期" />
            </el-form-item>
        </el-form>



    </popDialog>
</template>

<script setup lang="ts">

import popDialog from "global@/popDialog/index.vue";

import to from "await-to-js"
import dayjs from "dayjs"

import { setDelay } from "@/api"


const Emit = defineEmits<{
    (e: 'refresh'): void;
}>();


let ifValue = $ref(false);
let popValue = $ref(false);

let editItem: any;

let inputEl = $ref<any>();
let formEl = $ref<any>();


const form = $ref<any>({
    value: ""
});


const rules = reactive<any>({
    value: [
        { required: true, message: '请输入回复日期', trigger: 'change' },

        // {
        //     trigger: 'change', validator(rule: any, value: any, callback: any) {

        //         console.log(value)

        //         let retError: Error | undefined = undefined;

        //         if (!/\d{4,}-\d{1,2}-\d{1,2}/.test(value)) {
        //             retError = new Error("请填写规范的日期格式");
        //         }

        //         callback(retError);

        //     }
        // }

    ],
});




function onOpenEd() {


}

async function onConfirm() {

    try {
        await formEl.validate();
    } catch {
        return;
    }

    const setDay = dayjs(form.value);

    




    const [err] = await to(setDelay(editItem.ol_id, setDay.format("YYYY-MM-DD")));

    if (!err) {


        popValue = false;
        await nextTick();
        Emit("refresh");
    }





}

window.onEditPop = function (item: any) {

    ifValue = true;
    popValue = true;


    editItem = item;


    form.value = editItem.osup_reply_date;





}







</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.edito-delay_date {
    width: 500px !important;
}

@media screen and (max-width: 600px) {
    .edito-delay_date {
        width: 90% !important;
    }
}
</style>

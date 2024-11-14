<template>
    <popDialog title="结束会议" class="dialog-end" v-model="dialog.visible" :center="true" @confirm="onConfirm"
        @open="onOpen" @cancel="onCancel" @opened="onOpenEd" @closeed="onCloseEd" ref="popEl">
        <el-form :model="form" label-width="auto" :hide-required-asterisk="true" :rules="rules" label-position="top"
            ref="formEl">
            <el-form-item label="会议结果" prop="content">
                <result-radio v-model="form.result" ref="resultRadioEl" />
            </el-form-item>
            <el-form-item label="留言" prop="form">
                <el-input v-model="form.memo" size="default" type="textarea"></el-input>
            </el-form-item>

        </el-form>

    </popDialog>

</template>

<script setup lang="ts">

import popDialog from "global@/popDialog/index.vue"

import to from "await-to-js"

import { endMeeting } from "@/api"

import resultRadio from "@/components/resultRadio.vue"

import { onOpenEd, onCloseEd } from "@/utils/popKey";

const Props = defineProps<{
    refresh: any
}>();


let item: mettItem;

const dialog = $ref({
    visible: false
});

const form = $ref({
    content: "",
    resultRadio: "",
    result: "",
    train: "",
    memo: ""
});


const popEl = $ref<any>();
const formEl = $ref<any>();
const resultRadioEl = $ref<any>();

let noValidate = false;

const rules = reactive<any>({
    content: [
        {
            validator(rule: any, value: any, callback: any) {

                let error: Error | undefined = resultRadioEl.rule();

                callback(error);

            }, trigger: 'change'
        }
    ]
});

function onOpen() {
    nextTick(() => {
        resultRadioEl.parse(item);
    })
}

async function onConfirm() {

    if (!noValidate) {

        try {
            await formEl.validate()
        } catch {
            return;
        }

    }


    noValidate = false;

    await to(endMeeting(item.id, form.result, form.memo));

    dialog.visible = false;
    Props.refresh();


}

function onCancel() {

}


function endItem(argItem: mettItem) {

    item = argItem;
    form.memo = "";
    form.result = "";

    if (item.result != "") {

        noValidate = true;
        onConfirm();

    } else {
        dialog.visible = true;
    }






}



onMounted(() => {


    window.endItem = endItem;


})

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

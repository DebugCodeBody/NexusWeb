<template>
    <pop-dialog 
        class="pop-edit_track" 
        title="编辑会议" 
        v-model="popValue" 
        v-if="renderValur" 
        @confirm="onConfirm"
        @opened="onOpenEd"
        @closeed="onCloseEd">

        <el-form :model="formData" label-width="auto" :rules="formRules" :hide-required-asterisk="true" ref="formEl">

            <el-form-item label="标记内容" prop="tag_content">
                <el-input v-model="formData.tag_content" placeholder="请输入内容" type="textarea"></el-input>
            </el-form-item>


        </el-form>


    </pop-dialog>

</template>

<script setup lang="ts">

import type { FormRules } from 'element-plus'

import popDialog from "global@/popDialog/index.vue";

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
    tag_content: [
        { required: true, message: '请输入标记内容', trigger: 'change' }
    ]
});

const formData = $ref({
    tag_content: ""
})

async function onConfirm() {

    try {
        await formEl.validate();
    } catch {
        return;
    }


    try {

        await setTagContent(selectItem.id, formData.tag_content);

    } finally {

        popValue = false;

        Props.refresh();

    }







}

window.onEditeTag = function (item: mettItem) {

    popValue = true;
    renderValur = true;

    selectItem = item;

    formData.tag_content = "";

}





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

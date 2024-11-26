<template>

    <pop-dialog class="pop-edit_track" title="修改执行者" v-model="popValue" v-if="renderValur" @confirm="onConfirm"
        @opened="onOpenEd" @closeed="onCloseEd">

        <el-form :model="formData" label-width="auto" :rules="formRules" :hide-required-asterisk="true" ref="formEl">

            <el-form-item label="操作员" prop="name">
                <div class="mr-10px" v-if="formData.name">{{ formData.name }}</div>
                <el-button @click="onClickSelectName">选择</el-button>
            </el-form-item>

            <el-form-item label="会议类型" prop="type">
                <type-radio v-model="formData.type" />
            </el-form-item>

            <el-form-item label="设置类型" prop="action">
                <el-radio-group v-model="formData.action">
                    <el-radio v-for="item in action" :key="item.label" :value="item.id" :label="item.id"
                        :disabled="item.disabled">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>


            <el-form-item label="留言" prop="memo">
                <el-input v-model="formData.memo" placeholder="请输入留言" type="textarea" :disabled="!!selectItem.create_group"></el-input>
                <div class="mt-10px">
                    <result-radio v-model="result" ref="resultRadioEl" />
                </div>
            </el-form-item>


        </el-form>


    </pop-dialog>


</template>

<script setup lang="ts">

import type { FormRules } from 'element-plus'

import { editTrackUser } from "@/api"

import typeRadio from "./typeRadio.vue"
import popDialog from "global@/popDialog/index.vue";
import resultRadio from "@/components/resultRadio.vue"

import exportData from "@/store/data"



import { onOpenEd, onCloseEd } from "@/utils/popKey";




const Props = defineProps<{
    refresh: any
}>()

let renderValur = $ref(false);
let popValue = $ref(false);

let result = $ref("");
const resultRadioEl = $ref<any>();



const formEl = $ref<any>();
const formRules = reactive<FormRules>({
    name: [
        {
            validator(rule, value, callback, source, options) {


                let error: Error | undefined = undefined;
                if ( formData.isEmptyName && !formData.name) {
                    error = new Error("请选择人员名字")
                }
                callback(error);
            },
        }

    ],
    action: [
        { required: true, message: '请勾选设置类型', trigger: 'change' }
    ],
    memo: [
        {
            validator(rule, value, callback, source, options) {

                callback(resultRadioEl.rule());
            },
        }
    ]
});


const action = $ref([
    {
        id: 1,
        label: "执行者",
        disabled: false
    },
    {
        id: 2,
        label: "沟通人",
        disabled: false
    }
])


const formData = $ref({
    /** 当前选中的名字 */
    name: "",
    /** 是否沟通员模式 */
    isComm: false,
    /** 动作 */
    action: undefined as undefined | number,
    /** 当前选中的类型 */
    type: "",
    /** 留言 */
    memo: "",

    /** 是否空名字 */
    isEmptyName: false
});


let selectItem = $ref({} as mettItem);

window.onPopEditorTrack = function (item: mettItem, name: string, isComm: boolean) {


    renderValur = true;
    popValue = true;

    if (formEl) {
        formEl.resetFields();
    }

    selectItem = item;
    formData.name = name;
    formData.isComm = isComm;
    formData.type = item.type;
    formData.isEmptyName = !name;


    action[1].disabled = !isComm;

    // if (!isComm) {
    //     formData.action = 1;
    // } else {
    //     formData.action = undefined;
    // }

    /** 默认选中执行者 */
    formData.action = 1;


    nextTick(() => {

        resultRadioEl.clear();



    })


    if (!name) {

        nextTick(() => {
            onClickSelectName();
        })
    }


}


async function onClickSelectName() {

    try {

        let selectList = [] as string[];


        if (formData.name) {
            selectList.push(formData.name)
        }

        const selectName = await window.openNameSelect({
            userList: exportData.userData,
            title: "选中执行者",
            selectList,
            isOne: true,
        })

        formData.name = selectName;

    } catch {

        return;

    }


}


async function onConfirm() {

    try {
        await formEl.validate();
    } catch {
        return;
    }


    try {

        let user = "";
        let comm = "";

        if (formData.action == 1) {

            user = formData.name;

        } else {
            comm = formData.name;
        }

        let type = formData.type;

        if (selectItem.type == type) {
            type = ""
        }

        await editTrackUser(selectItem.id, user, formData.memo, comm, type, result);

    } finally {

        popValue = false;

        Props.refresh();

    }


}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.pop-edit_track {

    textarea {
        height: 100px;
        resize: none;
    }

}
</style>

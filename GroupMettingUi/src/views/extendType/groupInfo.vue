<template>
    <div class="relative  h-full flex flex-col">
        <el-form :model="form" :rules="rules" :hide-required-asterisk="true" label-width="auto" ref="formEl"
            class="overflow-auto">

            <el-form-item label="分组名" prop="name">
                <el-input size="default" v-model="form.name"></el-input>
            </el-form-item>
            <!-- 
            <actor-user title="用户" :actor="form.actor" :notuser="form.notuser" :hot="hotArr" :actorArr="data.actorArr"
                :notuserArr="data.notUserList" :showNotUser="false" /> -->

        </el-form>

        <div class="mt-10px">
            <el-button class="w-full" type="primary" @click="onClickSubmit" v-if="!loading">提交</el-button>
            <el-button class="w-full" type="primary" loading v-else>正在提交</el-button>
        </div>

        <div class="mt-10px">
            <el-button class="w-full" type="danger" @click="onClickDelete" v-if="!isAdd">删除</el-button>
        </div>

        <div class="mt-10px">
            <el-button class="w-full" @click="onClickReturn">返回</el-button>
        </div>

    </div>
</template>

<script setup lang="ts">

import type { FormRules } from 'element-plus'

import actorUser from "@/components/actorUser.vue"

import { data, getDate } from "./data";

import { add, edit, del } from "@/api/extendType"

import to from "await-to-js";


const formEl = $ref<any>();
const form = $ref({
    name: data.selectItem!.name,

    actor: [...data.selectItem!.user],

    /** 非必须参与人 */
    notuser: [] as string[],

})

const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请填写分组名', trigger: 'change' }
    ],
    actor: [
        { required: true, message: '请选择用户', trigger: 'change' }
    ]

});


const isAdd = $computed(() => {
    return data.action == "add";
})

const isEdit = $computed(() => {
    return data.action == "edit";
})


/** 热度列表人员 */
const hotArr = $ref<userItem[]>([]);





let loading = $ref(false);


async function onClickSubmit() {

    try {
        await formEl.validate();
    } catch {
        return;
    }

    let result;
    const sendData = {
        name: form.name,
        user: form.actor
    }

    if (isAdd) {
        result = add(sendData)
    } else {
        result = edit(data.selectItem!.id, sendData);
    }

    const [err] = await to(result);
    if (err) {
        return;
    }


    await getDate();


    if (isAdd) {

        if (document.referrer) {
            location.href = document.referrer;
            return
        }

    }

    onClickReturn();

}

async function onClickDelete() {


    const [err] = await to(del(data.selectItem!.id))
    if (err) {
        return;
    }


    await getDate();
    onClickReturn();

}


function onClickReturn() {

    data.selectItem = undefined;

}

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

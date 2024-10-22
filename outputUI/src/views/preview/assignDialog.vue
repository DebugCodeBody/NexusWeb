<template>
    <pop-dialog title="指派任务" class="assign-Dialog" v-model="storeData.showAssign" @confirm="onClickSubmit"
        @opened="onOpened">

        <div class="form-content wh-full overflow-auto">
            <div class="relative">
                <div class="p-5px">
                    <el-form :model="form" :rules="rules" :hide-required-asterisk="true" label-width="auto" ref="formEl">
                        <el-form-item label="负责组" prop="group">
                            <el-select v-model="form.group" @change="onChnageGroup" :disabled="true">
                                <el-option v-for="item in data.group" :key="item.id" :label="item.title" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="工单号" prop="orderid">
                            <div>
                                <el-input v-model="form.orderid" :disabled="true"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="执行人员" prop="username">
                            <el-select v-model="form.username">
                                <el-option v-for="item in usernameArr" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否紧急" prop="tight">
                            <el-switch v-model="form.tight" />
                        </el-form-item>
                        <el-form-item label="留言" prop="info">
                            <el-input v-model="form.info" type="textarea"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

    </pop-dialog>
</template>

<script setup lang="ts">
import popDialog from "global@/popDialog/index.vue"


import { ElForm } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'


import { getDeclare, createDeclare } from "@/api"
import { setWork } from "@/api/execut"

import storeData, { refreshData } from "./storeData"



const form = $ref({
    group: "" as id,
    orderid: "",
    username: "",
    tight: false,
    info: ""
});

const data = $ref({
    group: [] as declareInfo[]
})
const usernameArr = computed(() => {

    const selectGroup = form.group;
    const retGroup = data.group.find((elem) => selectGroup == elem.id);

    return retGroup ? retGroup.username : [];

})


let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const rules = reactive<FormRules>({
    group: [
        { required: true, message: '请选择负责组', trigger: 'blur' },
    ],
    orderid: [
        { required: true, message: '请填写工单号', trigger: 'blur' },
    ],
    username: [
        { required: true, message: '请选择执行人员', trigger: 'blur' },
    ],
    info: [
        { required: true, message: '请填写任务内容', trigger: 'blur' },
    ]
})

const formEl = $ref<typeof ElForm>();


async function onChnageGroup(id: number) {
    form.username = "";
}


async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }



    try {

        await setWork(storeData.selectItem.id, form.username, form.tight, form.info);

        storeData.showAssign = false;

        refreshData();


    } catch {



    } finally {
        submitLoading = false;
    }




}



async function onOpened() {

    try {

        initLoading = true;

        form.orderid = storeData.selectItem.orderid;


        const groupArr = await getDeclare();

        const groupId = storeData.selectItem.group;
        const findGroup = groupArr.find((elem) => elem.id == groupId)!;

        form.group = findGroup.id;




        data.group.push(...groupArr);






    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.assign-Dialog {

    .form-content {

        form {
            padding: 10px;
            box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);


            .el-form-item {
                &.line-item {
                    flex-direction: column;
                }
            }

            textarea {
                height: 100px;
                resize: none;
            }

            .el-checkbox-group .el-checkbox,
            .el-radio-group .el-radio {
                margin-right: 10px;
                margin-bottom: 10px;
                padding: 0 10px;
            }

        }

    }


}
</style>

<template>
    <pop-dialog v-model="field.show" :title="title[field.action]" style="width: 30%;" @confirm="confirm" @cancel="cancel" ref="Dialog" >
        <div class="group-view">
            <div class="group-top">
                <el-form :model="form" label-width="auto" :rules="rules" :hide-required-asterisk="true" ref="formEl">
                    <el-form-item label="负责群" prop="group">
                        <el-select v-model="form.group" placeholder="请选择负责群" disabled>
                            <el-option v-for="(item) in group" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name" />
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </pop-dialog>
</template>

<script setup lang="ts">
import popDialog from "global@/popDialog/index.vue"
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import to from "await-to-js";
import { fieldAdd, fieldEdit } from "@/api/field"

const Emits = defineEmits<{
    (e: "close"): void;
}>();


const Props = defineProps<{
    group: GroupInfos,
}>();

let Dialog = $ref<InstanceType<typeof popDialog>>();
let formEl = $ref<FormInstance>();

let field = inject<any>("field")!;
let selectGroup = $(inject<GroupInfo>("selectGroup")!);


const form = reactive({
    group: undefined,
    name: ""
})
const rules = reactive({
    name: [{ required: true, message: '请填写该选项', trigger: 'change' }],
})
const title: {
    [key: string]: any
} = {
    "add": "添加",
    "edit": "编辑"
}


async function confirm() {
    let [err] = await to(formEl.validate());
    if (err) {
        return;
    }

    
    Dialog.startSubmit();

    try {
        if (field.action == "add") {
            await fieldAdd(form)
        } else {
            await fieldEdit(field.item.id, form);
        }
        Dialog.close();
    } catch (err: any) {
        Dialog.stopSubmit();
        
        ElMessage({
            showClose: true,
            message: err.msg || err.message ||'操作失败，请稍后重试',
            type: 'error',
        })
    }

}

function cancel(){
    Emits("close")

}

function init() {
    form.group = selectGroup.id as any;
    if (field.item) {
        form.name = field.item.name;
    }
}


init();


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.group_dialog {
    width: 30%;
}

.group-view {

    .group-bottom {
        display: flex;

        button {
            flex: 1
        }
    }

    textarea {
        height: 100px;
    }
}
</style>

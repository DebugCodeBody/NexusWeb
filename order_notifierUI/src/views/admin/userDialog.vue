<template>
    <pop-dialog v-model="charge.show" :title="title[charge.action]" style="width: 30%;" @confirm="confirm" ref="Dialog">
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


import { userAdd, userEdit } from "@/api/group"


const Props = defineProps<{
    group: GroupInfos,
    form?: dUser,
    show?: boolean
}>();


let charge = inject<any>("charge")!;
let selectGroup = $(inject<GroupInfo>("selectGroup")!);
const title: {
    [key: string]: any
} = {
    "add": "添加",
    "edit": "编辑"
}



const form = reactive<dUser>({
    name: ""
} as any)

let Dialog = $ref<InstanceType<typeof popDialog>>();
let formEl = $ref<FormInstance>()

const rules = reactive({
    group: [{ required: true, message: '请选择负责群', trigger: 'change' }],
    name: [{ required: true, message: '请填写负责人名字', trigger: 'change' }],
})


async function confirm() {
    let [err] = await to(formEl.validate());
    if (err) {
        return;
    }


    function getGroup() {
        return Props.group.find((elem) => elem.id == form.group)
    }

    new Promise((resolve, reject) => {
        
        if (charge.action == "add") {
            userAdd(form.group, form).then(resolve, reject)
        } else {
            userEdit(form.id, form).then(resolve, reject)
        }
    }).then((data: any) => {

        if (charge.action == "add") {
            getGroup()!.child.push(data);
        } else {
            getGroup()!.child.find((item) => {
                if (item.id == form.id) {
                    Object.assign(item, form);
                    return true;
                }
            })
        }

        Dialog.close();

    }).catch((error) => {

        ElMessage({
            showClose: true,
            message: error.msg || error.message || '操作失败，请稍后重试',
            type: 'error',
        })

    })

}


function init() {
    form.group = selectGroup.id;
    if (charge.item) {
        form.name = charge.item.name;
        form.id = charge.item.id;
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

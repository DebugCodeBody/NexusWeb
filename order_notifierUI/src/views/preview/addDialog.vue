<template>
    <pop-dialog v-model="diaForm.open" :title='isAdd ? "添加任务" : "编辑任务"' :loading="loading" @confirm="confirm"
        :disabledConfirmButton="disabledConfirmButton" ref="Dialog">
        <div class="add-view" v-loading="loading">
            <div class="group-top">
                <el-tabs v-model="selectGroupId" type="border-card" @tab-change="onTabChange">
                    <el-tab-pane :label="item.name" :name="item.id" v-for="(item) in group" :key="item.id" :disabled="diaForm.action == 'edit' && item.id != diaForm.item.group">
                    </el-tab-pane>
                    <group-view :formItem="formItem" :group="selectGroupId!" ref="view" />
                </el-tabs>
            </div>
        </div>
    </pop-dialog>

</template>

<script setup lang="ts">
import groupView from "@/components/groupView/index.vue"

import popDialog from "global@/popDialog/index.vue"
import type { FormInstance, FormRules } from 'element-plus'
import to from "await-to-js";

import { groupGet } from "@/api/group"
import { workCreate, workEdit, getGropuForm, workEditGet } from "@/api"


let Props = defineProps<{
    close: () => void
}>();

let Dialog = $ref<InstanceType<typeof popDialog>>();
let view = $ref<InstanceType<typeof groupView>>();


let diaForm = inject<any>("diaForm")!;
let loading = $ref(true);
let selectGroupId = $ref<number | undefined>(parseInt(localStorage.getItem("WorkAddTabSelectGroup")!));
let selectGroup = $computed(() => {
    return group.find(elem => elem.id == selectGroupId)!;
});

let disabledConfirmButton = $computed(() => {
    return !formItem.length
});

const group = $ref<Groups>([]);
const isAdd = $computed(() => {
    return diaForm.action == "add";
})

function onTabChange(value: string) {
    localStorage.setItem("WorkAddTabSelectGroup", value);
    getFrom(value);
}

async function confirm() {
    Dialog.startSubmit();
    const [err, result] = await to(view.onSubmit());
    if (err) {
        Dialog.stopSubmit();
        return;
    }

    Props.close();
    Dialog.close();
}

let formItem = $ref<any[]>([]);
async function getFrom(value: string | number) {
    formItem = [];

    const [error, result] = await to(getGropuForm(value));
    if (error) {
        formItem = [];
    } else {
        formItem = result.form || [];
    }


}



async function init() {
    let [err, result] = await to(groupGet());
    loading = false;

    group.push(...result!.filter((elem) => {
        if (elem.id == 16) {
            return !!(window as any).itceshi
        } else {
            return true
        }
    }));
    if (!selectGroupId) {
        selectGroupId = group[0].id;
    }

    if (diaForm.action == "edit") {
        const item: workItem = diaForm.item;

        const { group: groupId, id } = item;

        
        const [err, formData] = await workEditGet(id);
        if (err) {
            return;
        }

        nextTick(() => {
            (formData as any).id = id;
            view.setFormData(formData);
        })

        selectGroupId = groupId;
    }

    getFrom(selectGroupId!);
}


init();
provide("selectGroup", $$(selectGroup));


</script>

<script lang="ts">
/**
 * 这是一个组件
 */
export default {
    name: ""
}
</script>

<style lang="scss">
.add-view {
    textarea {
        height: 100px;
    }

}
</style>

<template>
    <popDialog 
        v-model="diaForm.openStep" 
        :title="title"
        @confirm="confirm" 
        @cancel="cancel" 
        ref="dialog"
        :disabledConfirmButton="!isDoneAction && !memo && diaForm.action != 'bei'">
        <work-step :loading="loading" :error="error" ref="step" v-model="stepList" @refresh="init" :getTitle="getTitle">
            <template #default="{ item } : { item: workStep }">
                <p>操作人员：{{ item.username }}</p>
                <p>创建时间：{{ parseTime(item.createdate) }}</p>
                <p v-if="item.memo">留言内容：{{ item.memo }}</p>
            </template>
        </work-step>
        <el-card class="step-footer" v-if="!isDone">
            <el-input v-model="memo" placeholder="请输入留言" type="textarea"></el-input>
        </el-card>
    </popDialog>
</template>

<script setup lang="ts">
import popDialog from "global@/popDialog/index.vue";
import workStep from "global@/workStep/index.vue";
import to from "await-to-js";

import { getTitle, parseTime } from "@/utils/other"
import { getStep, setStep } from "@/api/step"
import { workDone } from "@/api"


const step = $ref<InstanceType<typeof workStep>>();
const dialog = $ref<InstanceType<typeof popDialog>>();

const stepList = $ref<workSteps>([]);
let diaForm = inject<provideForm<workItem>>("diaForm")!;
let memo = $ref("");
let error = $ref(false);
let loading = $ref(true);

const isDoneAction = $computed(() => {
    return diaForm.action == "done"
})


const isDone = $computed(() => {
    return diaForm.item.stageid == 3
})
const title = $computed(() => {
    return ({
        "step": "留言",
        "done": "结案",
        "bei": "处理",
    })[diaForm.action];
})





async function confirm() {

    dialog.startSubmit();

    let err, result: any;
    if (isDoneAction) {
        [err, result] = await workDone(diaForm.item, memo);
    } else {
        let stageid: number;

        if (diaForm.action == "step") {
            stageid = 99;
        } else if (diaForm.action == "bei") {
            stageid = 2;
        }

        [err, result] = await to(setStep(diaForm.item.id, stageid!, memo));
    }
    if (err) {
        dialog.stopSubmit();
        window.draggableMove!.reject();
        window.draggableMove = undefined;
        return
    } else {
        if (isDoneAction || diaForm.action == "bei") {
            window.draggableMove!.resolve();
            window.draggableMove = undefined;
        }
    }

    dialog.close();

}

function cancel() {
    if (window.draggableMove) {
        window.draggableMove.reject();
    }
}


async function init() {
    loading = true;

    const [err, result] = await to(getStep(diaForm.item.id));
    if (err) {
        error = true;
    } else {
        stepList.push(...(result as any));
    }

    loading = false;

}


init();



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.step-footer {
    margin-top: 10px;

    .el-card__body {
        padding: 10px;
    }

    textarea {
        height: 100px;
    }


}
</style>

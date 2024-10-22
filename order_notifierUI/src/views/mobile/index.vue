<template>
    <div id="declare">

        <div class="declare-view w-full" ref="declareView">
            <h3 class="title">{{ title }}</h3>


            <el-result style="margin: 10px 0;" icon="error" title="请通过群链接进入本页面" v-if="!id">
            </el-result>

            <template v-else>

                <div style="position: relative;">

                    <div style="margin: 10px 0;">
                        <work-step :loading="loading" :error="error" ref="step" v-model="stepList" :maxHeight="200"
                            @refresh="init" :getTitle="getTitle">
                            <template #default="{ item } : { item: workStep }">
                                <p>操作人员：{{ item.username }}</p>
                                <p>创建时间：{{ parseTime(item.createdate) }}</p>
                                <p v-if="item.memo">留言内容：{{ item.memo }}</p>
                            </template>
                        </work-step>
                    </div>
                    <div>
                        <el-form label-width="auto" :hide-required-asterisk="true">

                            <el-form-item label="步骤" v-if=false>
                                <el-checkbox-group v-model="selectDoneStep">
                                    <el-checkbox border v-for="item in doneStep" :label="item.id" :key="item.id"
                                        :disabled="item.act">{{
                                            item.act ? item.act_label : item.next_label
                                        }}</el-checkbox>
                                </el-checkbox-group>

                                <el-checkbox-group v-model="nextStep" @change="onSetpChange">
                                    <el-checkbox border v-for="item in stepCheckBox" :label="item.id" :key="item.id"
                                        :disabled="item.act">{{
                                            item.act ? item.act_label : item.next_label
                                        }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>

                            <el-form-item label="步骤">
                                <div style="height: 150px;    line-height: 12px;">
                                    <el-steps direction="vertical" finish-status="success" :active="nextActiveStep">

                                        <el-step v-for="item in doneStep" :key="item.id">
                                            <template #title>
                                                <span>{{ item.act_label }}</span>
                                            </template>
                                        </el-step>

                                        <el-step title="创建工单" v-for="item in stepCheckBox" :key="item.id">
                                            <template #title>
                                                <el-checkbox border :label="item.id" :disabled="item.act"
                                                    v-model="item.select" @change="onClickSetpChange($event, item)">{{
                                                        item.act ? item.act_label
                                                            : item.next_label
                                                    }}</el-checkbox>
                                            </template>
                                        </el-step>

                                    </el-steps>
                                </div>
                            </el-form-item>

                            <el-form-item label="留言">
                                <el-input type="textarea" v-model="memo" />
                            </el-form-item>
                        </el-form>

                    </div>
                    <div class="button-area">
                        <el-button type="primary" size="large" @click="onClickSubmit"
                            :disabled="disabledSubmit">提交</el-button>
                    </div>


                    <el-result icon="success" title="提交成功" class="success" v-if="done"></el-result>

                </div>

            </template>

        </div>






    </div>
</template>

<script setup lang="ts">
import getSearch from "@/utils/urlSearch"
import { getTitle, parseTime } from "@/utils/other"

import to from "await-to-js";

import workStep from "global@/workStep/index.vue";
import { getStep, setStep } from "@/api/step"
import { workDone } from "@/api"


let id = $ref(getSearch("id"));
let stepList = $ref<workSteps>([]);
let loading = $ref(false);
let error = $ref(false);

let memo = $ref("");


const stepCheckBox = $ref<any[]>([
    {
        id: 2,
        act_label: "正在处理",
        next_label: "转处理",
        act: false,
        select: false
    },
    {
        id: 3,
        act_label: "已结案",
        next_label: "转结案",
        act: false,
        select: false
    }
]);
let nextStep = $ref<number[]>([]);
let nextActiveStep = $ref<number>();
let lastActiveStep: any = null;

const doneStep = $ref<any[]>([
    {
        id: 1,
        act_label: "创建工单",
        next_label: "",
        act: true,
        select: false
    }]);
const selectDoneStep = $ref<number[]>([]);



let done = $ref(false);

const disabledSubmit = $computed(() => {
    return nextStep.length == 0;
})




function onSetpChange(value: number[]) {

    console.log(value)


    if (value.length == 0) {
        return;
    }


    nextStep.splice(0, nextStep.length, value.pop()!);

}

function onClickSetpChange(setBool: boolean, value: any) {

    if (lastActiveStep === value) {


        nextActiveStep = doneStep[doneStep.length-1].id;
        

        lastActiveStep = null;
        nextStep = [];

    } else {

        nextActiveStep = value.id;
        if (lastActiveStep) {
            lastActiveStep.select = false;
        }

        lastActiveStep = value;
        nextStep = [value.id];



    }




}


async function onClickSubmit() {



    let err, result;
    if (nextStep[0] == 2) {
        [err, result] = await to(setStep(id, 2, memo))
    } else {
        [err, result] = await to(workDone({
            id
        } as any, memo));
    }

    if (err) {
        return;
    }

    done = true;

}


async function init() {
    loading = true;

    const [err, result] = await to(getStep(id));
    if (err) {
        error = true;
    } else {

        let popItem;
        let popIndex = result.length - 1;

        while (popIndex != -1) {
            
            popItem = result[popIndex];
            if (popItem.stageid != 99) {
                break;
            }

            popIndex -= 1;
        }


        if (popItem.stageid == 2) {

            stepCheckBox[0].act = true;
            doneStep.push(stepCheckBox.shift());


        } else if (popItem.stageid == 3) {
            stepCheckBox[0].act = true;
            stepCheckBox[1].act = true;
            doneStep.push(stepCheckBox.shift());
            doneStep.push(stepCheckBox.shift());

        }

        nextActiveStep = popItem.stageid;

        selectDoneStep.push(...doneStep.map((elem) => elem.id));

        stepList.push(...(result as any));

    }

    loading = false;

}


onMounted(() => {


    init();









})





</script>

<script lang="ts">

const title = "快捷回复";
export default {
    title
}
</script>

<style lang="scss">
#declare {

    .icon-warp {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 100px;
        height: 100px;
        margin: 20px;
        border-radius: 10px;
        background-color: #fff;
        text-align: center;
        box-shadow: 0 0 11px rgb(33 33 33 / 20%);
        cursor: pointer;

        svg {
            font-size: 42px;
            margin-bottom: 10px;
            width: 1em;
            height: 1em;
        }
    }

    .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        background-color: #409eff;
    }

    .declare-view {
        position: relative;


        padding-top: 5px;
        max-width: 800px;
        padding-bottom: 10px;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        flex-shrink: 0;
    }

    .el-input__inner[disabled] {
        opacity: 1 !important;
        color: #999 !important;
        -webkit-text-fill-color: #999 !important;
    }

    .el-form {

        .el-result {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(255, 255, 255);
        }

    }


    .button-area {
        display: flex;

        .el-button {
            width: 100%;
        }

    }

    .step-view {
        max-width: 800px;
    }

    .el-tabs__header {
        display: none;
    }

    .el-card__body {
        padding: 5px 20px;
    }

    .el-checkbox {
        margin-bottom: 10px;
    }

    .el-checkbox:last-of-type {
        margin-right: 30px;
    }

    .el-result.success {
        position: absolute;
        top: 10px;
        background-color: white;
        height: 100%;
        width: 100%;

    }


}
</style>

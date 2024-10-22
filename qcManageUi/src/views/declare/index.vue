<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content ">
                    <div class="relative">
                        <div class="p-5px">
                            <el-form :model="form" :hide-required-asterisk="true" :rules="rules" label-width="auto"
                                ref="formEl">

                                <el-form-item label="工单号" prop="moid">
                                    <order-input v-model="form.moid" :search="false" @scan="onMoidScan" />
                                </el-form-item>
                                <el-form-item label="订单号">
                                    <el-tag v-if="!scanResult.order">请先扫描工单号</el-tag>
                                    <span v-else>{{ scanResult.order }}</span>
                                </el-form-item>


                                <el-form-item class="process" label="工艺" prop="process">
                                    <el-select v-model="form.process" :disabled="processDisabled || submit.value">
                                        <el-option v-for="item in scanResult.process" :key="item.id" :label="item.name"
                                            :value="item.id" />
                                    </el-select>
                                </el-form-item>

                                <el-form-item class="state" label="状态" prop="state">

                                    <el-tag type="danger" v-if="!!scanResult.msg">{{ scanResult.msg }}</el-tag>

                                    <el-radio-group v-model="form.state" @change="onStateChange"
                                        :disabled="!form.moid || submit.value" v-else>
                                        <el-radio v-for="item in scanResult.state" :key="item.id" :label="item.id"
                                            :value="item.id">{{ item.name }}</el-radio>
                                    </el-radio-group>

                                </el-form-item>

                                <template v-if="form.state == 2">

                                    <el-form-item label="不良原因" prop="reason">
                                        <div v-if="form.reason">
                                            <el-tag type="danger">{{ reasonValue }}</el-tag>
                                            <el-button class="ml-10px" @click="onClickClearReason"
                                                :disabled="submit.value">清空</el-button>
                                        </div>
                                        <el-button type="warning" :disabled="!!form.badness"
                                            @click="onClickSelectReason" v-else>未选择</el-button>
                                    </el-form-item>

                                    <el-form-item label="添加工艺" prop="badness">
                                        <div v-if="form.badness">
                                            <el-tag>{{ form.badness }}</el-tag>
                                            <el-button class="ml-10px" @click.capture="onClickClearBadness"
                                                :disabled="submit.value">清空</el-button>
                                        </div>
                                        <el-button type="warning" :disabled="!!reasonValue"
                                            @click="onClickSelectBadness" v-else>未选择</el-button>
                                    </el-form-item>

                                </template>

                                <el-form-item label="结果" v-if="submit.value">
                                    <el-tag type="success" v-if="submit.success">{{ submit.msg }}</el-tag>
                                    <el-tag type="danger" v-else>{{ submit.msg }}</el-tag>
                                </el-form-item>
                                <el-form-item label="下工序" v-if="submit.value && submit.next">
                                    <div class="next-process">{{ submit.next }}</div>
                                </el-form-item>

                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="submitLoading"
                                    :disabled="processDisabled || submit.value" @click="onClickSubmit">提交</el-button>
                            </div>

                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                        </el-result>
                        <el-result v-if="initError" icon="error" class="error-result">
                            <template #extra>
                                <el-tag type="danger">请通过扫描二维码进入</el-tag>
                            </template>
                        </el-result>

                    </div>
                </div>
            </div>

        </div>
    </div>

    <pop-reason @select="onChangeSelect" />
    <pop-badness @select="onChangeSelect" />
    <pop-match @close="onMatchClose" />

</template>

<script setup lang="ts">

import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

import orderInput from "global@/orderInput/index.vue"

import popReason from "./popReason.vue"
import popBadness from "./popBadness.vue"
import popMatch from "./popMatch.vue"


import thisManage from "./data"

import { MessageBoxInfo, MessageBoxWarning } from "@/utils/elementLib"
import { ElForm, FormRules } from 'element-plus'
import getSearch from "@/utils/urlSearch"


import { scan, submitResult } from "@/api"



const { scanResult, form, popModel, submit } = thisManage;



let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    moid: [
        { required: true, message: '请先扫描工单号', trigger: 'blur' },
    ],
    state: [
        {
            validator(rule: any, value: any, callback: any) {

                let error: Error | undefined = undefined;
                if (form.state == 0) {

                    error = new Error("请选择状态");

                }

                callback(error);

            }, trigger: 'blur'
        },
    ],

    reason: [
        {
            validator(rule: any, value: any, callback: any) {

                let error: Error | undefined = undefined;
                if (form.state == 2 && !reasonValue && !form.badness) {
                    error = new Error("请选择不良原因");
                }
                callback(error);

            }, trigger: 'blur'
        },
    ],
    badness: [

        {
            validator(rule: any, value: any, callback: any) {

                let error: Error | undefined = undefined;
                if (form.state == 2 && !reasonValue && !form.badness) {
                    error = new Error("请选择需要添加的工艺");
                }
                callback(error);

            }, trigger: 'blur'
        },
    ]
})

const reasonValue = $computed(() => {

    let retVal = form.reason;
    if (form.next) {
        retVal = `${form.next}(${retVal})`
    }

    return retVal;

})

const processDisabled = $computed(() => {
    return !form.moid || !!scanResult.msg;
})

const scanWarn = $computed(() => {

    return (!form.moid || initLoading) && !scanResult.msg

})





/** 状态变动的事件 */
function onStateChange(value: number) {

    if (value == 1) {
        onClickClearReason();
        onClickClearBadness();
    }

}

/** 不良原因或者添加工艺被选中的时候，清空错误 */
function onChangeSelect() {

    formEl.clearValidate("reason");
    formEl.clearValidate("badness");

}

/** 弹窗不良原因 */
function onClickSelectReason() {

    popModel.reason = true;
}

/** 弹窗不良添加工艺 */
function onClickSelectBadness() {

    popModel.badness = true;

}

/** 清空不良原因 */
function onClickClearReason() {

    form.next = "";
    form.reason = "";

}

/** 清空添加不良工艺 */
function onClickClearBadness() {
    form.badness = "";
}

function onMatchClose() {

    if (scanResult.match.length) {

        scanResult.msg = "未完成配合件的检查"

        // ElMessageBox.confirm(
        //     message,
        //     title,
        //     {
        //         confirmButtonText: '确定',
        //         showCancelButton: false,
        //         type: 'error',
        //         center: true
        //     }
        // ).finally(() => {
        // })

    }

}


/** 扫描到订单 */
async function onMoidScan(value: string) {

    try {
        initLoading = true;

        form.state = 0;
        form.next = "";
        form.badness = "";
        form.reason = "";

        

        submit.value = false;


        const result = await scan(value);

        Object.assign(scanResult, result);

        if (!result.msg) {
            /** 工艺默认选中最后一个 */
            form.process = scanResult.process[scanResult.process.length - 1].id;

            popModel.match = result.match.length > 0;

        }


    } catch {


    } finally {
        initLoading = false;

    }


}





async function onClickSubmit() {

    try {
        await formEl.validate();
    } catch {
        return;
    }



    const selectProcess = scanResult.process.find((elem) => elem.id == form.process)!;

    if (form.state == 2) {

        if (selectProcess.isBad) {

            try {
                await MessageBoxWarning("当前工艺已经存在QC不良记录，确定再次不良吗", "询问");
            } catch {
                return;
            }

        }

    }



    try {

        submitLoading = true;

        const result = await submitResult(form.moid, form.state, form.process, form.reason, form.badness, form.next);

        submit.value = true;

        Object.assign(submit, result);

        if (result.warn) {

            MessageBoxInfo(result.warn);
        }


    } catch {



    } finally {
        submitLoading = false;
    }




}



async function init() {

    try {

        initLoading = true;

        const moid = getSearch("moid")
        if (moid) {

            form.moid = moid;
            onMoidScan(moid);


        }






        // form.moid = "536122";
        // onMoidScan(form.moid);


    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref("QC管理");

export default {
    name: "",
    title
}
</script>

<style lang="scss">
#declare {

    .declare_view {
        max-width: 800px;
        margin: auto;
    }

    .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        background-color: #66b1ff;
    }

    .form-content {

        form {
            padding: 10px;
            box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);

            .el-form-item {
                &.line-item {
                    flex-direction: column;
                }

                &.mb-0 {
                    margin-bottom: 0;
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

            .el-form-item.state {
                .el-radio {
                    margin-bottom: 0;
                }
            }



        }

        .process {
            .el-select {
                max-width: 200px;
            }
        }

    }

    .button-block {
        .el-button {
            width: 100%;

            &+.el-button {
                margin-left: 0;
            }
        }
    }


    .el-result {
        background-color: white;

        position: absolute;
        top: 0px;
        width: 100%;
        z-index: 99;

        * {
            user-select: none !important;
        }

    }


    .next-process {

        font-weight: bold;

    }


}

.el-dialog {
    width: 90% !important;
    max-width: 560px;
}
</style>

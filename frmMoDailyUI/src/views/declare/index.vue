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
                                <el-form-item class="type" label="工艺" prop="tissue">
                                    <el-tag type="danger" v-if="!technology">暂没选择工艺</el-tag>
                                    <el-tag @click="onClickTechnology" v-else>{{ technology }}</el-tag>
                                </el-form-item>
                                <el-form-item label="工单号" prop="barcode">
                                    <div class="flex">
                                        <order-input v-model="form.barcode" :search="false" @scann="onScann"
                                            ref="orderEl">
                                        </order-input>
                                    </div>
                                </el-form-item>

                                <el-form-item label="相关工艺" prop="technology">
                                    <el-tag type="danger" v-if="!scanResult.orderid && !scanResult.msg">请先输入工单号</el-tag>

                                    <el-tag type="danger" v-else-if="scanResult.msg">{{ scanResult.msg }}</el-tag>

                                    <el-radio-group v-model="form.technology" v-else>
                                        <el-radio v-for="(item, index) in scanResult.technology" :key="item.id"
                                            :label="index" :border="true">{{ item.seq }}-{{ item.name }}</el-radio>
                                    </el-radio-group>


                                </el-form-item>

                                <el-form-item label="具体工艺" prop="after" v-if="afterArr.length">

                                    <el-radio-group v-model="form.after" size="default">
                                        <el-radio v-for="item in afterArr" :key="item" :label="item" :border="true">{{
                item
            }}</el-radio>
                                    </el-radio-group>

                                </el-form-item>


                                <el-form-item label="完工机台" prop="match.state" v-if="isMoreMatch">
                                    <el-radio-group v-model="form.match.state" size="default">
                                        <el-radio :label="0" :border="true">部分机台</el-radio>
                                        <el-radio :label="1" :border="true">全部机台</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="机台号" prop="match.no" v-if="scanResult.orderid">
                                    <el-checkbox-group v-model="form.match.no" size="default">
                                        <el-checkbox v-for="item in matchList" :key="item" :label="item"
                                            :border="true" />
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item label="完工数量" prop="count">
                                    <div class="flex ">
                                        <el-input v-model="form.count" type="number" :disabled="disabled"></el-input>
                                        <el-button class="ml-10px" @click="onClickAllCount" :disabled="disabled"
                                            v-if="!isMoreMatch">全部</el-button>
                                    </div>
                                </el-form-item>

                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :disabled="disabled" :loading="submitLoading"
                                    @click="onClickSubmit">提交</el-button>
                            </div>

                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                            <template #extra>
                                <div>
                                    <el-tag type="danger">下一工序：{{ form.next }}</el-tag>
                                </div>
                                <div class="mt-10px">
                                    <el-button type="primary" @click="onClickResume">继续刷单</el-button>
                                </div>
                            </template>
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


        <popDialog title="选择工艺" width="80%" class="technology-dialog" v-model="technologyDialog.show"
            :disabledCancel="!technology" :disabledConfirmButton="!technologyDialog.select" @confirm="onDialogConfirm">
            <div class>
                <el-radio-group v-model="technologyDialog.select">
                    <el-radio v-for="item in technologyArr.arr.value" :key="item" :label="item" size="default">{{ item
                        }}</el-radio>
                </el-radio-group>
            </div>
        </popDialog>
    </div>
</template>

<script setup lang="ts">


import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js";





import orderInput from "global@/orderInput/index.vue"
import popDialog from "global@/popDialog/index.vue"



import { MessageBoxWarning, MessageBoxError } from "@/utils/elementLib"
import { ElMessage, ElMessageBox } from 'element-plus'

import { technologyArr } from "./data";

import { scan, Submit } from "@/api";



const ddd = $ref('ontouchstart' in document);

const isPc = $computed(()=>{
    return !window.dingtalk || !window.dd || window.dd.pc;
});



let technology = (() => {
    let tempValue = $ref("");
    return computed({
        get() {

            if (!tempValue) {
                tempValue = technologyArr.storage.get();
            }

            return tempValue;
        },
        set(value) {
            technologyArr.storage.set(value);
            tempValue = value;
        }
    })

})();

/** 工艺弹窗 */
const technologyDialog = $ref({
    show: !technology.value,
    select: "",
});



/** 机器列表 */
const matchList = $ref<string[]>([]);
/** 扫描返回的结果 */
let scanResult = $ref({
    technology: []
} as any as apiScan);


const form = $ref({
    barcode: "",

    after: "",
    match: {
        no: [] as string[],
        state: -1


    },
    count: "",
    next: "",
    technology: -1,


});

/** 是否被禁用 */
const disabled = $computed(() => {
    return !!scanResult.msg || scanResult.technology.length == 0;
});

/** 选中的机器 */
const selectTechnology = $computed(() => {

    let retItem: Technology | undefined

    if (scanResult.technology.length) {
        retItem = scanResult.technology[form.technology];
    }

    return retItem;

});


/** 是否多机台 */
const isMoreMatch = $computed(() => {
    return scanResult.technology.length > 1;
})

const afterArr = $computed(() => {
    return (selectTechnology && selectTechnology.after) || []
})




let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const formEl = $ref<typeof ElForm>();
const orderEl = $ref<typeof orderInput>();
const rules = reactive<FormRules>({
    barcode: [
        { required: true, message: '请填写工单号', trigger: 'change' },
    ],
    match: [
        { type: 'array', required: true, message: '请选择机台号', trigger: 'change' },
    ],
    technology: [
        { required: true, message: '请选择机工艺', trigger: 'change' },
    ],
    count: [
        {
            validator(rule, value, callback) {

                const countInt = parseInt(value) || 0;

                let retErr: Error | undefined;
                if (!countInt) {
                    retErr = new Error("请填写完工数量");
                }

                callback(retErr);

            }
        }
    ]
});


function onDialogConfirm() {

    technology.value = technologyDialog.select;
    technologyDialog.show = false;

}

function onClickTechnology() {

    technologyDialog.select = technology.value;
    technologyDialog.show = true;


}

function onClickAllCount() {

    if (isMoreMatch) {
        MessageBoxError('多机台时，不能使用此功能');
        return;
    }

    form.count = `${scanResult.moQty - selectTechnology!.totalQty}`;
}


function onScann(value: string) {
    if (value) {
        form.barcode = value;
        onClickOrderConfirm();
    }

}


async function onClickOrderConfirm() {

    const [error, result] = await to(scan(form.barcode, technology.value));

    if (error) {
        return;
    }

    matchList.length = 0;

    if (result.technology && result.technology.length == 1) {

        const item = result.technology[0];

        form.technology = 0;

        matchList.push(item.machine);
        form.match.no.push(item.machine);

    }


    scanResult.msg = "";
    Object.assign(scanResult, result);

}



async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }

    const count = parseInt(form.count);

    if (selectTechnology!.befDoneQty > -1) {

        if (['车床二序', '车床三序'].indexOf(selectTechnology!.name) > -1) {
            if (selectTechnology!.totalQty + count > selectTechnology!.befDoneQty) {
                MessageBoxError("本次提交超出当前工序完工数量，不允许提交");
                return;
            }
        }
    }

    if (selectTechnology!.totalQty + count > scanResult.moQty) {
        try {
            await MessageBoxWarning("完工数量超出工单数量，是否继续提交？");
        } catch {
            return;
        }
    }

    let fcost = 0;
    if ((selectTechnology!.name == "简易钻攻")) {
        if (form.match.no.some((elem) => [1, 2, 4, 6, 9].includes(parseInt(elem)))) {

            try {
                const value = await ElMessageBox.prompt('清尾金额', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    inputPattern: /\d+/,
                    inputErrorMessage: '请输入数字',
                });
                fcost = parseInt(value);
            } catch {
            }

        }
    }



    try {
        submitLoading = true;


        const { barcode, match, after } = form;

        const { id } = selectTechnology!;

        const sendData = {
            wcname: technology.value,
            woid: id,
            count,
            fcost,
            after,
            match: {
                no: match.no[0],
                state: match.state
            }
        };

        const result = await Submit(barcode, sendData);

        form.next = result.next;

        submitDone = true;

    } catch (error: any) {


    } finally {
        submitLoading = false;
    }




}


function onClickResume() {


    formEl.resetFields();
    orderEl.clear();

    submitDone = false;
    scanResult = {
        technology: []
    } as any as apiScan;


}



async function init() {

    try {

        initLoading = true;


    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref("日产能登记");

export default {
    name: "",
    title
}
</script>

<style lang="scss">
#declare {

    .testscrollList {
        background-color: white;
        z-index: 99;
    }


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

            .el-form-item.type {
                .el-tag {
                    cursor: pointer;
                }
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
        height: 100%;
        width: 100%;
        z-index: 99;

        * {
            user-select: none !important;
        }

    }

}

.technology-dialog {
    .el-button {
        margin-bottom: 10px;
        margin-right: 10px;
    }
}
</style>

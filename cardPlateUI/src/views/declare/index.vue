<template>
    <div id="declare" 
        class="w-full h-full flex flex-col flex items-center overflow-hidden"
        v-loading="loading"
        element-loading-text="获取数据"
        element-loading-background="rgba(122, 122, 122, 0.8)"
    >

        <div class="declare-view w-full" ref="declareView">
            <h3 class="title">{{ title }}</h3>

            <el-tabs v-model="tabValue" type="border-card" class="my-10px" @tab-change="onTabChange">
                <el-tab-pane label="外借" name="loan"></el-tab-pane>
                <el-tab-pane label="归还" name="return" @click.stop></el-tab-pane>

                <el-form :model="form" :rules="rule" :hide-required-asterisk="true" label-width="auto" ref="formEl">

                    <el-form-item label="工单单号" prop="order">
                        <div class="flex w-full">
                            <span>{{ form.order }}</span>
                        </div>
                    </el-form-item>

                    <el-form-item label="客户" v-if="orderInfo.cust.length" prop="custid" >
                        <el-select v-model="form.custid" style="width: 240px" :disabled="!!supid">
                            <el-option 
                                v-for="item in orderInfo.cust"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id" >

                                <div class="flex justify-between">
                                    <span>{{ item.name }} </span>
                                    <span>{{ item.process }}</span>
                                </div>

                            </el-option >
                        </el-select>
                    </el-form-item>

                    <template v-if="tabValue">

                        <el-form-item label="卡板" prop="pallet">
                            <el-input v-model="form.pallet" placeholder="请输入外借数量" type="number"
                                :disabled="submitDisabled && disableInput"></el-input>
                        </el-form-item>

                        <el-form-item label="铁桶" prop="bucket">
                            <el-input v-model="form.bucket" placeholder="请输入外借数量" type="number"
                                :disabled="submitDisabled && disableInput"></el-input>
                        </el-form-item>

                        <template v-if="!disableEditor">

                            <el-form-item :label="actionTable[(action as keyof typeof actionTable)].placeholder + '卡板'"
                                prop="eitdorPallet">
                                <el-input v-model="form.eitdorPallet" :placeholder="placeholder"
                                    type="number"></el-input>
                            </el-form-item>
                            <el-form-item :label="actionTable[(action as keyof typeof actionTable)].placeholder + '铁桶'"
                                prop="eitdorBucket">
                                <el-input v-model="form.eitdorBucket" :placeholder="placeholder"
                                    type="number"></el-input>
                            </el-form-item>

                        </template>

                    </template>

                </el-form>
            </el-tabs>

            <div class="flex-col button-area " v-if="tabValue">
                <div class="flex" v-if="!isFirst && isLoan">
                    <el-button type="primary" @click="onClickEditor(1)" v-if="disableEditor">修改</el-button>
                    <el-button type="success" @click="onClickAdd" v-if="disableEditor">追加</el-button>
                    <el-button type="primary" @click="onSubmitLoan" :disabled="submitSuccess"
                        v-if="!disableEditor">提交</el-button>
                </div>

                <template v-if="isShowSubmit">

                    <template v-if="!submitDone">
                        <el-button type="primary" :disabled="submitDisabled" @click="onSubmitLoan"
                            v-if="tabValue === actionEnum.loan">提交</el-button>
                        <el-button type="primary" :disabled="submitDisabled" @click="onSubmitReturn"
                            v-else>提交</el-button>
                    </template>
                    <el-button type="success" :disabled="true" v-else>提交成功</el-button>

                </template>

            </div>

            <div v-if="!tabValue">

                <div class="flex justify-center">
                    <div class="icon-warp" @click="onClickWrap(actionEnum.loan)">
                        <icon />
                        <span>外借</span>
                    </div>
                    <div class="icon-warp" @click="onClickWrap(actionEnum.return)">
                        <icon style="transform: rotateY(180deg)" />
                        <span>归还</span>
                    </div>
                </div>

                <el-result icon="error" sub-title="请通过扫描二维码进入本页面" v-if="!form.order">
                </el-result>

            </div>

            <el-result icon="success" title="提交成功" v-if="showResult"></el-result>

        </div>

        <div class="step-view flex-1 w-full" ref="stepView" v-if="tabValue === 'return'">
            <el-table :data="stepTableData" border class="w-full" :max-height="tabHeight" :current-row-key="'backid'">
                <el-table-column prop="createdate" label="时间" width="100" align="center">
                    <template #default="{ row }">
                        <span>{{ parseTime(row.createdate) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="姓名" width="80" align="center" />
                <el-table-column prop="pallet" label="卡板" width="55" align="center" />
                <el-table-column prop="bucket" label="铁桶" width="55" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-popconfirm title="确定要删除此记录?" @confirm="onDelStep(row.backid)">
                            <template #reference>
                                <el-button type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script setup lang="ts">
import icon from "./icon.vue"

import to from "await-to-js"
import type { FormInstance, FormRules } from 'element-plus'

import { ElMessage } from "element-plus"
import { messageError } from "@/utils/elementLib"

import { getOrderInfo, getStep, delStep, submitLoan, submitReturn } from "@/api"
import { strToInt, getNum, parseTime } from "@/utils/other"
import getSearch from "@/utils/urlSearch"



enum actionEnum {
    /** 外借 */
    loan = "loan",
    /** 编辑外借数量 */
    editor = "editor",
    /** 追加外借数量 */
    add = "add",
    /** 归还 */
    return = "return",
}


let actionTable: {
    [key in actionEnum]: {
        action: number,
        placeholder: string,
        status: string
    }
} = {
    [actionEnum.return]: {
        action: 0,
        placeholder: "归还",
        status: "归还"
    },
    [actionEnum.loan]: {
        action: 0,
        placeholder: "外借",
        status: "外借"
    },
    [actionEnum.editor]: {
        action: 0,
        placeholder: "修改",
        status: "修改外借数量"
    },
    [actionEnum.add]: {
        action: 2,
        placeholder: "追加",
        status: "追加外借数量"
    }
}



let loading = $ref(false);
let submitDone = $ref(false);
let getOneStep = false;
let tabValue = $ref("");
const stepTableData = $ref<Awaited<ReturnType<typeof getStep>>>([]);



let orderInfo = $ref<Awaited<ReturnType<typeof getOrderInfo>>>({
    orderid: "",
    isback: false,
    pallet: 0,
    bucket: 0,
    custname: "",
    cust: [] 
});

const formEl = $ref<FormInstance>();
const form = $ref({
    order: "",
    pallet: "",
    bucket: "",

    eitdorPallet: "",
    eitdorBucket: "",

    custid: ""
});


/** 是否提交成功 */
let submitSuccess = $ref(false);

let stepView = $ref<HTMLDivElement>();
let declareView = $ref<HTMLDivElement>();
let tabHeight = $ref(0);

/** 外借是否显示结果 */
let showResult = $ref(false);
/** 供货商ID */
let supid = $ref(getSearch("supid"));






let action = $ref<actionEnum>(actionEnum.loan);


/** 禁止修改 */
let disableEditor = $ref(true);

/** 是否首次提交 */
const isFirst = $computed(() => {
    return orderInfo.pallet == 0 && orderInfo.bucket == 0;
});

/** 是否禁止提交 */
const submitDisabled = $computed(() => {

    if (submitSuccess) {
        return true;
    }

    /** 如果没有订单信息和没有填写工单号，不给提交 */
    if (!orderInfo.orderid || !form.order || orderInfo.isback) {
        return true;
    }
    if (action == actionEnum.return) {
        /**
         * 直接返回false，归还不需要额外的处理
         */
        return false;
    } else {

        /** 
         * 如果是外借的话
         * 第一次外借的话允许提交
         * 第二次外借的话，需要用户点击编辑后才允许
         */
        return isFirst ? false : true;

    }


});

/** 是否显示提交按钮 */
const isShowSubmit = $computed(() => {

    /** 如果提交成功的话，不显示 */
    if (submitDone) {
        return false;
    }

    /** 如果是归还的话，就显示 */
    if (action == actionEnum.return) {
        return true
    } else {

        /**
         * 如果是外借的话
         * 第一次外借就显示
         * 否则的话就不显示，因为要展示修改和追加按钮
         */
        return isFirst ? true : false
    }

})

const disableInput = $computed(() => {

    /** 如果是归还的话，就显示 */
    if (action == actionEnum.return) {
        return isFirst || orderInfo.isback
    } else {
        /**
         * 如果是外借的话
         * 第一次外借就显示
         * 否则的话就不显示，因为要展示修改和追加按钮
         */
        return isFirst ? false : true
    }

})

/** 是否外借选项 */
const isLoan = $computed(() => {
    return action != actionEnum.return
})

/** 输入框的提示字符串 */
const placeholder = $computed(() => {

    const val = actionTable[(action as keyof typeof actionTable)];

    return `请输入${val ? val.placeholder : ""}数量`;
})




function onClickWrap(val: actionEnum) {
    action = tabValue = val;


    onTabChange(val);
}




function onTabChange(value: string) {

    
    if(value == "return" && !form.order.includes("-")){

        
        const params = [];
        const supid = getSearch("supid");
        params.push(`path=truckorder`);
        params.push(`orderid=${form.order}`);
        // if(supid){
        //     params.push(`supid=${supid}`);
        // }

        location.href = `https://cddgd.cn/ding/nexus/carexpense/index.html?${params.join("&")}`
        tabValue = "";

        return;
    }



    if (value == actionEnum.return && !getOneStep) {
        getOneStep = true;
        getStepList();
        setTimeout(() => {
            tabHeight = declareView.parentElement!.clientHeight - declareView.clientHeight;
        })

        form.pallet = "";
        form.bucket = "";
    }

}

function onClickEditor(newAction: number) {
    disableEditor = false;
    action = actionEnum.editor;
}

function onClickAdd() {
    disableEditor = false;
    action = actionEnum.add;

    form.eitdorPallet = "";
    form.eitdorBucket = "";
}

function validator(rule: any, value: any, callback: any) {
    if (!strToInt(value)) {
        callback(new Error("请输入大于0的数量"))
    } else {
        callback();
    }
}


const rule = $ref({
    custid: [{ required: true, message: '请选择客户', trigger: 'change' }],
    order: [{ required: true, message: '请输入工单单号', trigger: 'blur' }],
    pallet: [{ required: true, message: '请输入卡板数量', trigger: 'blur' }, {
        validator,
        trigger: 'blur'
    }],
    eitdorPallet: [{ required: true, message: '请输入卡板数量', trigger: 'blur' }, {
        validator,
        trigger: 'blur'
    }],
    bucket: [{ required: true, message: '请输入铁桶数量', trigger: 'blur' }, {
        validator,
        trigger: 'blur'
    }],
    eitdorBucket: [{ required: true, message: '请输入铁桶数量', trigger: 'blur' }, {
        validator,
        trigger: 'blur'
    }],
});


/**
 * 获取记录列表
 */
async function getStepList() {

    const [err, result] = await to(getStep());
    if (result) {
        stepTableData.splice(0, stepTableData.length, ...result)
    }

}

/**
 * 提交删除记录
 * @param id 
 */
async function onDelStep(id: number) {

    const [err, result] = await to(delStep(id));
    if (result) {
        getStepList();
        onGetInfo();
        ElMessage.success("删除记录成功");
    }

}

/**
 * 获取工单外借信息
 */
async function onGetInfo() {
    // const orderValidate = await to(formEl.validateField("order"));
    // if (orderValidate[0]) {
    //     return
    // }

    loading = true;

    submitSuccess = false;

    const { order } = form;
    const [err, result] = await to(getOrderInfo(order));
    if (result) {
        orderInfo = result;


        if(orderInfo.cust.length == 1){

            form.custid = orderInfo.cust[0].id as any; 

        }else{

            const item = orderInfo.cust.find((elem) => (elem.id == supid ||  elem.current));
            if(item){
                form.custid = item.id as any; 
            }

        }


        nextTick(() => {
            if (!isFirst && action != actionEnum.return) {
                form.eitdorPallet = form.pallet = `${result.pallet}`;
                form.eitdorBucket = form.bucket = `${result.bucket}`;
            }
        })
    } else {
        orderInfo.orderid = "";
        form.pallet = "";
        form.bucket = "";
    }


    loading = false;
}

async function onSubmit(submit: any) {


    if (action == actionEnum.return || isFirst) {
        const validate = await to(formEl.validate());

        if (validate[0]) {
            const errorKey = Object.keys(validate[0]);
            if (errorKey.length > 1 || errorKey.indexOf("order") > -1) {
                return false;
            } else {
                formEl.clearValidate("pallet");
                formEl.clearValidate("bucket");
            }
        }
    } else {

        const errValidate = await to(formEl.validateField(["eitdorPallet", "eitdorBucket"]));

        if (errValidate[0]) {
            const errorKey = Object.keys(errValidate[0]);
            if (errorKey.length > 1 || errorKey.indexOf("order") > -1) {
                return false;
            } else {
                formEl.clearValidate("eitdorPallet");
                formEl.clearValidate("eitdorBucket");
            }
        }

    }



    let { order, pallet, bucket } = form;

    if (action != actionEnum.return && !isFirst) {
        pallet = form.eitdorPallet;
        bucket = form.eitdorBucket;
    }


    const [err, resut] = await to(submit(order, getNum(pallet), getNum(bucket), supid));
    if (err) {
        return false;
    }

    ElMessage.success("提交成功");
    submitSuccess = true;

    return true;
}

/** 外借提交 */
async function onSubmitLoan() {
    const result = await onSubmit((...args: any[]) => {

        const val = actionTable[(action as keyof typeof actionTable)];
        args.push((val && val.action) || 0);

        return submitLoan.apply(submitLoan, args as any).then((result: any) => {
            showResult = true;
            return result;
        })
    })
}

/** 归还提交 */
async function onSubmitReturn() {
    const result = await onSubmit(submitReturn)

    if (result) {
        getStepList();
        onGetInfo();
    }
}


onMounted(() => {

    const order = getSearch("order");
    if (order) {
        form.order = order;
        nextTick(() => {
            onGetInfo();
        })
    }

})



</script>

<script lang="ts">
const title = "发货卡板登记";

export default {
    name: "",
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

    .el-tabs--border-card>.el-tabs__content {
        padding: 10px;
    }

    .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        background-color: #66b1ff;
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


    .el-result {
        position: absolute;
        left: 0;
        right: 0;
        top: 65px;
        height: 100%;
        background: white;

    }

}
</style>

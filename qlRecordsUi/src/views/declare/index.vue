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

                                <el-form-item label="条码" prop="tissue" v-if="false">
                                    <el-tag>{{ form.seq }}</el-tag>
                                </el-form-item>

                                <el-form-item label="工单号">
                                    <el-tag>{{ scanResult.orderid }}</el-tag>
                                </el-form-item>

                                <el-form-item label="规格">
                                    <span>{{ scanResult.spec }}</span>
                                </el-form-item>
                                <el-form-item label="状态" class="status-item">


                                    <el-tag v-if="initLoading">正在查询</el-tag>

                                    <el-tag type="danger" v-else-if="scanResult.errmsg">{{ scanResult.errmsg }}</el-tag>
                                    <el-tag type="warning" v-else-if="scanResult.status == 0">暂未登记缺料</el-tag>
                                    <el-tag type="success" v-else>已登记缺料</el-tag>

                                </el-form-item>

                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="submitLoading" @click="onClickSubmit"
                                    :disabled="isError" v-if="!isRecords">提交登记</el-button>

                                <el-button type="warning" v-if="isRecords" @click="onClickCancel">取消登记</el-button>
                            </div>

                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                            <template #extra>
                                <div class="flex items-center">
                                    <span>{{ successTitle }}：</span>
                                    <el-tag>{{ scanResult.setSpec }}</el-tag>
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
    </div>
</template>

<script setup lang="ts">


import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'


import orderInput from "global@/orderInput/index.vue"


import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js";

import getSearch from "@/utils/urlSearch"
import { queryOrder, submitData } from "@/api"


/** url参数的规格 */
const paramsSpec = $ref({

    w: getSearch("w"),
    h: getSearch("h"),
    l: getSearch("l")

} as specType)


/** 扫描结果 */
const scanResult = $ref({

    orderid: "",
    status: -1,
    errmsg: "",
    spec: undefined,
    type: parseInt(getSearch("type")) || 1,
    setSpec: ""

} as orderResult)


const scanTitle = $computed(() => {

    let typeStr = "";
    if (scanResult.type == 1) {
        typeStr = "缺料"
    } else {
        typeStr = "满料"
    }
    return typeStr

})


const title = $computed(() => {

    return `${scanTitle}登记`

});

const successTitle = $computed(() => {

    return `${scanTitle}规格`


});



const specStr = $computed(() => {

    const retArr = [] as any[];

    if (isEmptySpec) {
        retArr.push(scanResult.spec!.w, scanResult.spec!.h, scanResult.spec!.l)
    } else {
        retArr.push(paramsSpec.w, paramsSpec.h, paramsSpec.l);
    }

    return retArr.join("*");
})




const form = $ref({
    seq: getSearch("seq"),
});

let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    seq: [
        { required: true, message: '请先扫描条码', trigger: 'change' },

    ]
});

const isError = computed(() => {
    return !!scanResult.errmsg;
});

/** 是否为空的URL参数规格 */
const isEmptySpec = $computed(() => {
    return !paramsSpec.w || !paramsSpec.h || !paramsSpec.l
})



/** 是否已经登记 */
const isRecords = $computed(() => {
    return scanResult.status >= 1;
})

/** 是否显示状态标签 */
const isShowStatus = $computed(() => {

    return scanResult.status != -1 || !!scanResult.errmsg

})




async function scanQuery() {

    try {

        submitLoading = true;

        let spec: specType | undefined = undefined;

        if (!isEmptySpec) {
            spec = paramsSpec
        }

        const sedData = {
            spec,
            seq: form.seq
        }

        const result = await queryOrder(sedData);

        Object.assign(scanResult, result);


    } catch {



    } finally {

        submitLoading = false;

    }

}

async function submitQuery(status: number) {

    let retVal = false;
    try {

        submitLoading = true;

        let spec: specType | undefined = undefined;

        if (!isEmptySpec) {
            spec = paramsSpec
        }

        const sendData = {
            seq: form.seq,
            spec,
            status
        };


        const result = await submitData(sendData);

        retVal = result.status;
        scanResult.setSpec = result.spec

        if (!retVal) {

            ElMessageBox.confirm(
                result.errmsg,
                "错误",
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                    center: true,
                    showCancelButton: false
                }
            );

        }


    } catch {



    } finally {

        submitLoading = false;

    }

    return retVal;


}

async function onClickCancel() {

    /** 1=登记缺料, 2=取消登记. */
    const result = await submitQuery(2);
    if (result) {
        submitDone = true;
    }


}


async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }

    /** 1=登记缺料, 2=取消登记. */
    const result = await submitQuery(1);
    if (result) {

        submitDone = true;

    }

}


async function init() {

    try {

        initLoading = true;

        if (form.seq || !isEmptySpec) {
            await scanQuery();

            /** 类型 = 缺料 */
            if (scanResult.type == 1) {

                /** 如果已经登记过缺料 */
                if (isRecords) {

                    /** 直接完成 */
                    submitDone = true;

                } else {

                    /** 直接提交 */
                    await onClickSubmit()

                }

            } else {

                /** 类型 = 满料 */

                await onClickCancel();

                // if (isRecords) {

                //     await onClickCancel();

                // } else {

                //     /** 直接完成 */
                //     submitDone = true;
                // }

            }

        } else {
            initError = true;
        }


    } catch {
        initError = true;
    } finally {
        initLoading = false;
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

            .status-item {

                position: relative;

                .el-tag {
                    position: absolute;
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
</style>

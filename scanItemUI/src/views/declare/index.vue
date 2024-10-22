<template>
    <div id="declare">
        <div class="declare-view">

            <h3 class="title">{{ title }}</h3>

            <el-form :model="form" :rules="rules" ref="formEl" :hide-required-asterisk="true">
                <el-form-item label="工单单号" prop="moid">
                    <div style="display:flex;width: 100%;">
                        <el-input v-model="form.moid" :disabled="true" />
                        <!-- <el-button style="flex:1;margin-left: 10px;" v-blur @click="onGetProcess"
                            :disabled="disabledSubmit">获取</el-button> -->
                    </div>
                </el-form-item>
                <el-form-item label="工单流程" prop="select">

                    <template v-for="(item) in selectItem">
                        <el-radio label="true" v-model="doneModel" disabled :key="item.process" v-if="item.done"
                            ref="doneProcess">{{
                                item.process
                            }}</el-radio>
                    </template>

                    <el-radio-group v-model="form.select" v-if="selectItem.length" ref="prepareProcess">
                        <template v-for="(item, index) in selectItem">
                            <el-radio :label="index" :key="item.process" v-if="!item.done">{{ item.process }}</el-radio>
                        </template>
                    </el-radio-group>

                    <el-tag type="warning" v-else>请先填写工单单号</el-tag>
                </el-form-item>

                <template v-if="isEndProcess">
                    <el-form-item label="仓库库位" prop="rack">
                        <el-select v-model="form.rack" placeholder="选择存放库位" @change="onRackChange">
                            <el-option v-for="(item, index) in rackList" :key="index" :label="item.rackname"
                                :value="item.rackid" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="存放位置" prop="stid">
                        <el-select v-model="form.stid" placeholder="选择库位位置">
                            <el-option v-for="item in rackStoreList" :key="item.stid" :label="item.stname"
                                :value="item.stid" />
                        </el-select>
                    </el-form-item>
                </template>


                <el-form-item label="提交状态" v-if="submitResult">
                    <el-tag type="success" v-if="submitResult.success">{{ submitResult.result }}</el-tag>
                    <el-tag type="danger" v-else>{{ submitResult.result }}</el-tag>
                </el-form-item>

            </el-form>

            <div class="button-area">

                <el-button type="primary" @click="onClickSubmit" :disabled="disabledSubmit" v-blur
                    v-if="form.moid && !submitResult">提交</el-button>
                <el-button type="primary" @click="onClickScan" v-blur v-else>扫描</el-button>
            </div>

            <div class="info-table">
                <info-table />
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import to from "await-to-js"
import type { FormInstance, FormRules } from 'element-plus'

import { ElMessage } from "element-plus"
import { getProcess, Submit, getRackList, getRackStore } from "@/api"
import getSearch from "@/utils/urlSearch"
import { scanning } from "@/utils/other"

import infoTable from "./infoTable.vue"
import data from "@/store/data"




const form = $ref({
    moid: "",
    select: -1,
    rack: "",
    stid: "",
});


let submitResult = ref<submitResult>();
let disabledSubmit = $ref(false);

const selectItem = $ref<any[]>([]);
const rackList = $ref<any[]>([]);
const rackStoreList = $ref<any[]>([]);

const doneModel = $ref("true");
const doneProcess = $ref<any[]>();
const prepareProcess = $ref<any>();




const formEl = $ref<FormInstance>();
const selectProcess = $computed(() => {
    return selectItem && selectItem[form.select];
})

const isEndProcess = $computed(() => {

    return false;

    // return selectItem.filter((elem) => {
    //     return !elem.done
    // }).length == 1;

})


// select m.seq, m.ty, m.ordid   from erp_mat_line m  where  m.isdeal and m.id>0 order by create_date desc
// 测试查询语句，用seq 后面加上W

const rules = $ref({
    moid: [{
        required: true,
        message: '请填写工单号',
        trigger: 'blur'
    }],
    select: [{
        validator(rule: any, value: any, callback: any) {
            if (!form.moid || !!selectProcess) {
                callback();
            } else if (selectItem.length == 0) {
                callback(new Error("请先获取工单流程"))
            } else {
                callback(new Error("请选择工单流程"))
            }
        }
    }],
    rack: [{
        validator(rule: any, value: any, callback: any) {
            if (isEndProcess) {
                if (!value) {
                    return callback(new Error("请选择存放库位"))
                }
            }
            callback();
        }
    }],
    stid: [{
        validator(rule: any, value: any, callback: any) {
            if (isEndProcess) {
                if (!value) {
                    return callback(new Error("请选择库位位置"))
                }
            }
            callback();
        }
    }],




});

watch($$(disabledSubmit), (value) => {
    if (!value) {
        return;
    }

    submitResult.value = {
        orderid: "",
        success: true,
        result: "已经全部完成"
    }

})

async function onGetProcess() {
    const [validate] = await to(formEl.validateField("moid"));
    if (validate) {
        return;
    }

    const proceeItem = await getProcess(form.moid);
    if (proceeItem.length == 0) {
        ElMessage.error("当前工单不存在");
        return;
    }

    const noDone = proceeItem.findIndex((elem) => !elem.done);
    selectItem.splice(0, selectItem.length, ...proceeItem);

    if (isEndProcess) {
        const rackItem = await getRackList();
        rackList.splice(0, rackList.length, ...rackItem);
    }
    if (noDone > -1) {
        nextTick(() => {
            form.select = noDone;

            if (doneProcess) {

                [...doneProcess].reverse().forEach((elem) => {
                    prepareProcess.$el.insertBefore(elem.$el, prepareProcess.$el.firstElementChild);
                })

            }
        })

    } else {
        disabledSubmit = true;
    }




    formEl.resetFields("select");

    form.moid = proceeItem[0].orderid;
}

async function onRackChange(value: string) {
    const storeList = await getRackStore(value);

    rackStoreList.splice(0, storeList.length, ...storeList);

    form.stid = "";
}


async function onClickSubmit() {
    const [validate] = await to(formEl.validate());
    if (validate) {
        return;
    }

    const { seq, process } = selectProcess;
    const { stid } = form;


    const result = await Submit(seq, process, stid);


    data.list.push({
        order: form.moid,
        process: process,
        result: result.result
    });



    submitResult.value = result;
}

function onClickReset() {

    submitResult.value = undefined;

    selectItem.splice(0, selectItem.length);

    form.moid = "";
    form.select = -1;

    disabledSubmit = false;

}

function onClickScan() {
    scanning().then((result) => {



        if (/https?:\/\//.test(result)) {
            location.href = result;
        } else {

            onClickReset();
            form.moid = result;
            onGetProcess();

        }


    })


}

onMounted(() => {

    form.moid = getSearch("moid") || form.moid;
    if (form.moid) {
        onGetProcess();
    }

})

</script>

<script lang="ts">
const title = "精创工艺扫描";

export default {
    name: "",
    title
}
</script>

<style lang="scss">
#declare {
    flex: 1;

    .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: #66b1ff;
    }

    .declare-view {
        position: relative;
        height: 100%;

        padding-top: 5px;
        max-width: 800px;
        padding-bottom: 10px;
        margin: auto;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;


    }

    .el-result {
        max-width: 800px;
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        position: relative;
        padding: 10px;
        height: 300px;

    }


    .el-input__inner[disabled] {

        color: #999 !important;
        -webkit-text-fill-color: #999 !important;
        opacity: 1 !important;

    }

    .declare_header.title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: white;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: rgb(102, 177, 255);
    }

    form {
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        position: relative;
        padding: 10px;

        &.grouperror {
            height: 350px;
        }

        .el-result {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(255, 255, 255);
        }

        .el-select {
            * {
                user-select: none;
            }
        }

        .time-input {
            &>.el-form-item__label-wrap {
                display: none;
            }
        }

        .result .el-tag__content {
            font-size: 20px;
        }

        .el-radio__input,
        .el-radio__label,
        .el-tag {
            font-size: 20px;
        }
    }

    .fun-area {
        .el-button {
            margin: auto;
            display: inherit;
            margin-top: 20px;
            width: 100%;
            height: 100%;
        }
    }


    .upload {

        .el-upload,
        .el-upload-list__item-actions,
        .el-upload-list li {
            height: 80px;
            width: 80px;
            line-height: 80px;
        }

        .el-icon-plus {
            font-size: 20px;
        }
    }

    textarea {
        height: 100px;
        resize: none;
    }

    .el-result {
        z-index: 999;
    }

    .button-area {
        margin: 10px 0px;
        display: flex;

        button {
            width: 100%;
        }
    }


    .scann-table {
        flex: 1;
    }

    .info-table{
        flex: 1;
        overflow: hidden;
    }


}
</style>

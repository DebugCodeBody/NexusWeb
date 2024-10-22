<template>
    <div id="declare">
        <div class="declare-view">
            <h3 class="title">{{ title }}</h3>
            <el-form :model="form" :rules="rules" ref="formEl" :hide-required-asterisk="true">
                <el-form-item label="起点" prop="selectAddress">
                    <div style="display: flex; width: 100%;">
                        <el-select v-model="selectAddress">
                            <el-option v-for="item in allAddress" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                        <el-button type="primary" style="margin-left: 10px;" @click="onClickToView('addorigin')">添加</el-button>
                        <el-button type="warning" style="margin-left: 10px;" @click="onClickToView('editorigin')" :disabled="allAddress.length == 0">编辑</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="终点" prop="destinations">
                    <div style="display: flex; width: 100%;">
                        <el-input v-model="form.destinations"></el-input>
                        <el-button type="primary" style="margin-left: 10px;" @click="onClickDistance">获取距离</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div style="margin-top: 10px; flex: 1;" ref="tableDiv">
                <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
                    <el-table-column label="序号" width="80" type="index" align="center" />
                    <el-table-column prop="name" label="地址" />
                    <el-table-column prop="distance" label="距离" width="100" align="center" />
                </el-table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import to from "await-to-js"
import type { FormInstance, FormRules } from 'element-plus'

import { ElMessage } from "element-plus"

import { getAddressAll, distance } from "@/api/address"
import { selectAddress, allAddress } from "@/store/data"


const tableData = $ref<any[]>([]);
let tableHeight = $ref(100);

const tableDiv = $ref<HTMLDivElement>();

const form = $ref({
    destinations: ""
});
const rules = $ref({
    selectAddress: [{
        validator(rule: any, value: any, callback: any){
            if(selectAddress.value == ""){
                callback(new Error("请选中起点地址"))
            }else{
                callback()
            }
        }
    }],
    destinations: [{
        required: true,
        message: "请填写目的地址",
        trigger: 'blur'
    }]
});

const formEl = $ref<FormInstance>();

async function onClickDistance() {
    const [validateErr] = await to(formEl.validate());
    if (validateErr) {
        return;
    }

    const response = await distance(parseInt(selectAddress.value), form.destinations);

    tableData.splice(0, tableData.length, ...response.point);

}

function onClickToView(path:string){
    window.toView(path);
}

onMounted(() => {

    nextTick(() => {
        tableHeight = tableDiv.clientHeight;
    })

})


</script>

<script lang="ts">

const title = "地图距离计算";

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


}
</style>

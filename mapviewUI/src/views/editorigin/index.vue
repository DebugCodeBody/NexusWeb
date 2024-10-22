<template>
    <div id="declare">
        <div class="add-origin-view">
            <h3 class="title">{{ title }}</h3>
            <el-form :model="form" :rules="rules" ref="formEl" :hide-required-asterisk="true" label-width="auto">
                <el-form-item label="起点">
                    <div style="display: flex; width: 100%;">
                        <el-select v-model="selectAddress" @change="onSelectChange">
                            <el-option v-for="item in allAddress" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                        <el-button type="danger" style="margin-left: 10px;" @click="onClickDle">删除</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="名字" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="详细地址" prop="detailed">
                    <el-input v-model="form.detailed" type="textarea" />
                </el-form-item>
                <el-form-item label="高德坐标" prop="gaode">
                    <el-select v-model="form.gaode.select">
                        <el-option v-for="(item, index) in form.gaode.list" :key="item.location" :label="item.name"
                            :value="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="百度坐标" prop="baidu">
                    <el-select v-model="form.baidu.select">
                        <el-option v-for="(item, index) in form.baidu.list" :key="item.location" :label="item.name"
                            :value="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="腾讯坐标" prop="tencent">
                    <el-select v-model="form.tencent.select">
                        <el-option v-for="(item, index) in form.tencent.list" :key="item.location" :label="item.name"
                            :value="index" />
                    </el-select>
                </el-form-item>

            </el-form>
            <div class="function-button">
                <el-button type="primary" @click="onClickSearch">获取坐标</el-button>
                <el-button style="margin-top: 10px;" @click="onClickAdd">提交修改</el-button>
                <el-button style="margin-top: 10px;" @click="onClickReturn">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import to from "await-to-js"
import type { FormInstance, FormRules } from 'element-plus'

import { ElMessage, ElMessageBox } from "element-plus"

import { search, updateAddress, delectAddress } from "@/api/address"
import platform from "./platform"

import { selectAddress, allAddress, getAcquire } from "@/store/data"

const form = $ref({
    name: "",
    detailed: "",
    gaode: new platform(),
    baidu: new platform(),
    tencent: new platform()
});

const rules = $ref({
    detailed: [{
        required: true,
        message: "请填写详细地址",
        trigger: 'blur'
    }],
    name: [{
        required: true,
        message: "请填写名字",
        trigger: 'blur'
    }],
    gaode: [{
        validator(rule: any, value: any, callback: any) {
            if (value.select == undefined) {
                callback(new Error("请选中高德坐标"));
            } else {
                callback();
            }
        }
    }],
    baidu: [{
        validator(rule: any, value: any, callback: any) {
            if (value.select == undefined) {
                callback(new Error("请选中百度坐标"));
            } else {
                callback();
            }
        }
    }],
    tencent: [{
        validator(rule: any, value: any, callback: any) {
            if (value.select == undefined) {
                callback(new Error("请选中腾讯坐标"));
            } else {
                callback();
            }
        }
    }],
});

const formEl = $ref<FormInstance>();

const selectAddValue = $computed(() => {
    return allAddress.find((elem) => elem.id === selectAddress.value)!;
})

function onSelectChange() {

    if (!selectAddValue) {
        form.name = form.detailed = "";
    } else {
        form.name = selectAddValue.name;
        form.detailed = selectAddValue.detailed;
    }

    form.gaode.reset();
    form.baidu.reset();
    form.tencent.reset();

}

async function onClickSearch() {

    const [validateErr] = await to(formEl.validateField("detailed"));
    if (validateErr) {
        return;
    }

    const response = await search(form.detailed);

    response.forEach((elem: any) => {

        const { type, result } = elem;

        const typePlatform = (form as any)[type];

        typePlatform.addResult(result);

        if (result.length == 1) {
            typePlatform.select = 0;
        }

    });

}

async function onClickAdd() {
    const [validateErr] = await to(formEl.validate());
    if (validateErr) {
        return;
    }

    let { name, detailed } = form;
    const locationTable = {
        gaode: form.gaode.getLocation(),
        baidu: form.baidu.getLocation(),
        tencent: form.tencent.getLocation()
    };

    await updateAddress(selectAddress.value, name, detailed, locationTable);

}

function onClickReturn() {
    window.toView("");
}

async function onClickDle() {
    const [enquire] = await to(ElMessageBox.confirm(
        '是否删除当前起点?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ))
    if (enquire) {
        return;
    }

    await delectAddress(selectAddress.value);

    getAcquire().then(() => {
        onSelectChange();
    });


}

onMounted(() => {
    onSelectChange();
})


</script>

<script lang="ts">

const title = "编辑起点地址";

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

    .add-origin-view {
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

    .add-origin-view {
        .el-select {
            width: 100%;
        }
    }

    .function-button {

        margin-top: 20px;

        .el-button {
            width: 100%;
        }

        .el-button+.el-button {
            margin-left: 0;
        }
    }


}
</style>

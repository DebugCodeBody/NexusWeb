<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{title}}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content flex flex-col justify-between">
                    <div class="relative">
                        <div class="p-5px">
                            <el-form :model="form" :hide-required-asterisk="true" :rules="rules" label-width="auto"
                                ref="formEl">
                                <div>
                                    申报人员：{{handle.createname}} {{ handle.createdate }}
                                </div>
                                <div>
                                    设备名字：{{handle.typename}}
                                </div>
                                <div>
                                    问题类型：{{handle.typename}}
                                </div>
                                <div  v-if="handle.memo">
                                    问题描述：{{handle.memo}}
                                </div>
                                <el-form-item label="留言" prop="memo" class="mt-10px">
                                    <el-input v-model="form.memo" type="textarea"></el-input>
                                </el-form-item>
                                
<!--                                 
                                <el-form-item label="申报人员">
                                    <span>{{ handle.createname }}</span>
                                </el-form-item>
                                <el-form-item label="申报时间">
                                    <span>{{ handle.createdate }}</span>
                                </el-form-item>
                                <el-form-item label="问题类型">
                                    <span>{{ handle.typename }}</span>
                                </el-form-item>
                                <el-form-item label="问题描述" v-if="handle.memo">
                                    <span>{{ handle.memo }}</span>
                                </el-form-item>
                                <el-form-item label="处理类型">
                                    <el-tag type="warning" effect="dark" v-if="form.result == 1">收到</el-tag>
                                    <el-tag type="primary" effect="dark" v-else>完成</el-tag>
                                </el-form-item> -->

                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button :loading="submitLoading" :style="buttonStyle" @click="onClickSubmit">{{buttonTile}}</el-button>
                            </div>
                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                        </el-result>
                        <el-result v-if="initError" icon="error" class="error-result">
                            <template #extra>
                                <el-tag type="danger">请通过群卡片点击进入</el-tag>
                            </template>
                        </el-result>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js";

import urlList from "./urlList.vue"
import getSearch from "@/utils/urlSearch"
import { getUserName } from "@/store/user"
import { getView, submitRecover } from "@/api"


const form = $ref({

    id: getSearch("id"),

    result: parseInt(getSearch("result")) || 1,

    /** 问题描述 */
    memo: ""

});

const handle = $ref({
    id: 0,
    memo: "",
    typename: "",
    createdate: "",
    createname: "",
});


let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    memo: [

    ]
});

const buttonStyle = $computed(()=>{
    
    const color = form.result == 1 ? "rgb(255,82,25)" : "rgb(0,127,255)";

    return {
        'background-color': color,
        "color": "white"
    }

});
const buttonTile = $computed(()=>{
    return form.result == 1 ? "收到" : "完成";
})



async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }

    try {

        submitLoading = true;

        await submitRecover(form.id, form.result, form.memo);

        submitDone = true;

        try{
            dd && dd.biz.navigation.close();
        }catch{

        }

    } catch {



    } finally {
        submitLoading = false;
    }




}



async function init() {


    try {

        initLoading = true;

        const { id } = form;
        if (!id) {
            initError = true;
            return;
        }

        const result = await getView(id);

        Object.assign(handle, result);

    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref('回复-异常登记');

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

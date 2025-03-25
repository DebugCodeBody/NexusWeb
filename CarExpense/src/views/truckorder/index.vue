<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content ">
                    <div class="relative">
                        <div class="p-5px">
                            <data-form :disabled="true" :order="orderid" ref="formEl" :upload="true"
                                :showSupplier="showSupplier" />
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="submitLoading"
                                    @click="onClickSubmit">提交审核</el-button>
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
</template>

<script setup lang="ts">

import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js";

import dataForm from "@/components/form.vue"
import getSearch from "@/utils/urlSearch"
import { createTruck } from "@/api"
import { toDing } from "@/utils/other"
import { getPathSearch } from '@/utils/urlSearch';





let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);

let orderid = $ref(getSearch("orderid"));
let supid = $ref(getSearch("supid"));

let showSupplier = $ref(orderid.includes("-"));


const formEl = $ref<typeof dataForm>();


async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch (error: any) {
        console.log(error)
        return;
    }



    try {

        submitLoading = true;

        let data = await formEl.getData();

        data = {
            ...data
        };
        

        if(data.supplier){
            data.supplier =  data.supplier.id;
        }else{
            delete data.supplier;
        }

        delete data.autSndList;
        delete data.supplierList;
        delete data.isDisabledNum;
        delete data.fileLen;
        
        data.name = data.clientName; 
        delete data.clientName;



        const instanceId = await createTruck(data);

        submitDone = true;
        await nextTick();
        toDing(instanceId);

    } catch {



    } finally {
        submitLoading = false;
    }




}


onMounted(async () => {

    try {

        initLoading = true;

        if (!orderid) {
            await formEl.getAutSndList();
        } else if (showSupplier) {
            await formEl.getSupplier();
        }

        

        await formEl.getPltPayCfg();




    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }


})



</script>

<script lang="ts">

const title = $ref("卡板/铁桶货款申请");

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
        width: 100%;
        z-index: 99;

        * {
            user-select: none !important;
        }

    }

}
</style>

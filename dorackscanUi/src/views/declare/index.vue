<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 overflow-auto mt-10px declare_wrap ">
                <div class="form-content wh-full " >
                    <div class="wh-full flex flex-col ">
                        <div class="p-5px">
                            <el-form 
                                :model="form" 
                                :hide-required-asterisk="true" 
                                :rules="rules"
                                label-width="auto" 
                                ref="formEl">
                                <el-form-item label="剩余时间" class="mb-0">
                                    <el-tag type="info" v-if="submitLoading">正在提交结果</el-tag>
                                    <el-tag type="danger" v-else-if="isStop">未开始扫描</el-tag>
                                    <el-tag v-else>{{ surplus }}秒</el-tag>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="button-block mt-10px">
                            <el-button type="warning" v-if="startScan" @click="onClickStopScan">停止扫描</el-button>
                            <el-button type="primary" :loading="submitLoading" @click="onClickStartScan" v-else>开始扫描</el-button>
                        </div>
                        <div class="flex-1 mt-10px" >
                            <Table :boxTable="boxTable"></Table>
                        </div>

                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
                        </el-result>
                        <el-result v-if="initError" icon="error" class="error-result">
                            <template #extra>
                                <el-tag type="danger" >请通过扫描二维码进入</el-tag>
                            </template>
                        </el-result>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElForm,FormRules  } from 'element-plus'
import { scanning } from "@/utils/other"

import Table from "H:/private/newTool/UI/src/components/boxTable/index.vue"
import { boxTableControl } from "H:/private/newTool/UI/src/components/boxTable/utils/boxTable"
import { defaultOptButtons } from 'H:/private/newTool/UI/src/components/boxTable/utils'
import { submit } from "@/api"




const boxTable = new boxTableControl({
    column: [
        {
            label: "序号",
            width: 80,
            prop: "id",
            align: "center"
        },
        {
            label: "类型",
            prop: "content",
            align: "center"
        }
    ]
})

const { data } = boxTable.table;


const form = $ref({
    data: "",
    radio1: ""
});

let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);





const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({});

let startScan = $ref(false);
let timeHandle = $ref(-1);
let surplus = $ref(5);

let isStop = computed(() => {
    return timeHandle == -1;
})


/** 创建定时器 */
function timeScan(){
    startScan = true;

    

    timeHandle = window.setInterval(()=>{

        surplus -= 1;
       
        if(surplus == 0){
            onClickStartScan();
        }


    }, 1000)

}


/** 重置倒计时开始定时器 */
function resetTime(){
    surplus = 5;
    timeScan();

}




/** 停止扫描 */
function onClickStopScan(){
    
    startScan = false;
    clearTimeout(timeHandle);
    timeHandle = -1;
}


async function onClickStartScan () {

    try{
        onClickStopScan();
        const text = await scanning();
        onClickSubmit(text);
    } catch {
        resetTime();
    }

}


async function onClickSubmit(text:string) {

    try{

        onClickStopScan();
        submitLoading = true;
        
        await submit(text);

        data.unshift({
            id: data.length + 1,
            content: text
        });

        resetTime();

    }catch{

        

    }finally{
        submitLoading = false;
    }




}



async function init(){

    try{

        initLoading = true;


    }catch{
        initError = true;
    }finally{
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref("清理货架");

export default {
    name: "declareView",
    title
}
</script>

<style lang="scss">
#declare {

    .declare_view{
        max-width: 800px;
        margin:auto;
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

            .el-form-item{
                &.line-item{
                    flex-direction: column;
                }

                &.mb-0{
                    margin-bottom: 0;
                }
            }

            textarea{
                height: 100px;
                resize: none;
            }

            .el-checkbox-group .el-checkbox,
            .el-radio-group .el-radio{
                margin-right: 10px;
                margin-bottom: 10px;
                padding: 0 10px;
            }

            

        }

    }

    .button-block {
        .el-button {
            width: 100%;
        }

        .el-button+.el-button{
            margin-left: 0px;
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

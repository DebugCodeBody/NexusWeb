<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content " >
                    <div class="relative">
                        <div class="p-5px">

                            <div class="flex border p-5px items-center justify-between">
                                <div>{{ userInfo.name }}</div>
                                <el-button @click="onClickEditorName">修改</el-button>
                            </div>
                            <div class="mt-10px app-list">
                                <tool-collapse v-for="item in userInfo.appList" :key="item.name" :name="item.name"> 
                                    <el-button v-for="appItem in item.app" :key="appItem.name" @click="userInfo.setApp(appItem)">{{ appItem.name }}</el-button>
                                </tool-collapse>
                               
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <pop-info />
        <pop-open />
    </div>
</template>

<script setup lang="ts">

import { ElForm,FormRules  } from 'element-plus'



import popInfo from "./popInfo.vue"
import popOpen from "./popOpen.vue"
import userInfo, { infoInit } from "@/store/data"

import toolCollapse from "@/components/toolCollapse/index.vue"





import to from "await-to-js";


infoInit();


const form = $ref({
    data: "",
    radio1: ""
});

let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
})


async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }

    try{

        submitLoading = true;





    }catch{

        

    }finally{
        submitLoading = false;
    }




}


function onClickEditorName(){

    userInfo.pop.info = true;

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

const title = $ref("内网应用");

export default {
    name: "",
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

            &+.el-button{
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

    .app-list{
        .el-button {
            margin-left: 0px;
            margin-right: 10px;
            margin-bottom: 10px;
        }
    }

}

.el-dialog{
    width: 90% !important;
    max-width: 550px;
}
</style>

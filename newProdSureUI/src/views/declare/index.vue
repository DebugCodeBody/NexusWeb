<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">采购登记</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content " >
                    <div class="relative">
                        <div class="p-5px">
                            <el-form 
                                :model="form" 
                                :hide-required-asterisk="true" 
                                :rules="rules"
                                label-width="auto" 
                                ref="formEl">
                                <el-form-item label="组织人员" prop="tissue">
                                    <el-input v-model="form.data"></el-input>
                                </el-form-item>
                                <el-form-item class="line-item" label="组织人员" prop="tissue">
                                    <el-radio-group v-model="form.radio1" size="default">
                                        <el-radio label="1" border>Option A</el-radio>
                                        <el-radio label="2" border>Option B</el-radio>
                                        <el-radio label="2" border>Option B</el-radio>
                                        <el-radio label="2" border>Option B</el-radio>
                                        <el-radio label="2" border>Option B</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item class="line-item" label="组织人员" prop="tissue" >
                                    <el-checkbox-group v-model="form.radio1" size="default">
                                        <el-checkbox label="Option1" border />
                                        <el-checkbox label="Option2" border />
                                        <el-checkbox label="Option2" border />
                                        <el-checkbox label="Option2" border />
                                        <el-checkbox label="Option2" border />
                                        <el-checkbox label="Option2" border />
                                    </el-checkbox-group>
                                </el-form-item>

                                <el-form-item class="mb-0" label="留言">
                                    <el-input v-model="form.data" type="textarea"></el-input>
                                </el-form-item>
                                
                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="submitLoading" @click="onClickSubmit">提交</el-button>
                            </div>

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

            <div class="absolute wh-full testscrollList">
                <scroll-list>
                    
                </scroll-list>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import scrollList from "@/components/scrollList/index.vue"

import { ElForm,FormRules  } from 'element-plus'
import to from "await-to-js";



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

const title = "采购登记";

export default {
    name: "",
    title
}
</script>

<style lang="scss">
#declare {

    .testscrollList{
        background-color: white;
        z-index: 99;
    }
    

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

}
</style>

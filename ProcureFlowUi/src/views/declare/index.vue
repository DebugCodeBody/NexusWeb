<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">采购登记</h3>
            <div class="flex-1 wh-full mt-10px overflow-hidden declare_wrap">
                <div class="wh-full overflow-auto form-content ">
                    <div class="relative">
                        <div class="p-5px">
                            <el-form :model="form" :hide-required-asterisk="true" :rules="rules" label-width="40"
                                ref="formEl">
                                <el-form-item label="单号" prop="orderId">
                                    <el-input v-model="form.orderId"></el-input>
                                </el-form-item>
                                <el-form-item label="材料" prop="matName">
                                    <el-input v-model="form.matName"></el-input>
                                </el-form-item>
                                <el-form-item label="规格" prop="spec">
                                    <el-input v-model="form.spec"></el-input>
                                </el-form-item>
                                <el-row :gutter="5">
                                    <el-col :span="12">
                                        <el-form-item label="数量">
                                            <el-input-number v-model="form.qty" :min="1" :max="10" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="金额">
                                            <el-input v-model="form.amount"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="报价成本" class="pre-label">
                                    <el-tag type="danger" v-if="form.excost">{{ form.quocost }}</el-tag>
                                    <el-tag v-else>{{ form.quocost }}</el-tag>
                                </el-form-item>
                            </el-form>
                            <div class="button-block mt-10px">
                                <el-button type="primary" :loading="submitLoading" @click="onClickSubmit">提交</el-button>
                            </div>
                        </div>
                        <el-result v-if="submitDone" icon="success" title="提交成功" class="success-result">
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



const form = $ref({
    orderId: "",
    matName: "",
    spec: "",
    qty: 1,
    amount: "",
    quocost: "",
    excost: false
});

let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);


const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    orderId: [
        { required: true, message: '请填写工单号', trigger: 'blur' }
    ],
    matName: [
        { required: true, message: '请填写材料名', trigger: 'blur' }
    ],
    spec: [
        { required: true, message: '请填写规格', trigger: 'blur' }
    ],
})


async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }



    try {

        submitLoading = true;





    } catch {



    } finally {
        submitLoading = false;
    }




}



async function init() {

    try {

        initLoading = true;


    } catch {
        initError = true;
    } finally {
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

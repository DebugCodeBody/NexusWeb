<template>
    <div id="phone-login" class="form-content">
        <el-form :model="formData" label-width="auto" :hide-required-asterisk="true" :rules="rules"
            ref="formEl">
            <el-form-item prop="username">
                <el-input v-model="formData.username" placeholder="手机号码" :prefix-icon="Cellphone"
                    @input="onInputUsername">
                    <template #prepend>+86</template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input 
                    v-model="formData.password"
                    placeholder="请输入验证码" 
                    @input="onInputSms">
                    <template #append>

                        <el-link type="info" 
                            :underline="false" 
                            v-if="formData.smsCountDown">{{formData.smsCountDown}}s</el-link>

                        <el-link type="primary" 
                            :underline="false" 
                            :disabled="formData.disabledSms"
                            @click="onClickSendSms"
                            v-else>获取验证码</el-link>

                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <div class="w-full">
            <el-button 
                type="primary" 
                class="w-full" 
                :disabled="formData.disabledLogin" 
                :loading="formData.loginLoding"
                @click="onClickLogin"
                >登录</el-button>
        </div>
    </div>

</template>

<script setup lang="ts">

import { Cellphone } from '@element-plus/icons-vue'

import { ElForm, FormRules } from 'element-plus'

import { sendSms,userLogin } from "@/api/user"


const formEl = $ref<typeof ElForm>();
const formData = $ref({
    username: "",
    password: "",
    loginModel: "phone",
    
    
    disabledLogin: true,

    isSendSms: false,
    disabledSms: true,
    smsCountDown: 0,

    loginLoding: false
});


const rules = reactive<FormRules>({
    username: [
        { required: true, message: "请输入手机号码", trigger: "blur" },
        {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
        },
    ],
    password: [
        { required: true, message: '请输入验证码', trigger: 'change' },
        {
            validator(rule,value,callback){

                let retErr: Error|undefined ;
                if(!formData.isSendSms){
                    retErr = new Error("请先获取验证码")
                }

                callback(retErr);

            },
        },
        { required: true, min:6, max:6, message:'请输入验证码', trigger: 'change' },
    ]
})


function SetSmsCountDown(){
    
    formData.smsCountDown -= 1;
    if(formData.smsCountDown == 0){
        return;
    }

    setTimeout(()=>{
        SetSmsCountDown()
    },1000)

}




async function onClickSendSms() {
    try {
        await formEl.validateField("username")
    } catch {
        return
    }

    // await sendSms(formData.username);

    formData.isSendSms = true;
    formData.smsCountDown = 60;
    SetSmsCountDown();

}


async function onInputUsername() {

    let value = true;
    const field = "username";

    try {
        await formEl.validateField(field)
    } catch {
        value = false;
    } finally {
        formEl.clearValidate(field)
    }


    formData.disabledSms = !value;

}

async function onInputSms(){
    if(formData.disabledSms){
        return;       
    }
    
   
    let value = true;
    const field = "password";

    try {
        await formEl.validateField(field)
    } catch {
        value = false;
    } finally {
        formEl.clearValidate(field)
    }

    formData.disabledLogin = !value;

}

async function onClickLogin(){
    try {
        await formEl.validate();
    } catch {
        return;
    }


    try{

        formData.loginLoding = true;

        await userLogin(formData.username, formData.password);





    } finally {
        
        formData.loginLoding = false;

    }

}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

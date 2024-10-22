<template>
    <div id="phone-login" class="form-content">
        <el-form :model="formData" label-width="auto" :hide-required-asterisk="true" :rules="rules"
            :validate-on-rule-change="false" ref="formEl">
            <el-form-item prop="username">
                <el-input v-model="formData.username" placeholder="手机号码" :prefix-icon="Cellphone" @input="onInputUsername">
                    <template #prepend>+86</template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" class="sms">
                <el-input v-model="formData.password" placeholder="请输入验证码" @input="onInputSms">
                    <template #append>

                        <el-link type="info" :underline="false" v-if="formData.smsCountDown">{{ formData.smsCountDown
                        }}秒</el-link>

                        <el-link type="primary" :underline="false" :disabled="formData.disabledSms" @click="onClickSendSms"
                            v-else>获取验证码</el-link>

                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <div class="w-full">
            <el-button type="primary" class="w-full" :disabled="formData.disabledLogin" :loading="formData.loginLoding"
                @click="onClickLogin">登录</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">

import { Cellphone } from '@element-plus/icons-vue'
import { ElForm, FormRules } from 'element-plus'
import to from "await-to-js"
import { sendSms, smsLogin } from "@/api/phone"


const formEl = $ref<typeof ElForm>();
const formData = $ref({
    username: "",
    password: "",
    loginModel: "phone",


    disabledLogin: true,

    isClickLogin: false,
    isSendSms: false,
    disabledSms: true,
    smsCountDown: 0,

    loginLoding: false,

    /** 发送短信返回的token */
    captcha_key: ""
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
            validator(rule, value, callback) {

                let retErr: Error | undefined;


                if (formData.isClickLogin && !formData.isSendSms) {
                    retErr = new Error("请先获取验证码")
                }

                callback(retErr);

            },
        },
        { required: true, min: 6, max: 6, message: '请输入验证码', trigger: 'change' },
    ]
});


function SetSmsCountDown() {

    formData.smsCountDown -= 1;
    if (formData.smsCountDown == 0) {
        return;
    }

    setTimeout(() => {
        SetSmsCountDown()
    }, 1000)

}




async function onClickSendSms() {
    try {
        await formEl.validateField("username")
    } catch {
        return
    }

    const [error, result] = await to(sendSms(formData.username));
    if (error) {
        return;
    }

    formData.isSendSms = true;
    formData.smsCountDown = 60;
    formData.captcha_key = result.captcha_key;


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

async function onInputSms() {
    if (formData.disabledSms) {
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

async function onClickLogin() {

    try {
        formData.isClickLogin = true;
        await formEl.validate();
    } catch {
        return;
    } finally {
        formData.isClickLogin = false
    }

    try {

        formData.loginLoding = true;
        const { username, password, captcha_key } = formData;
        await smsLogin(username, password, captcha_key);

        alert("登录成功")
        

    } catch {

    }
    finally {

        formData.loginLoding = false;

    }

}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

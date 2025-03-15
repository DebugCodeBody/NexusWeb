<template>
    <div class="login-container">
        <el-form :model="form" class="login-form" :rules="rules" ref="formEl">
            <div class="title-container">
                <h3 class="title">微信绑定</h3>
            </div>
            <el-form-item prop="nickname">
                <el-input v-model="form.nickname" placeholder="微信昵称" :prefix-icon="UserFilled" :disabled="true" />
            </el-form-item>
            <el-form-item prop="username">
                <el-input v-model="form.username" placeholder="手机号" :prefix-icon="User" />
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="form.password" placeholder="密码" :prefix-icon="Lock" :disabled="noBind || failure" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loging" style="width: 100%" @click="onLog" :disabled="noBind"
                    v-if="!failure">绑定</el-button>
                <el-button type="danger" v-if="failure" class="w-full">登录状态已失效</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import to from "await-to-js";
import { User, Lock, UserFilled } from "@element-plus/icons-vue";

import { bindPhone } from "@/api"
import getSearch from "@/utils/urlSearch"

// alert(window.wx.miniProgram.navigateBack({delta: 1}))


const form = reactive<Record<string, string>>({
    nickname: getSearch("nickname"),
    username: "",
    password: ""
});

const loging = ref(false);
const formEl = $ref<any>();

let noBind = $ref(false);
let failure = $ref(false);

const rules = reactive({
    nickname: [{ required: true, message: "请输入昵称", trigger: "change" }],
    username: [
        { required: true, message: "请输入手机号码", trigger: "change" },
        { min: 11, max: 11, required: true, message: "请输入正确的手机号码", trigger: "change" }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "change" }
    ]
});


async function onLog() {
    const [err] = await to(formEl.validate());
    if (err) {
        return;
    }

    const [binerr] = await to(bindPhone(getSearch("code"), form.username, form.password))
    if (binerr) {
        if ((binerr as any).code == 500) {
            noBind = true;
            failure = true;
        }
        return;
    }

    const href = getSearch("redirect");
    if (href) {
        location.href = href;
    }

}


</script>

<script lang="ts">
export default {
    title: "微信绑定",
    name: "login"
};
</script>

<style lang="scss">
.el-message-box {
    width: 80% !important;
}

.login-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #2d3a4b;


    h3 {
        display: block;
        font-size: 1.17em;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-weight: bold;
        margin-top: 0;
    }

    .el-form {
        background-color: white;
        width: 385px;
        border-radius: 10px;
        padding: 25px 25px 5px 25px;
    }

    .el-form-item {
        margin-bottom: 22px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }


    @media screen and (max-width: 450px) {

        & .el-form {
            width: 80%;
        }
    }
}

.title-container {
    margin-bottom: 30px;
    text-align: center;
    color: #707070;

}
</style>

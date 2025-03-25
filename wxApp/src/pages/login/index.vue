<template>
    <view class="login-from">
        <view class="flex justify-center">
            <view class="form-container">
                <view class="login-form">
                    <view class="cu-form-group input">
                        <view class="cu-item">
                            <text class="lg text-gray cuIcon-peoplefill"></text>
                        </view>
                        <input placeholder="微信昵称" name="input" type="nickname" v-model="name" @change="onNameChange"
                            @input="onNameInput" @focus="onNameFocus" @blur="onNameBlur" />
                        <!-- <input placeholder="微信昵称" name="input" v-model="name"  :class="{
                            absolute: !nameFocus
                        }" /> -->
                    </view>
                    <view class="cu-form-group input">
                        <view class="cu-item">
                            <text class="lg text-gray cuIcon-people"></text>
                        </view>
                        <input placeholder="手机号码" name="input" v-model="username" />
                    </view>
                    <view class="cu-form-group input">
                        <view class="cu-item">
                            <text class="lg text-gray cuIcon-lock"></text>
                        </view>
                        <input placeholder="密码" name="input" type="password" v-model="password" />
                    </view>
                </view>
                <view class="flex flex-direction">
                    <button class="cu-btn lg primary" @click="onClickLogin">登录</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import Vue from 'vue';

import { bindPhone } from "@/api/auth"
import { showErrorToast, showLoading, hidenLoading } from "@/utils/other"

import userInfo, { toPage,toLoginPage } from "@/store/user"
import { nextTick } from 'vue/types/umd';


export default Vue.extend({
    data() {

        return {
            nameFocus: false,
            name: "",
            username: "",
            password: "",
            params: {
                token: ""
            }
        }

    },
    onLoad(params) {

        console.log(params)

        this.name = decodeURIComponent(params!.name)
        Object.assign(this.params, params);

        if (this.name == "微信用户") {
            this.name = "";
        }

    },
    methods: {
        onNameFocus() {

            this.nameFocus = true;

            console.log("onNameFocus")

        },
        onNameBlur(event: MouseEvent) {
            this.nameFocus = false;

            console.log("onNameBlur")

        },
        onNameChange(event: MouseEvent) {

            console.log("onNameChange")

            this.name = (event.target as any).value

        },
        onNameInput(event: MouseEvent) {
            console.log("onNameInput")
        },
        onClickLogin() {
            if (!this.name) {
                return showErrorToast("请选择微信昵称");
            };
            if (!this.username) {
                return showErrorToast("请填写手机号码");
            };
            if (this.username.length < 11) {
                return showErrorToast("请填写正确号码");
            };
            if (!this.password) {
                return showErrorToast("请填写密码");
            };


            showLoading("正在登录")

            bindPhone(decodeURIComponent(this.params.token), this.name, this.username, this.password).then((result) => {

                hidenLoading();



                userInfo.name = result.name

                userInfo.user[userInfo.type] = result;

                toLoginPage();


                // toPage(`../${userInfo.redirectPage}`, userInfo.type);


            }).catch((err: any) => {

                hidenLoading();
                const message = err.msg || err.message || "登录失败"
                showErrorToast(message);

            })

        }
    }
});
</script>

<style lang="scss">
.login-from {
    padding-top: 20%;

    .form-container {
        width: 90%;
        font-size: 14px;
        background-color: white;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;


        .cu-form-group {
            margin-bottom: 10px;
            min-height: 80rpx;
        }

        .cu-item {
            margin-right: 5px;
        }

        .input {
            border-radius: 5px;
            border: 1px solid #dcdfe6;

            input {
                height: 25px
            }
        }

        button.primary {
            color: #fff;
            background-color: #409eff;
            border-color: #409eff;
        }

    }

    input.absolute {
        position: absolute;
        width: 0px;
    }

    input.hidden {
        position: absolute;
        width: 0px;

    }


}
</style>

<template>
	<div class="login-container">
		
		<el-form :model="form" class="login-form" ref="loginForm" :rules="rules">
			<div class="title-container">
				<h3 class="title">系统登录</h3>
			</div>
			<el-form-item prop="username">
				<el-input v-model="form.username" placeholder="账号" :prefix-icon="User" ref="username" @input="clearValidate('username')" />
			</el-form-item>
			<el-form-item prop="password">
				<el-input v-model="form.password" placeholder="密码" ref="password" :prefix-icon="Lock" @input="clearValidate('password')" @keyup.enter="handleLogin" />
			</el-form-item>
			<el-form-item class="login-button">
				<el-button type="primary" :loading="loging" @click.prevent="handleLogin">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import {ref, reactive, nextTick, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";

import userStore from "@/store/user";
import {useRouter, useRoute} from "vue-router";

import {User, Lock} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import type {FormInstance, FormRules} from "element-plus";

import {getToken, setToken} from "@/utils/auto";


const user = userStore();
const route = useRoute();
const router = useRouter();

const form = reactive<Record<string, string>>({
	username: "",
	password: ""
});

const loging = ref(false);
const username = ref();
const password = ref();
const loginForm = ref();

function inputFocus() {
	if (form.username == "") {
		username.value.focus();
	} else if (form.password == "") {
		password.value.focus();
	}
}

onMounted(async () => {
	if (window.dd.env.platform != "notInDingTalk") {
		try {


			await ElMessageBox.confirm("是否使用当前钉钉账户登录?", "提示", {
				confirmButtonText: "确认",
				cancelButtonText: "取消",
				type: "warning",
				center: true
			});
			
			const { corpId } = window.urlSearch;

			window.dd.runtime.permission.requestAuthCode({
				corpId
			}).then(({ code })=>{



			}).catch((error)=>{

			})



			loging.value = true;

			setTimeout(() => {
				setToken("cf2fb3b834bad3b39dcbcecc2fddd42d");

				router.push({
					path: (route.query.redirect || "/") as string
				});
			}, 500);

		} catch (error) {
			setTimeout(() => {
				inputFocus();
			}, 300);
		}
	} else {
		inputFocus();
	}
});

const rules = reactive<FormRules>({
	username: [{required: true, message: "请输入账号", trigger: "change"}],
	password: [{required: true, message: "请输入密码", trigger: "change"}]
});

function clearValidate(name: string) {
	if (form[name] == "") {
		loginForm.value.clearValidate(name);
	}
}

async function handleLogin() {
	try {
		await loginForm.value.validate();

		loging.value = true;
	} catch (err) {
		return;
	}

	const {username, password} = form;
	try {
		await user.login(username, password);

		router.push({
			path: (route.query.redirect || "/") as string
		});
	} catch (error: any) {
		ElMessage.error(error.message || "登录失败，请重试");
		loging.value = false;
	}
}
</script>

<script lang="ts">
export default {
	name: ""
};
</script>

<style lang="scss">
.el-message-box {
	width: 80% !important;
}

.login-container {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	background-color: #2d3a4b;

	.el-form-item {
		margin-bottom: 22px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
	}
}

.title-container{
	margin-bottom: 40px;
	text-align: center;
	font-size: 26px;
	color: white;
}

.login-form {
	position: relative;
	width: 520px;
	max-width: 100%;
	padding: 160px 35px 0;
	margin: 0 auto;
	overflow: hidden;

	box-sizing: border-box;

	.el-input__wrapper {
		width: 100% !important;
	}
	.el-input {
		
		input {
			background: transparent;
			border: 0px;
			border-radius: 0px;
			padding: 12px 5px 12px 15px;
			height: 47px;
			-webkit-appearance: none;
		}
	}

	.el-form-item.is-error .el-input__wrapper {
		box-shadow: 0 !important;
	}
}

.login-button {
	width: 100%;
	button {
		width: 100%;
	}
}
</style>

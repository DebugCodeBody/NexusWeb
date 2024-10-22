<template>
	<div class="login-container">
		<el-form :model="form" class="login-form" :rules="rules" ref="formEl">
			<div class="title-container">
				<h3 class="title">Nexus 后台系统登录</h3>
			</div>
			<el-form-item prop="username">
				<el-input v-model="form.username" placeholder="账号" :prefix-icon="User" />
			</el-form-item>
			<el-form-item prop="password">
				<el-input v-model="form.password" placeholder="密码" :prefix-icon="Lock" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" :loading="loging" style="width: 100%" v-blur @click="onLog">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import to from "await-to-js";

import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";


const form = reactive<Record<string, string>>({
	username: "",
	password: ""
});

const loging = ref(false);
const formEl = $ref<FormInstance>();

const rules = reactive<FormRules>({
	username: [{ required: true, message: "请输入账号", trigger: "change" }],
	password: [{ required: true, message: "请输入密码", trigger: "change" }]
});


async function onLog() {
	const [err] = await to(formEl.validate());
	if (err) {
		return;
	}

}


</script>

<script lang="ts">
export default {
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
}

.title-container {
	margin-bottom: 30px;
	text-align: center;
	color: #707070;

}
</style>

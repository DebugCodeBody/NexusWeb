<template>
	<layout v-if="initCode == initStatus.SUCCESS"> </layout>

	<messagePopup v-else-if="initCode == initStatus.NOLOGIN" icon="!" title="登录失败" message="请稍后刷新页面重试" iconColor="#e6a23c" />
	<messagePopup v-else-if="initCode == initStatus.NOENVIRONMENT" icon="X" title="错误" message="本应用只允许在钉钉环境打开" iconColor="#f56c6c" />
</template>

<script setup lang="ts">
import {ref, nextTick, defineProps, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue"

import layout from "@/layout/index.vue"
import messagePopup from "@/components/messagePopup.vue"

import initStatus from "@/enum/init"



const initCode = window.initCode
</script>

<style lang="scss">
* {
	margin: 0;
}

html,
body,
#app {
	height: 100%;
	width: 100%;
}

body{
	background: rgb(243, 243, 247);
}

.wh-full {
	width: 100%;
	height: 100%;
}

.el-overlay-message-box{
	display: flex;
	justify-content: center;
    align-items: center;

	.el-message-box{
		width: 90%;
		max-width: 420px;
	}

}
</style>

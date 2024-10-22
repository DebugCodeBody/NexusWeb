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
	overflow: hidden;
}

body{
	background: rgb(243, 243, 247);
}

.wh-full{
	width: 100%;
	height: 100%;
}

.el-form-item.label-top{
	display: block !important;

	.el-form-item__label-wrap{
		margin-left: 0 !important;
	}
}


.el-tabs__nav{
	transition: none !important;
}
.el-tabs__nav-wrap{
	padding: 0 !important;


}

.el-tabs__nav-prev,
.el-tabs__nav-next{
	display: none !important;
}


.listcontent-item form {
        position: relative;
        padding: 10px;
        padding-top: 0px;

        &.grouperror {
            height: 350px;
        }

        .el-result {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(255, 255, 255);
        }

        .el-select {
            * {
                user-select: none;
            }
        }

        .time-input {
            &>.el-form-item__label-wrap {
                display: none;
            }
        }

        .result .el-tag__content {
            font-size: 20px;
        }
    }

</style>

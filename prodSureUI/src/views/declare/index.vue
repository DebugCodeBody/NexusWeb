<template>

    <layout v-if="initCode == initialEnum.SUCCESS"></layout>

	<messagePopup v-else-if="initCode == initialEnum.NOLOGIN" icon="!" title="登录失败" message="请稍后刷新页面重试" iconColor="#e6a23c" />
	<messagePopup v-else-if="initCode == initialEnum.NOENVIRONMENT" icon="X" title="错误" message="本应用只允许在钉钉环境打开" iconColor="#f56c6c" />

</template>

<script setup lang="ts">
import {ref, nextTick, defineProps, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue"

import layout from "./layout/index.vue"
import messagePopup from "@/components/messagePopup.vue"
import initialEnum from "@/enums/initialEnum"



const initCode = window.initCode;


</script>

<style lang="scss">
</style>

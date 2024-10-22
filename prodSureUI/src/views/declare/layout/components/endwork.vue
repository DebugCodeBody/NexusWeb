<template>

    <el-form label-width="80px" ref="ruleFormRef" id="end-work">
        <template v-if="title == String.Empty">
            <detailedContent :height="300" />
            <el-result icon="success" sub-title="提交成功" v-if="submitDone"></el-result>
        </template>

        <el-result icon="error" :sub-title="title"  class="error" v-else></el-result>

    </el-form>

    <div class="fun-area" v-if="!submitDone">
        <template v-if="!updateDisabled">
            <el-button @click="setProcess">继续提问</el-button>
        </template>
        <el-button v-else :loading="loading">{{ loading && "正在" || "" }}提交</el-button>
    </div>

</template>

<script setup lang="ts">
import detailedContent from "@/views/sales/components/detailedContent.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, UploadRawFile, UploadUserFile } from 'element-plus'

import { setPaskProcess, getPaskProcess, continPask } from "@/api"
import { ruleForm, updateDisabled, submitDone, fileList } from "../hooks/data"


import { paskType } from "@/module/paskType"
import paskStateEnum from "@/enums/paskStateEnum"
import { setp, nextSetp, nextMemo, table } from "@/views/sales/hooks/data"


const update = ref();
const ruleFormRef = ref<FormInstance>()


const honour = ref(false);
const loading = ref(false);

const stepShow = ref(false);

const title = ref(String.Empty);



if (process.env.NODE_ENV != "production") {
    window.urlSearch.askid = 144;
}
const { askid } = window.urlSearch;



async function onClickOrder() {

    try {

        setp.value = await getPaskProcess(askid) as any;

        stepShow.value = true;
        nextSetp.value = table[paskStateEnum.TRACK];

    } catch (error: any) {
        title.value = error.msg || error.message || "其他错误，请联系管理员";

        ElMessage.error(title.value)


    }

}

/**
 * 设置状态
 */
async function setProcess() {

    if (!nextMemo.value || nextMemo.value == String.Empty) {
        ElMessage({
            message: '详细描述不能为空！',
            type: 'warning',
        })

        return;
    }

    try {
        const result = await continPask(askid, nextMemo.value);

        submitDone.value = true;
    } catch (error: any) {
        ElMessage.error(error.msg || error.message || "其他错误，请联系管理员")
    }

}

onClickOrder();

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
#end-work {
    .function-card {
        font-size: 14px;
    }

    .box-card .el-card__body {
        padding: 10px;

    }

    .tab-card,
    .description.radio {
        display: none;
    }

    .function-card .el-card__body {
        padding: 10px;

        .description.input {
            margin-top: 0px;
        }
    }

    .el-result.error{

        height: 300px;
    }


}
</style>

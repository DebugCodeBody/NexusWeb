<template>
    <div>
        <div class="content">
            <el-form :model="from" :rules="fromRules" ref="ruleFormRef">
                <el-form-item label="销售专员" prop="name" v-if="false">
                    <el-select v-model="name" placeholder="选择销售专员">
                        <el-option v-for="item in salename" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="时间范围" prop="dateTime">
                    <el-date-picker type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
                        unlink-panels v-model="dateTime" value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item label="工单号" prop="order">
                    <el-input v-model="order" />
                </el-form-item>
                <el-form-item v-if="prompt">
                    <el-tag type="danger">销售专员，工单号，时间范围至少填写一样</el-tag>
                </el-form-item>
            </el-form>
        </div>
        <span class="dialog-footer">
            <el-popover :disabled="disabled" v-model:visible="visible" placement="bottom" :width="160">
                <p>亲爱的，搜寂寞呢？</p>
                <br />
                <p>选条件呀</p>
                <template #reference>
                    <el-button type="primary" @click="onSearch" @mouseleave="mouseout">搜索</el-button>
                </template>
            </el-popover>
        </span>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"


import { ElMessage } from 'element-plus'

import { search, getAllPask } from "@/api"
import { searchDialog, fromRules, from, label, name, order, dateTime, searchResult } from "../hooks/search"
import { salename, table, setData } from "../hooks/data"
import type { FormInstance } from 'element-plus'


let searchIng = false;
const disabled = ref(true);
const visible = ref(false);

const ruleFormRef = ref<FormInstance>()

const prompt = computed(() => {
    return label.value != undefined;
})


const options = Object.values(table).map(({ title, stage }) => {
    return { title, stage }
})


async function onSearch() {
    dateTime.value = dateTime.value || [];

    if (![name.value, order.value].some((elem) => !!elem) && dateTime.value.length == 0) {
        if (!searchIng) {
            visible.value = true;
            disabled.value = false;
        } else {
            searchIng = false;
            getAllPask().then((data: any) => {
                setData(data.pask);
            });
        }

        return;
    }

    const [start, end] = dateTime.value || [];

    try {

        const result = await search(name.value, order.value, start, end) as any;

        if (result.length == 0) {
            ElMessage.warning("搜索结果为空")
        } else {
            setData(result);
        }

        searchIng = true;

    } catch (err: any) {
        ElMessage.error(err.msg || err.message || "其他错误，请联系管理员")
    }

}

function mouseout() {
    visible.value = false;
    disabled.value = true;
}

function onReset() {
    label.value = undefined;
    name.value = String.Empty;
    order.value = String.Empty;
    dateTime.value = [];
}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.search-dialog.el-dialog {
    width: 600px;

    .el-select {
        width: 100%;
    }
}
</style>

<template>
    <el-dialog v-model="show" customClass="dialog" @closed="onClosed">
        <template #header>
            <p>任务流程</p>
        </template>
        <detailedContent />

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="show = false">取消</el-button>
                <el-button type="success" disabled v-if="seleItem.stage === paskStateEnum.CLOSE">已结案</el-button>
                <el-popover placement="top-start" trigger="click" :content="content" :disabled="disabled"
                    :visible="visible" v-else>
                    <template #reference>
                        <el-button type="primary" @click="onClickClosed" @blur="onblur">提交</el-button>
                    </template>
                </el-popover>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import detailedContent from "./detailedContent.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, computed, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElMessage } from 'element-plus'

import { setPaskProcess, SendGuestBook } from "@/api"
import { paskType, paskTypes } from "@/module/paskType"
import { Dialog, seleItem, paskList, nextSetp, nextMemo, getWorkProcess, setp, table, nextModel } from "../hooks/data"

import paskStateEnum from "@/enums/paskStateEnum"
import { paskSetp } from "@/module/paskStep"


const show = ref(true);


const content = ref(String.Empty);
const disabled = ref(true);
const visible = ref(false);
watch(content, (value) => {
    if (value == String.Empty) {
        visible.value = false
        disabled.value = true
    } else {
        visible.value = true;
        disabled.value = false;
    }
})

async function onClickClosed() {
    if (nextModel.value == undefined) {
        content.value = "请选中提交模式"
    } else {
        try {

            /**
             * 转到销售专员的时候不能够再转回去
             */

            let result;
            if (nextModel.value == seleItem.value.stage || ( nextModel.value == paskStateEnum.OUT && seleItem.value.outsvr)) {
                result = await guestBook();
                if (result) {
                    nextModel.value = paskStateEnum.GUESTBOOK
                }
            } else {
                result = await setProcess();
            }
            if (!result) {
                return;
            }
            
            const { process } = await getWorkProcess(seleItem.value)!;

            const pask = Object.assign(result, {
                memo: nextMemo.value,
                stage: nextModel.value
            }) as paskSetp

            process.push(pask)

            nextMemo.value = String.Empty;
            show.value = false;

            setTimeout(() => {
                seleItem.value = {};
            })

            
        } catch (err: any) {
            ElMessage.error(err.msg || err.message || "其他错误，请联系管理员")
        }
    }
}

/**
 * 留言
 */
async function guestBook() {
    const book = nextMemo.value && nextMemo.value.trim() || String.Empty;
    if (!book) {
        content.value = "请输入留言内容"
        return;
    }

    const { askid } = seleItem.value;

    const result = await SendGuestBook(askid, book);

    return result as any;

}

/**
 * 设置状态
 */
async function setProcess() {

    const nextstage = nextModel.value as number;

    let { askid, stage ,outsvr } = seleItem.value;

    const result = await setPaskProcess(askid, nextstage, nextMemo.value);

    seleItem.value.stage = nextstage;

    if(stage == 1 && outsvr){
        stage = 0;
    }
    const index = paskList[stage].findIndex((elem: paskType) => elem === seleItem.value)!;

    paskList[stage].splice(index, 1);
    paskList[nextstage as paskStateEnum].push(seleItem.value);



    return result as any;

}


function onblur() {
    visible.value = false;
    disabled.value = true;
    setTimeout(() => {
        content.value = String.Empty;
    })

}

function onClosed() {
    nextTick(() => {
        Dialog.value = false;
    })
}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.dialog {
    .el-step__title {
        font-weight: bold !important;
    }

    .el-step__title,
    .el-step__description {
        color: black !important;
        font-size: 14px !important;
    }

    .el-dialog__header {
        margin: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid rgb(245, 245, 245);
    }

    .el-card__body {
        padding: 10px 20px;
    }

}
</style>

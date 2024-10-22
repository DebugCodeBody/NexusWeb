<template>
    <div class="content">
        <step :height="height" />

        <template v-if="seleItem.stage != paskStateEnum.CLOSE">

            <el-card class="function-card tab-card">
                <div class="description radio tab">
                    <span>转标签页：</span>
                </div>
                <el-radio-group v-model="nextModel">
                    <template v-for="(item, index) in table" :key="index">
                        <el-radio :label="item.stage" v-if="item.stage != paskStateEnum.GUESTBOOK && showNext(item)" >{{ item.title }}</el-radio>
                    </template>
                </el-radio-group>
            </el-card>

            <el-card class="function-card">
                <div class="description input">
                    <span>详细描述：</span>
                    <el-input type="textarea" placeholder="请输入详细描述" v-model="nextMemo" ref="memoInput" />
                </div>
                <div class="description radio">
                    <span>快捷描述：</span>
                    <el-radio-group v-model="radio">
                        <el-radio v-for="(item, index) in setp.prob" :key="index" :label="item">{{ item }}
                        </el-radio>
                        <el-radio :label="String.Empty">其他描述</el-radio>
                    </el-radio-group>
                </div>
            </el-card>
        </template>
    </div>
</template>

<script setup lang="ts">
import step from "./step.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"


import { setPaskProcess, SendGuestBook } from "@/api"
import { paskType, paskTypes } from "@/module/paskType"
import { Dialog, seleItem, paskList, nextSetp, nextMemo, getWorkProcess, setp, table, nextModel } from "../hooks/data"


import paskStateEnum from "@/enums/paskStateEnum"
import { paskSetp } from "@/module/paskStep"

const Props = defineProps<{
    height?: number
}>()


const memoInput = ref();

const radio = ref(String.Empty);
watch(radio, (value) => {
    nextMemo.value = value;
    if (!value) {
        memoInput.value.focus();
    }
})


onMounted(() => {
    nextTick(() => {
        memoInputfocus();
    })
})


/**
 * 详细描述获取焦点
 */
function memoInputfocus() {
    if (memoInput.value) {
        memoInput.value.focus();
    }
}

function showNext(item:any){
    if(seleItem.value.outsvr) {
        return item.stage != paskStateEnum.PREPA
    }else{
        return item.stage != paskStateEnum.OUT
    }
    
}

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.content {
    .info {

        p {
            line-height: 2;
        }

    }

    .description.radio {
        display: inline-block;
    }

    .description.radio>span {
        margin-bottom: 0 !important;
    }
}

.content {

    .description {
        display: flex;


        .el-textarea {
            flex: 1
        }

        span:not(.el-radio__input):first-child {
            margin-right: 5px;
        }

        span.memo {
            flex: 1;
        }

        &.input,
        &.radio:not(.tab) {
            margin-top: 20px;
        }

        &.radio {
            align-items: center;
        }

    }

    .function-card {
        margin-top: 10px;
    }

}
</style>

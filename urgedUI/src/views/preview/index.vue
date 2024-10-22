<template>
    <div id="preview">
        <div class="preview-head">
            <el-card class="head-info">
                <h3>催单看板</h3>
            </el-card>
            <el-card class="head-search">
                <div class="order">
                    <span>单号：</span>
                    <el-input v-model="search" placeholder="填写工单号" size="default" />
                </div>
                <el-button type="primary" size="default" @click="onSearch">搜索</el-button>
            </el-card>
            <el-card class="head-other">
                <el-icon :size="24" @click="init">
                    <Refresh />
                </el-icon>
                <el-icon :size="24" @click="timeSet = true">
                    <Timer />
                </el-icon>
            </el-card>
        </div>
        <div class="preview-content">
            <el-row :gutter="10">
                <el-col :span="8">
                    <box-card title="所有催单">
                        <card-item :data="item" v-for="(item, index) in allItem.all" :key="index" type="all" />
                    </box-card>
                </el-col>
                <el-col :span="8">
                    <box-card title="我的催单">
                        <card-item :data="item" v-for="(item, index) in allItem.demand" :key="index" type="demand" />
                    </box-card>
                </el-col>
                <el-col :span="8">
                    <box-card title="我的跟单">
                        <card-item :data="item" v-for="(item, index) in allItem.task" :key="index" type="task" />
                    </box-card>
                </el-col>
            </el-row>
        </div>

        <Time @callBack="init" :delay="2" v-model:visible="timeSet" ref="timeEl"></Time>
        <nextDia v-if="popUpIng" @close="diaClose" />
    </div>
</template>

<script setup lang="ts">
import BoxCard from "@/components/BoxCard/index.vue"
import Time from "@/components/Time/index.vue"
import CardItem from "./components/CardItem.vue"
import nextDia from "./components/nextDia.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElMessage, ElMessageBox } from 'element-plus'

import { getPreData, orderSearch } from "@/api"

import { popUpIng } from "./store/popup"
import { allItem } from "./store/data"
import { branchInit } from "@/store/branch"


const timeEl = ref();
const timeSet = ref(false);
const search = ref();

function diaClose() {
    nextTick(() => {
        popUpIng.value = false;
    })
}

async function init() {
    try {
        const result = await getPreData();

        Object.assign(allItem, result);

        timeEl.value.start();

    } catch (error: any) {
        if (error.code == 1409) {
            timeEl.value.stop();

            ElMessageBox.confirm(
                '登录状态已失效，请重新登录！',
                '错误',
                {
                    confirmButtonText: '确定',
                    type: 'error',
                    showCancelButton: false,
                    center: true
                }
            )
        }
    }
}

async function onSearch() {
    
    timeEl.value.stop();

    try {

        const response = await orderSearch(search.value);
        Object.assign(allItem, response);

    } catch (err) {
        console.log(err);
    }

}


(async function () {
    await branchInit();
    init();


})();

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
#preview {
    height: 100%;
    display: flex;
    flex-direction: column;

    .preview-head {
        margin-bottom: 20px;
        display: flex;

        .head-search {
            margin: 0 10px;
            flex: 1;

            .el-card__body {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .order {

                .el-input {
                    width: 120px;
                }
            }
        }

        .head-other {

            .el-icon {
                cursor: pointer;

                &:last-child {
                    margin-left: 10px;
                }
            }
        }

        .el-card {
            margin-bottom: 0;

            .el-card__body {
                padding: 10px;
            }
        }


    }

    .preview-content {
        flex: 1;
    }
}

.grid-content {
    height: 100%;
}

.el-row {
    height: 100%;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
</style>

<template>
    <div id="sales" v-if="init">

        <messagePopup icon="!" title="登录失败" message="用户不存在，请联系管理员" iconColor="#e6a23c" v-if="!logDone" />

        <template v-else>
            <div class="top-card">
                <el-card class="search-card">
                    <searchDia class="search-content"></searchDia>
                </el-card>
                <el-card class="function-card">
                    <el-icon :size="24" @click="pullData">
                        <Refresh />
                    </el-icon>
                    <el-icon :size="24" @click="timeDialog = true">
                        <Timer />
                    </el-icon>
                </el-card>
            </div>

            <div class="sales-content">
                <contItem title="外发问数" :data="paskList['0']" :type="paskStateEnum.PREPA"></contItem>
                <contItem title="车间问数" :data="paskList['1']" :type="paskStateEnum.PREPA"></contItem>
                <contItem title="销售专员" :data="paskList['2']" :type="paskStateEnum.TRACK">
                    <template #header>
                        <el-select v-model="searchName" placeholder="全部">
                            <el-option label="全部" value="全部" />
                            <el-option v-for="item in salename" :key="item" :label="item" :value="item" />
                        </el-select>
                    </template>
                </contItem>
                <contItem title="结案" :data="paskList['3']" :type="paskStateEnum.CLOSE"></contItem>
            </div>

            <detailedDia v-if="Dialog" />
            <el-dialog v-model="timeDialog">
                <el-form @submit.prevent ref="formRef">
                    <el-form-item label="设置定时">
                        <el-input v-model.number="timing" /><span style="margin-left:10px;">分</span>
                    </el-form-item>
                </el-form>

                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="timeDialog = false">取消</el-button>
                        <el-button type="primary" @click="startTime()">确定</el-button>
                    </span>
                </template>
            </el-dialog>

        </template>

    </div>
</template>

<script setup lang="ts">
import detailedDia from "./components/detailedDia.vue"
import searchDia from "./components/searchDia.vue"

import contItem from "./components/contItem.vue"
import messagePopup from "@/components/messagePopup.vue"


import { useCurrentElement, watchDebounced } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElLoading } from 'element-plus'
import { ElMessageBox } from 'element-plus'


import { getAllPask, salesLogin } from "@/api"

import { Dialog, seleItem, paskList, salename, setData } from "./hooks/data"
import { searchDialog, searchName } from "./hooks/search"

import paskStateEnum from "@/enums/paskStateEnum"

const init = ref(false);
const logDone = ref(false);

let time = 0;
const timeDialog = ref(false);
const timing = ref(2);




let loading: any;
function startTime() {
    timeDialog.value = false;
    stopTime();
    time = window.setTimeout(() => {
        pullData();
    }, 1000 * 60 * timing.value);
}
function stopTime() {
    clearTimeout(time);
}

watch(Dialog, (value) => {
    if (value) {
        stopTime();
    } else {
        startTime();
    }
})




function startLoading() {
    loading = ElLoading.service({
        lock: true,
        text: '正在获取数据',
        background: 'rgba(0, 0, 0, 0.7)',
    })
}

function stopLoading() {
    loading!.close()
}

function pullData() {
    stopTime();

    getAllPask().then((data: any) => {

        startTime();
        setData(data.pask);

        salename.splice(0, salename.length, ...data.sale);

    }).catch(() => {
        ElMessageBox.alert('获取数据失败，请联系管理员', '错误', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
            center: true
        })


    }).finally(() => {
        startLoading();
        stopLoading();

    })

}

salesLogin().then(() => {
    logDone.value = true;

    pullData();

}).finally(() => {
    init.value = true;
})


</script>

<script lang="ts">
export default {
    name: "Sales"
}
</script>

<style lang="scss">
#sales {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    overflow: hidden;

    .search-content {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-form {
            display: flex;

            .el-form-item {
                margin-bottom: 0px;
                margin-right: 20px;
            }
        }
    }

    .sales-content {
        display: flex;
        flex: 1;

        overflow: hidden;
    }

    .item {
        width: 33%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;

        display: flex;
        flex-direction: column;

        .header {
            text-align: center;
            margin-bottom: 10px;

            justify-content: center;
            display: flex;

            .el-input {
                width: auto;
                margin-right: 10px;
            }

        }


        .content {
            flex: 1;
            padding: 10px;
            overflow: auto;
            box-shadow: var(--el-box-shadow-light);


            .order {
                padding: 10px;
                margin-bottom: 10px;
                background-color: #ffe3c8;
                cursor: pointer;
            }
        }
    }

    .top-card {
        padding: 10px;
        display: flex;

        .search-card {
            flex: 1;
        }

        .function-card {
            margin-left: 10px;

            .el-icon {
                cursor: pointer;
            }

            .el-icon:first-child {
                margin-right: 10px;
            }
        }

    }
}

.el-dialog__headerbtn {
    display: none !important;
}

.el-dialog__body {
    padding: 10px 20px !important;
}

.el-form-item__content {
    flex-wrap: nowrap !important;
}

.el-overlay-dialog .el-input {
    flex: 1;
}
</style>

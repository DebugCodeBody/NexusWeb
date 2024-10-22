<template>
    <div id="preview">
        <div class="preview-head">
            <el-card class="head-info">
                <div>
                    <h2>{{ title }}</h2>
                </div>
                <div class="search">
                    <el-input placeholder="输入人名或者物品名搜索" v-model="search" @keydown.enter="onClickSearch" clearable
                        @clear="onClickSearch"></el-input>
                    <el-button type="primary" @click="onClickSearch" :disabled="!search">搜索</el-button>
                </div>
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
                    <box-card title="待采购">
                        <CardItem v-for="item in allItem[1]" :data="item" :key="item.id"></CardItem>
                    </box-card>
                </el-col>
                <el-col :span="8">
                    <box-card title="采购中">
                        <CardItem v-for="item in allItem[2]" :data="item" :key="item.id"></CardItem>
                    </box-card>
                </el-col>
                <el-col :span="8">
                    <box-card title="已采购">
                        <CardItem v-for="item in allItem[3]" :data="item" :key="item.id"></CardItem>
                    </box-card>
                </el-col>
            </el-row>
        </div>

        <Time @callBack="init" :delay="2" v-model:visible="timeSet" ref="timeEl"></Time>
        <nextDia v-if="popUpIng" @close="popUpIng = false"></nextDia>
    </div>
</template>

<script setup lang="ts">
import BoxCard from "@/components/BoxCard/index.vue"
import Time from "@/components/Time/index.vue"
import CardItem from "./components/CardItem.vue"
import nextDia from "./components/nextDia.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { getList } from "@/api"


import { ElMessage, ElMessageBox } from 'element-plus'
import { popUpIng } from "./store/popup"
import { allItem } from "./store/data"


const timeEl = ref();
const timeSet = ref(false);

const search = ref("");

let isSearch = false;


async function init() {
    const response = await getList(isSearch ? search.value : "");

    [1, 2, 3].forEach((elem) => {
        if (allItem[elem]) {
            allItem[elem].length = 0;
        } else {
            allItem[elem] = [];
        }
    })


  

    response.forEach((elem, index) => {
        allItem[index + 1].push(...elem);
    });


}


function onClickSearch() {

    isSearch = true;

    init().finally(() => {
        isSearch = false;
    });




}


init();




</script>

<script lang="ts">
const title = "采购看板"
export default {
    name: "",
    title
}
</script>

<style lang="scss">
#preview {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;

    .preview-head {
        margin-bottom: 20px;
        display: flex;

        .head-info {
            flex: 1;
            margin-right: 10px;



            .el-card__body {
                display: flex;
                width: 100%;

                .search {
                    flex: 1;
                    margin-left: 10px;

                    .el-input {
                        width: 50%;
                        margin-right: 10px;
                    }
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

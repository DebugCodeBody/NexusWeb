<template>
    <div id="preview">
        <div class="board-view">
            <div class="board-flex-view">
                <div class="board-right-view">
                    <div class="board-right-view-top">
                        <el-card>
                            <h3>{{  title  }}</h3>
                        </el-card>
                        <el-card class="top-left">
                            <div class="top-left-view">
                                <div class="name-list">
                                    <el-checkbox v-for="item in data.crt" :key="item.name" v-model="item.check"
                                        :label="item.name" size="large" />
                                </div>
                                <el-input v-model="data.searchText" placeholder="内容搜索" :prefix-icon="Search" @keydown.enter="onSearch" />
                                <el-button type="primary" @click="onSearch">搜索</el-button>
                            </div>
                        </el-card>
                        <el-card>
                            <el-icon :size="24" @click="onSearch">
                                <RefreshRight />
                            </el-icon>
                            <el-icon :size="24" @click="timeShow = true">
                                <Timer />
                            </el-icon>
                        </el-card>
                    </div>
                    <div class="board-right-view">
                        <div class="kanban-view">
                            <singl-list v-for="(item, index) in data.data" v-model="data.data[index]" :key="item.name">
                            </singl-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <next-dialog v-if="select.selected" />
        <add-task v-if="data.addOpen" />
        <move-dialog v-if="drag.selected"/>

        <Time :delay="5" @callBack="onSearch" v-model:visible="timeShow" ref="timeEl"></Time>

    </div>
</template>

<script setup lang="ts">
import rightView from "./components/rightView.vue"
import singlList from "./components/singlList.vue"
import nextDialog from "./components/nextDialog.vue"
import moveDialog from "./components/moveDialog.vue"
import editDialog from "./components/editDialog.vue"

import addTask from "./components/addTask.vue"
import Time from "@/components/Time/index.vue"


import { useCurrentElement, watchDebounced } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { Search } from '@element-plus/icons-vue'

import { crtList, taskSearch } from "@/api"
import { dataStore } from "@/store/data"
import { selectStore } from "@/store/select"
import { getUserName } from "@/store/user"
import { dragStore } from "@/store/drag"



const select = selectStore();
const data = dataStore();
const drag = dragStore();

const timeShow = ref(false);
const timeEl = ref();


async function onSearch() {
    try{
        timeEl.value.stop();

        await data.onSearch();

    }finally {
        timeEl.value.start();
    }

}

crtList().then((elem) => {
    const userName = getUserName();

    elem.forEach((name) => {
        if (name != userName) {
            data.crt.push({
                name,
                check: false
            })
        }
    })

    watchDebounced(data.crt, onSearch, {
        debounce: 500,
        maxWait: 1000
    })

})


onMounted(() => {
    onSearch();
})

</script>

<script lang="ts">

const title = "后加工任务看板";

export default {
    name: "preview",
    title
}
</script>

<style lang="scss">
#preview {
    width: 100%;
    height: 100%;

    .board-view {
        width: 100%;
        height: 100%;


        display: flex;


        .board-flex-view,
        .board-right-view {
            flex: 1;
            display: flex;
            overflow: hidden;
        }

        .board-right-view {
            flex-direction: column;

            .kanban-view {
                width: 100%;
                display: flex;
                overflow: auto;
                flex: 1;

            }
        }

        .board-right-view-top {
            display: flex;

            .el-card {
                margin-bottom: 0;
                display: flex;
                align-items: center;
            }

            .top-left {
                flex: 1;
                margin: 0 10px;

                .el-card__body {
                    flex: 1;
                }

                .top-left-view {
                    display: flex;

                    .name-list {
                        flex-shrink: 0;
                        margin-right: 10px;
                    }

                    .el-button {
                        margin-left: 10px;
                    }
                }
            }

            .el-input {
                width: 300px;
            }
            .el-card:last-child {


                .el-icon {
                    &:first-child {
                        margin-right: 10px;
                    }

                    cursor: pointer;
                }
            }
        }
    }
}


.el-card:not(:last-child) {
    margin-bottom: 10px;
}

.el-card .el-card__body {
    padding: 10px;
}
</style>

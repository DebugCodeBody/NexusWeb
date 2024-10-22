<template>
    <div class="work-view">
        <div class="work-view-utils">
            <el-card class="main">
                <div>{{ username }}</div>
                <el-select v-model="filter.group" placeholder="负责群过滤" @change="onSearch" clearable
                    style="margin-left: 10px;">
                    <el-option v-for="item in group" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-input v-model="filter.txt" 
                    placeholder="任务内容搜索" 
                    style="width:300px; margin-left: 10px;"
                    clearable
                    @keydown.enter="onSearch" />
                <el-input v-model="filter.dept" 
                    placeholder="品质搜索" 
                    style="width:300px; margin-left: 10px;"
                    clearable
                    @keydown.enter="onSearch" />
                <el-button type="primary" style="margin-left: 10px;" @click="onSearch">搜索</el-button>
                <el-checkbox v-model="checked" style="margin-left: 10px">显示其他用户的提出</el-checkbox>
            </el-card>
            <el-card class="utils">
                <el-icon :size="25" @click="init">
                    <RefreshRight />
                </el-icon>
                <el-icon :size="25" @click="setTimeVisible = true">
                    <Timer  />
                </el-icon>
            </el-card>
        </div>
        <div class="work-view-abs">
            <el-row :gutter="10" style="height: 100%;">
                <el-col :span="colSpan" v-for="{ name, id } in exportTabs" :key="id" style="height: 100%;">
                    <column :id="id" :title="name" @popDialog="popDialog" @pop-step="popStep" v-model="data[id]"
                        :allowAdd="id == 2" />
                </el-col>
            </el-row>
        </div>
    </div>

    <data-time :delay="5" v-model:visible="setTimeVisible" @call-back="init" ref="timeEl" />
    <addDialog v-if="diaForm.open" :close="init" />
    <step-dialog v-if="diaForm.openStep" :close="onStepClose" />
</template>

<script setup lang="ts">
import column from "./column.vue"
import addDialog from "./addDialog.vue"
import stepDialog from "./stepDialog.vue";
import DataTime from "@/components/Time/index.vue"
import { ElLoading } from 'element-plus'


import to from "await-to-js";

import { exportTabs } from "@/store/tab"

import { getUserName } from "@/store/user"
import { workGet } from "@/api"
import { groupGet } from "@/api/group"
import { workData } from "@/store/data"
import getSearch from "@/utils/urlSearch"



const username = $ref(getUserName());
const colSpan = computed(() => {
    return 24 / exportTabs.length
})


const checked = (function () {
    const key = "showOtherUserWork"
    let ret = $ref(localStorage.getItem(key) == "1");

    return computed({
        get() {
            return ret
        },
        set(val) {
            localStorage.setItem(key, val ? "1" : "0");
            ret = val;
            nextTick(() => {
                init();
            })
        }
    })

})()

const diaForm = $ref<provideForm<workItem>>({
    open: false,
    action: "",
    item: {} as workItem,
    openStep: false
});

let searchIng = false;
let filter = $ref({
    group: undefined,
    txt: "",
    dept: ""
});

let timeEl = $ref<any>();
let setTimeVisible = $ref(false);
let data = $ref(workData);
let loading = $ref(false);

let group = $ref<{
    [key: number]: any
}>({});





exportTabs.forEach((elem) => {
    data[elem.id] = [];
})


/**
 * 弹出表单
 * @param action 状态 添加还是编辑
 * @param item 编辑下才用到
 */
function popDialog(action: string, item: any) {
    diaForm.open = true;
    diaForm.action = action;
    diaForm.item = item;
}

/** 弹出任务流程窗口 */
function popStep(action: string, item: any) {

    diaForm.action = action;
    diaForm.item = item;
    diaForm.openStep = true;

}

function onStepClose() {
    if (diaForm.action != "step") {
        nextTick(() => {
            init();
        })
    }

}


function groupBy(val: any[], key: string) {
    const retVal: any = {};
    val.forEach((elem) => {
        retVal[elem[key]] = elem
    })
    return retVal;
}



function onSearch() {

    if (!searchIng && filter.group == undefined && !filter.txt && !filter.dept) {
        return;
    }

    searchIng = !!filter.txt || !!filter.dept; 
    init();

}

async function init() {



    const loading = ElLoading.service({
        lock: true,
        text: '正在获取数据...',
        background: 'rgba(0, 0, 0, 0.7)',
    })

    try {
        {
            const [error, result] = await to(groupGet());

            result!.forEach((elem) => {
                group[elem.id] = {
                    id: elem.id,
                    name: elem.name,
                    child: groupBy(elem.child, "id"),
                    color: elem.color || ""
                }
            });
        }

        const [error, result] = await workGet(filter.group, filter.txt, filter.dept, checked.value);

        Object.keys(result!).forEach((elem) => {
            data[elem].length = 0;

            nextTick(() => {
                data[elem] = result![elem];
            })
        });


        setTimeout(() => {




        })

    } finally {
        loading.close();

        window.timeStrt && window.timeStrt();

    }


}




provide("diaForm", diaForm);
provide("data", data);
provide("group", group);


init();

if (getSearch("itceshi")) {
    window.itceshi = true;
}




</script>

<script lang="ts">
export default {
    name: "",
    title: "任务管理"
}
</script>

<style lang="scss">
.work-view {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .work-view-utils {

        height: 50px;
        margin-bottom: 10px;

        display: flex;


        .el-card {
            height: 100%;

            .el-card__body {
                height: 100%;

                display: flex;
                align-items: center;
            }
        }

        .el-card__body {
            padding: 0;
        }

        .main {
            flex: 1;
            padding-left: 10px;

        }

        .utils {
            margin-left: 10px;
            padding: 0 10px;

            .el-icon {
                cursor: pointer;


                &:last-child {
                    margin-left: 10px
                }
            }
        }
    }

    .work-view-abs {
        flex: 1;
        overflow: hidden;
    }

    .work-column {
        width: 100%;
        height: 100%;
    }

}
</style>

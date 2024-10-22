<template>
    <div id="my-session" class="wh-full">

        <div class="declare-view">
            <h3 class="title">我的会议</h3>

            <div class="relative flex-1">
                <div class="wh-full overflow-hidden" ref="tabEl">
                    <el-tabs v-model="activeName" type="border-card" @tab-change="onTabChange">
                        <el-tab-pane v-for="item in tagList" :label="item.label" :key="item.id"
                            :name="item.id"></el-tab-pane>

                        <div class="prepare-content relative" 
                            v-loading="loading" 
                            element-loading-text="正在操作中"
                            element-loading-background="rgba(0, 0, 0, 0.7)">
                            <collapse-list :data="list">

                                <template #item="{ item }">
                                    <meet-item :item="item" :type="nowActive" :refresh="refresh" :cancel="cancelUser">
                                        <template #right-item>
                                            <div class="text-right">
                                                <el-button type="danger" size="small" @click.stop="onClickDel(item)"
                                                    v-if="(nowActive == 0 || nowActive == 3 || nowActive == 6) && item.create_user === userName">删除会议</el-button>
                                            </div>
                                        </template>
                                    </meet-item>
                                </template>

                            </collapse-list>
                        </div>
                    </el-tabs>
                </div>
            </div>

        </div>



    </div>
</template>

<script setup lang="ts">
import meetItem from "@/components/meetItem.vue"
import memo from "@/components/memo.vue"




import { ElForm, } from "element-plus"
import type { FormInstance, FormRules } from 'element-plus'
import collapseList from "@/components/collapseList.vue"


import to from "await-to-js"

import { MessageBoxWarning } from "@/utils/elementLib"
import { getMyList, getMyStart, getMyEnd, getMyApt, getMyMark, delMy, isSettingAdmin, getMyProdu, getMyFollow } from "@/api"
import { getUserName } from "@/store/user"
import HammerInit from "@/views/Hammer"


let cancelUser = $ref(false);


const tabEl = $ref<HTMLElement>();

const list = $ref<mettItems>([]);
const activeName = $ref(0);
let nowActive = $ref(0);
let loading = $ref(false);
const userName = $ref(getUserName())


const tagList = [
    {
        id: 0,
        label: "待开",
        event: getMyList

    },
    {
        id: 5,
        label: "在产会议",
        event: getMyProdu
    },
    {
        id: 4,
        label: "已确认",
        event: getMyMark
    },
    {
        id: 6,
        label: "我执行",
        event: getMyFollow
    },
    {
        id: 1,
        label: "已开",
        event: getMyStart

    },
    {
        id: 2,
        label: "结案",
        event: getMyEnd
    }
]


async function getData(value: number) {
    if (loading) {
        return;
    }

    const tag = tagList.find((elem) => elem.id == value)!;


    const [err, data] = await to(tag.event());

    if (err) {
        loading = false
        return;
    }


    list.length = 0;
    list.push(...data);

    nowActive = value;

    loading = false

}
function refresh() {
    getData(nowActive);

}


function onTabChange(value: number) {

    getData(value);

}

async function onClickDel(item: mettItem) {
    try {
        await MessageBoxWarning("确定删除此会议", "提示", true)
    } catch {
        return;
    }

    loading = true;
    const [err] = await to(delMy(item.id));


    loading = false;
    getData(nowActive);




}





onTabChange(activeName)

onMounted(async () => {

    const [err, data] = await to(isSettingAdmin());
    if (err) {
        return;
    }



    cancelUser = data && data.cancel == 1;

    HammerInit();
})





</script>

<script lang="ts">
export default {
    name: "",
    title: "我的会议"
}
</script>

<style lang="scss">
.el-overlay.is-message-box .el-overlay-message-box {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-message-box {
        width: 80%;
    }
}

#my-session {
    flex: 1;

    audio {
        width: 0;
        height: 0;
    }

    .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: #66b1ff;
    }

    .declare-view {
        position: relative;
        height: 100%;

        padding-top: 5px;
        max-width: 800px;
        padding-bottom: 10px;
        margin: auto;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;


    }

    .el-result {
        max-width: 800px;
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        padding: 10px;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        background: white;


    }


    .el-input__inner[disabled] {

        color: #999 !important;
        -webkit-text-fill-color: #999 !important;
        opacity: 1 !important;

    }

    .declare_header.title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: white;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: rgb(102, 177, 255);
    }

    form {
        position: relative;
        padding: 10px;
        padding-top: 0px;

        &.grouperror {
            height: 350px;
        }

        .el-result {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(255, 255, 255);
        }

        .el-select {
            * {
                user-select: none;
            }
        }

        .time-input {
            &>.el-form-item__label-wrap {
                display: none;
            }
        }

        .result .el-tag__content {
            font-size: 20px;
        }
    }

    .el-tabs,
    .el-tabs__content,
    .prepare-content,
    .end-content,
    .all-content {
        width: 100%;
        height: 100%;
    }

    .el-tabs {
        display: flex;
        flex-direction: column;
    }

    .el-tabs--border-card>.el-tabs__content {
        padding: 0;
    }

    .prepare-content {
        .el-collapse {
            overflow: auto;
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .el-collapse-item__content {
            padding-bottom: 0;
        }

    }

}
</style>

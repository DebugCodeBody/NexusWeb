<template>
    <div class="w-full h-full flex flex-col overflow-hidden">
        <div class="mb-20px flex">
            <div class="flex-shrink-0 flex flex-col justify-center mr-10px">
                <span>订单号</span>
            </div>
            <el-input v-model="order" placeholder="请输入订单号" @keydown.enter="onClickOrderQuery"></el-input>
            <el-button class="flex-1 ml-10px" type="primary" :disabled="!order"
                @click="onClickOrderQuery">查询</el-button>
        </div>
        <div>

        </div>
        <div class="w-full h-full document overflow-hidden">
            <div class="w-full h-full flex flex-col">
                <div class="head">
                    <span class="back" @click="onClickLastDir"
                    :class="{
                        disabled: disabledBack
                    }">返回上一级</span>
                    <span class="back" @click="onClickPackDownLoad" :class="{
                        disabled: disabledPack
                    }">打包下载</span>
                    <span v-for="(item, index) in dirStack" :key="item">
                        <span>{{ item }}</span>
                        <span v-if="index < dirStack.length - 1"> > </span>
                    </span>
                </div>
                <el-scrollbar>
                    <div class="w-full h-full">

                        <template v-if="folderList.length > 0 || fileList.length > 0">
                            <div class="item" v-for="item, index in folderList" :key="index"
                                @click="onClickFolder(item)">
                                <div>
                                    <el-icon>
                                        <dirIcon />
                                    </el-icon>
                                </div>
                                <div class="name">
                                    <span>{{ item }}</span>
                                </div>
                            </div>
                            <div class="item" v-for="item, index in fileList" :key="index"
                                @click="onClickDownload(item)">
                                <div>
                                    <el-icon>
                                        <Document />
                                    </el-icon>
                                </div>
                                <div>
                                    <span>{{ item }}</span>
                                </div>
                            </div>
                        </template>

                        <el-empty description="暂无文档数据" v-else />
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { Document, Folder } from '@element-plus/icons-vue'
import dirIcon from "./dirIcon.vue"



import to from "await-to-js"

import { messageError, MessageBoxInfo } from "@/utils/elementLib"
import { getFileList, download } from "@/api"
import urlSearch from "@/utils/urlSearch"


let order = $ref("");
const dirStack: string[] = $ref([]);

const folderList = $ref<string[]>([]);
const fileList = $ref<string[]>([]);

let lock = false;


const disabledPack = $computed(() => {
    return folderList.length == 0 && fileList.length == 0;
})
const disabledBack = $computed(() => {
    return dirStack.length <= 1;
})


async function getListFiles(pathStr: string) {

    if (lock) {
        return;
    }



    lock = true;
    const [err, result] = await to(getFileList([...dirStack, pathStr].map((elem) => elem.replace(/\s/g, "")).join("/")))
    lock = false;

    fileList.splice(0, fileList.length);
    folderList.splice(0, folderList.length);

    if (!err) {
        fileList.push(...result.fileList)
        folderList.push(...result.folderList)
        dirStack.push(pathStr);


        if(!order){
            order = pathStr
        }

    }

}


function onClickOrderQuery() {
    if (order == "") {
        messageError("请输入订单号");
    } else {

        order = order.replace(/\s/g, "");

        dirStack.splice(0, dirStack.length);

        const regexResult = order.match(/([a-zA-z]\d+)-\d+/);
        if (regexResult) {
            dirStack.push(regexResult[1])
        }

        getListFiles(order);
    }

}

function onClickFolder(child: string) {
    getListFiles(child)
}
function onClickLastDir() {
    if(disabledBack){
        return;
    }
    dirStack.pop();
    getListFiles(dirStack.pop()!);
}

function onClickPackDownLoad() {
    if (disabledPack) {
        return;
    }
    openDownLoad(dirStack.join("/"), {
        pack: true
    });

}

function onClickDownload(file: string) {
    openDownLoad(dirStack.join("/"), {
        name: file
    });
}


function openDownLoad(order: string, o: {
    name?: string,
    pack?: boolean | number
}) {

    o.pack = o.pack ? 1 : 0;

    const urlParams = [`order=${encodeURIComponent(order)}`];
    if(o.name){
        urlParams.push(`name=${encodeURIComponent(o.name)}`)
    }
    if(o.pack != null){
        urlParams.push(`pack=${o.pack ? 1 : 0}`)
    }


    window.open(`./download?${urlParams.join("&")}`)

}


onMounted(() => {
    const urlOrder = urlSearch("order");
    if (urlOrder) {
        getListFiles(urlOrder);
    }
})




</script>

<script lang="ts">
export default {
    name: "",
    title: "耐萨斯-生产文档"
}
</script>

<style lang="scss">
.document {
    background-color: white;


    .head {
        height: 35px;
        font-size: 12px;
        padding: 8px 10px;

        .back {
            cursor: pointer;
            color: #388fc9;

            &::after {
                content: "|";
                margin: 5px;
                color: black;
            }

            &.disabled {
                color: #c0c4cc;
                cursor: not-allowed;
            }
        }
    }

    .item {
        display: flex;
        align-items: center;
        cursor: pointer;
        height: 44px;
        padding-left: 10px;
        text-align: center;
        overflow: hidden;

        &:hover {
            color: #328be7;
            cursor: pointer;
            background: #f4f9fe;
        }

        .el-icon {
            font-size: 32px;
        }

        .name {
            margin-left: 10px;
        }

        span{
            white-space: nowrap;
        }

    }


}
</style>

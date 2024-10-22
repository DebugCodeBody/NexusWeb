<template>
    <div class="process-info">

        <el-card class="tab_process_box-card">
            <div class="process-table">
                <el-table :data="tableData" :border="true" style="width: 100%" :cellStyle="cellStyle"
                    v-if="tableData.length > 0" ref="tableEl">
                    <el-table-column v-for="index in tableData[0].length" :prop="index.toString()" :key="index"
                        :width="flexColumnWidth(index)">
                        <template #default="{ row }">
                            <div :class="`process_${index}`">
                                <div class="name"><span>{{ row[index - 1].name }}</span></div>
                                <div class="other">
                                    <span>{{ row[index - 1].hours }}</span>
                                    <span> {{ row[index - 1].time }} </span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-card class="utils">
            <div>
                <a :href="getOrderUrl(order)">{{ order }}</a>
                <a :href="getOrderUrl(orderPath)">{{ orderPath }}</a>
                <span style="margin-right: 10px;" v-if="samedocLen">关联文档：</span>
                <a :href="getOrderUrl(item)" v-for="(item, index) in processInfo.samedoc" :key="index"
                    style="color: rgb(255, 60, 255);">{{ item }}</a>
            </div>

            <a href="../media/zip/NexusNet.zip" target="downloadFile">
                <el-icon style="font-size: 18px;">
                    <Download />
                </el-icon>
            </a>


        </el-card>

        <div class="order-img" ref="orderImg">
            <el-card>
                <div style="height: 100%;cursor: pointer;" @click="openImg" ref="img">
                    <el-image :src="getOrderImg((processInfo.filename && processInfo.filename[0] || ''))">
                        <template #placeholder>
                            <div class="load-slot image-slot">加载图片中<span class="dot">...</span></div>
                        </template>
                        <template #error>
                            <span class="demonstration">该单号没有文档图片</span>
                            <div class="error-slot image-slot">
                                <el-icon>
                                    <icon-picture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                </div>
            </el-card>
        </div>


    </div>
</template>

<script setup lang="ts">

import { ElTable } from 'element-plus'

import Viewer from "viewerjs"

import { getOrderUrl } from "@/utils/order"

const colorTable: any = {
    "done": "yellow",
    "draft": "white",
    "startworking": "red",
    "resume": "rgb(166,202,240)",
    "pause": "rgb(192,220,192)"
}


const order = inject<string>("order")!;
const orderPath = inject<string>("orderPath")!;
const processInfo = inject<workInfo>("info")!;
const tableData = inject<Process[]>("tableData")!;


const img = $ref<HTMLElement>();

let samedocLen = $computed(() => {
    const arr = processInfo.samedoc;
    return (arr && arr.length || 0) > 0
})



let tableEl = $ref<InstanceType<typeof ElTable>>();


/** 缓存表格列的宽度，不然的话会一直调用函数计算宽度导致列宽无限增加 */
const tableWidth: any = {

}


function getOrderImg(val: string) {
    if (!val) {
        return ""
    }
    if (process.env.NODE_ENV == "production") {
        return `../media/smb/${val}`
    } else {
        return `/media/smb/${val}`
    }

}


function openImg() {
    if ((img as any)["viewer"]) {

        (img as any)["viewer"].show(0);
        return;

    }
    const imgView = new Viewer(img, {
        inline: false,
        toolbar: true,
        title: false,
        navbar: false,
        button: false,
        transition: false,
        rotatable: true,
        zIndexInline: 9999
    });
    imgView.view();
}


/** 计算列表宽度 */
function flexColumnWidth(index: number) {
    const name = document.querySelector(`.process_${index} .name`)
    const other = document.querySelector(`.process_${index} .other`)
    if (name && other && !tableWidth[index]) {
        const nameWidth = name.scrollWidth
        const otherWidth = other.scrollWidth
        const width = Math.max(nameWidth, otherWidth) + 24 + 10

        tableWidth[index] = width;
        return width;
    }

    return tableWidth[index] || 100
}


/** 获取表格颜色 */
function cellStyle(val: any) {
    const { row, columnIndex } = val;
    return {
        "background-color": colorTable[row[columnIndex].state] || "white",
        "color": "black"
    }
}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.process-info {
    width: 100%;
    height: 100%;

    display: flex !important;
    flex-direction: column;
    overflow: hidden;

    &>div:not(:first-child) {
        margin-top: 10px;
    }

    .process-table {
        min-height: 63px;

        .el-table__header-wrapper {
            display: none;
        }

        td {

            .name,
            .other {
                white-space: nowrap;
            }

            .other {
                display: flex;
                justify-content: space-between;
            }
        }
    }

    .utils {
        .el-card__body {
            display: flex;
            align-items: center;

            justify-content: space-between;
        }

        a {
            margin-right: 20px;
            cursor: pointer;
        }
    }


}
</style>

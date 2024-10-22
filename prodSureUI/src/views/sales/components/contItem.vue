<template>

    <div class="item">
        <div class="header">
            <slot name="header"></slot>
            <h2 class="title">{{ $attrs.title }}</h2>
        </div>
        <el-scrollbar class="content">
            <template v-for="item in data">
                <div class="order" :key="item.askid" v-if="item.show">
                    <div class="order-item">
                        <div class="photo">
                            <el-image v-for="(src, index) in item.imgfile" :key="index" :src="getStaticImgSrc(src)" lazy
                                @click.capture="onImgView"></el-image>
                        </div>
                        <div class="order-info-content">
                            <div class="order-info">
                                <p>工单号：<a :href="toInfoUrl(item.orderid)" target="_blank">{{ item.orderid }}</a> <span class="time">{{
                                fromeDate(item.createdate) }}</span></p>
                            </div>
                            <div class="order-info">
                                <p>提问人：{{ item.askname }}</p>
                            </div>
                            <div class="order-info">
                                <p>销售专员：{{ item.salname }}<span class="honour" v-if="item.standup">
                                        <el-icon>
                                            <View />
                                        </el-icon>已上机
                                    </span></p>
                            </div>
                            <div class="order-info">
                                <p>详细描述：{{ item.memo }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="order-button">
                        <div class="order-info">
                            <el-button v-if="type != paskStateEnum.CLOSE"
                                @click.stop="onClickOrder(item, table[paskStateEnum.TRACK])">处理</el-button>
                            <el-button v-else @click.stop="onClickOrder(item, null)">查看详细</el-button>
                        </div>
                    </div>
                </div>
            </template>
        </el-scrollbar>
    </div>

</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, useAttrs, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElMessage } from 'element-plus'


import { Dialog, seleItem, paskList, setp, table, nextSetp, getWorkProcess, getStaticImgSrc } from "../hooks/data"
import { paskType, paskTypes } from "@/module/paskType"
import { paskSetps } from "@/module/paskStep"

import paskStateEnum from "@/enums/paskStateEnum"


import "viewerjs/dist/viewer.css";
import viewerjs from "viewerjs";
import Viewer from "viewerjs"

let imgviewer: Viewer | undefined;

const Props = defineProps<{
    data: paskTypes
    type: paskStateEnum
}>();

onMounted(() => {
})



function onImgView(event: Event) {

    if (imgviewer) {
        imgviewer.destroy();
    }
    const target = (event.target as HTMLElement).parentElement as HTMLElement;

    imgviewer = new viewerjs(target, {
        inline: false,
        toolbar: false,
        title: false,
        navbar: false,
        button: false,
        transition: false,
        zIndexInline: 9999
    }
    );

    imgviewer.view(0)

}


async function onClickOrder(item: paskType, next: any) {

    nextSetp.value = null;
    seleItem.value = item;

    try {
        setp.value = await getWorkProcess(item) as any;

        Dialog.value = true;

    } catch (err: any) {
        ElMessage.error(err.msg || err.message || "其他错误，请联系管理员")

    }

}



function fromeDate(time: string) {
    const split = time.split(" ");

    return `${split[0].split("-").slice(1, 3).join("-")} ${split[1].split(":").slice(0, 2).join(":")}`
}

function toInfoUrl(val: string) {
    let retUrl = ''
    if (process.env.NODE_ENV == "production") {
        retUrl = `../order_info/index.html?order=${encodeURIComponent(val)}`
    } else {
        retUrl = `../order_info/index.html?order=${encodeURIComponent(val)}`
    }

    return retUrl;

}

</script>

<script lang="ts">
export default {
    name: "",
    inheritAttrs: false
}
</script>

<style lang="scss">
.order {
    display: flex;
    justify-content: space-between;

    .order-item,
    .order-button {
        font-size: 14px;
        display: flex;

        .order-info-content {

            display: flex;
            flex-direction: column;

        }

        .order-info {
            flex: 1;
            display: flex;
            align-items: center;

            .time,
            .honour {
                margin-left: 20px;
            }

            .honour {
                color: red;

                i {
                    vertical-align: middle;
                    margin-right: 5px;
                }
            }
        }

        button {
            height: 100%;
        }

    }

    .order-button {
        flex-direction: column;
    }


    .photo {
        margin-right: 10px;

        .el-image,
        img {
            &:first-child {
                margin: 0;
            }

            cursor: pointer;

            width: 100px;
            height: 100px;
            margin-left: 5px;
        }

    }
}
</style>

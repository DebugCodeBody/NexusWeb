<template>
    <div class="prodsure-view">
        <div class="prodsure-top-view" ref="topView">
            <template v-if="prodsure.length">
                <el-card v-for="(item, index) in prodsure" :key="index">
                    <div class="item">
                        <div class="img-view" @click="openImg">
                            <img-item :src="item.view.imgfile" />
                        </div>

                        <el-form label-width="auto">
                            <h4>{{ item.view.name }}</h4>
                            <el-form-item v-for="(logItem, index) in item.log.slice(0, 4)" :key="index">
                                <span>{{ joinLog(logItem, index) }}</span>
                            </el-form-item>
                            <div class="log-view">
                                <el-button type="primary" :icon="Tickets" @click="moreLog(item.log)" />
                            </div>
                        </el-form>
                    </div>
                </el-card>
            </template>
            <el-empty v-else description="该单号没有提问记录" />
        </div>

        <pop-log v-if="stepPop" v-model="stepPop" :step="selectStep" />
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

import popLog from "./popLog.vue"
import samedocTable from "./table.vue"
import imgItem from "./imgItem.vue"

import setTitle from "@/utils/step"
import { getOrderUrl } from "@/utils/order"

import { Tickets } from '@element-plus/icons-vue';
import { getProdsure } from "@/api"


import Viewer from "viewerjs"
import "viewerjs/dist/viewer.css";


const order = inject<string>("order")!;
const prodsure = $ref<any>([]);



let stepPop = $ref(false);
let selectStep = $ref<steps>([]);

const el = $ref(useCurrentElement());
const topView = $ref<HTMLElement>();


getProdsure(order).then((data: any) => {
    prodsure.push(...data);
});


function openImg(event: Event) {

    const imgView = new Viewer(event.target as any, {
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


function joinLog(log: any, index: number) {

    
    return `${dayjs(log.createdate).format('MM-DD hh:mm')} ${log.username} ${log.stage} ${log.memo ? "：" + log.memo : ""}`
}

function moreLog(log: any) {
    selectStep = log;
    stepPop = true;
}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.prodsure-view {
    height: 100%;
    display: flex;
    flex-direction: column;


    .el-form-item {
        margin-bottom: 0;
    }

    .el-form-item__label {
        padding-right: 0;
    }

    .el-card {
        margin-bottom: 10px;
    }

    .item {
        display: flex;

        .img-view {
            width: 100px;
            margin-right: 10px;
            flex-shrink: 0;
            cursor: pointer;

            img {
                width: 100%;
                height: 100%
            }
        }

        form {
            flex: 1;
            position: relative;
        }


    }

    .el-empty {
        padding: 10px;
    }

    .order-atta-list {
        flex: 1;


    }

    .log-view {
        position: relative;

        button {
            position: absolute;
            bottom: 0;
            right: 0;
        }

        .log-item {
            font-size: 14px;
        }
    }


    div.no-img{
        border: 1px solid silver;
        img{
            opacity: 0;
        }

    }

}
</style>

<template>
    <div class="item">
        <div class="head" v-if="false">
            <el-button size="small">转移</el-button>
            <el-button size="small">结案</el-button>
        </div>
        <div class="foote">
            <div class="left">
                <div class="img" @click="onImgClick">
                    <el-image :src="getImgSrc(data.img)" fit="cover" loading="lazy" />
                </div>
                <el-form label-width="85px" class="demo-ruleForm">
                    <el-form-item label="申请人：">
                        <span>{{ data.create_name }}</span>
                        <span class="time">{{ parseTime(data.create_date) }}</span>
                        <span class="time" v-if="data.tight" style="color: red">急用</span>
                    </el-form-item>
                    <el-form-item label="商品：">
                        <span>{{ data.name }}</span>
                    </el-form-item>
                    <el-form-item label="数量：" v-if="data.qty > 0">
                        <span>{{ data.qty }}</span>
                    </el-form-item>
                    <el-form-item label="详细描述：" class="detailed" style="word-break: break-all;">
                        <span>{{ data.remark }}</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="right">
                <el-button @click="onClick">处理</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, useAttrs } from "vue"

import { popUpIng } from "../store/popup"
import { selectItem } from "../store/data"
import moment from "moment"


import "viewerjs/dist/viewer.css";
import viewerjs from "viewerjs";



const Props = defineProps<{
    data: good
}>();

function onClick() {
    popUpIng.value = true;
    selectItem.value = Props.data;
}

function parseTime(str: string) {
    return moment(str).format("MM-DD HH:mm")
}

function getImgSrc(src: string) {
    if (process.env.NODE_ENV == "production") {
        return `../media/smb/${src}`.replace(/\\/g, "/")
    } else {
        return `/media/smb/${src}`.replace(/\\/g, "/")
    }
}

function onImgClick(event: Event) {
    const viewer = new viewerjs(event.target as HTMLElement,  {
        inline: false,
        toolbar: false,
        title: false,
        navbar: false,
        button: false,
        transition: false,
        zIndexInline: 9999
    });
    viewer.destroy();
    viewer.update();
    viewer.view(0);
}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" scoped>
.item {


    font-size: 14px;
    border-radius: 5px;
    border: 1px solid rgb(220, 223, 230);
    margin-bottom: 10px;

    display: flex;
    flex-direction: column;

    .head {
        height: 35px;
        display: flex;

        justify-content: end;
        align-items: center;
        padding-right: 10px;

        box-sizing: border-box;
        background-color: rgb(230, 230, 230);
    }

    .foote {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }

    .left {
        display: flex;

        .other {
            margin-left: 10px;
        }

        .time,
        .branch {
            margin-left: 10px;
        }

        .img {
            width: 100px;
            display: flex;
            cursor: pointer;
            border: 1px solid #dcdfe6;
            border-radius: 6px;
            overflow: hidden;

            img {
                width: 100%;
            }
        }

        form {
            flex: 1;
        }

    }

    .right {
        margin-left: 10px;

        button {
            height: 100%;

        }
    }

}

:deep(.el-form-item) {
    margin: 0;

    &.detailed {
        margin-top: 5px;

        .el-form-item__content span{
            word-break: break-all;
        }

        .el-form-item__content,
        .el-form-item__label {
            line-height: 20px;
        }

        .el-form-item__label {
            height: 20px;
        }

    }

    .el-form-item__content,
    .el-form-item__label {
        line-height: 30px;
        padding-right: 5px;
    }

    .el-form-item__label {
        height: 30px;
    }

}
</style>

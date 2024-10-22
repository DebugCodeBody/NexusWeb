<template>
    <div id="order">
        <h3 class="declare_header title">工单详细</h3>
        <el-form>
            <el-form-item label="工单单号">
                <el-input v-model="ruleForm.order" disabled />
            </el-form-item>

            <el-form-item label="工单图片">
                <div class="img-content">
                    <template v-for="(src, index) in imgList" :key="index">
                        <el-image :src="src" fit="fill" @click="onClickImg(index)" />
                    </template>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import Viewer from "viewerjs"
import "viewerjs/dist/viewer.css";

import { queryOrderDetailed } from "@/api"
import { getUserName } from "@/utils/auto"

import { ElMessage } from 'element-plus'

let imgView: Viewer | undefined;



const ruleForm = reactive({
    order: "",
    barcode: "",
    filename: [] as string[]
})

const imgList = ref<Array<string>>([]);



queryOrderDetailed(window.urlSearch.order).then((data) => {

    ruleForm.order = data.orderid;
    ruleForm.barcode = data.moid;

    ruleForm.filename = data.filename.map((elem) => {
        if (process.env.NODE_ENV == "production") {
            return `./img/${elem}`
        } else {
            return `api/img/${elem}`
        }
    });

    ruleForm.filename.forEach((elem) => {
        const img = new Image();

        img.src = elem;

        img.onload = function () {
            imgList.value.push(elem);
        }
    })

}).catch((error: any) => {

    ElMessage.error("获取订单详细失败，请稍后重试");

})




function onClickImg(index: number) {

    imgView = new Viewer(document.querySelector(".el-image")!, {
        inline: false,
        toolbar: false,
        title: false,
        navbar: false,
        button: false,
        transition: false,
        zIndexInline: 9999
    });
    imgView.view(index)

}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
#order {
    position: relative;
    height: 100%;

    padding: 10px;
    padding-top: 10px;
    max-width: 800px;
    padding-bottom: 20px;
    margin: auto;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    
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
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        position: relative;
        padding: 10px;

        .el-result {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(255, 255, 255);
        }

        .charge-order,
        .charge-barnch {
            .el-form-item__content {
                &>:first-child {
                    flex: 1;
                }

                .el-button {
                    margin-left: 10px;
                }
            }
        }

    }

    .el-image {
        &>img {
            margin-bottom: 10px;
            cursor: pointer;
        }
    }

    .el-image-viewer__canvas {
        cursor: pointer;
    }


}
</style>

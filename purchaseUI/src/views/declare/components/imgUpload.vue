<template>
    <el-upload id="elUpload" ref="imgUpload" list-type="picture-card" accept="image/png, image/jpeg"
        :auto-upload="false"
        :disabled="updateDisabled"
        v-model:file-list="fileList">

        <el-icon>
            <Plus />
        </el-icon>
        <template #file="{ file }">
            <imgItem :value="file"/>
        </template>

    </el-upload>
</template>

<script setup lang="ts">
import imgItem from "./imgItem.vue"

import { ref, reactive, nextTick, defineEmits, defineProps,defineExpose, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { fileList, updateDisabled } from "../store/data"


const imgUpload = ref();

function handleStart(){
    imgUpload.value.handleStart();
}


defineExpose({
    handleStart
})

</script>

<script lang="ts">
export default {
    name: "imgUpload"
}
</script>

<style lang="scss">
#elUpload {
    .el-upload-list__item-thumbnail {
        object-fit: fill;
    }

    .el-upload-list {
        div {
            height: 100%;
            width: 100%;
        }

        li:focus {
            outline: none;
        }
    }

    .el-upload-list__item {
        width: 100%;
        height: 100%;
    }

    .el-image-viewer__canvas {
        img {
            transform: scale(0.9) rotate(0deg);
        }
    }

    .el-upload-list--picture-card .el-upload-list__item-actions:hover {
        opacity: 0;
    }

    .el-upload-list__item-actions.shade {
        opacity: 1 !important;

        .el-upload-list__item-preview,
        .el-upload-list__item-delete {
            display: inline-block !important;
        }
    }

    li.el-upload-list__item.is-fail {
        box-shadow: -1px -1px 10px 0px rgba(255, 0, 0, 1);
    }
}
</style>

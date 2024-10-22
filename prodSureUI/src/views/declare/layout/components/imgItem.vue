<template>
    <div class="file-item" @click="onClick">
        <img class="el-upload-list__item-thumbnail uploadImg" :src="value.url" />
        <span class="el-upload-list__item-actions" :class="{ shade: shade }">
            <template v-if="shade">
                <span class="el-upload-list__item-preview" @click.stop="onZoomIn">
                    <el-icon>
                        <ZoomIn />
                    </el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click.stop="onDelete" v-if="!submitDone">
                    <el-icon>
                        <Delete />
                    </el-icon>
                </span>
            </template>
        </span>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { fileList, imgView, submitDone } from "../hooks/data"
import type { UploadFile, UploadFiles } from "element-plus";
import { ElMessage, ElMessageBox } from 'element-plus'

let time = 0;
const shade = ref(false)

const props = defineProps<{
    value: UploadFile
}>();

function colseShade() {
    if (time > 0) {
        clearTimeout(time);
        time = 0;
    }
    shade.value = false;

}

function onClick() {
    shade.value = true;
    time = window.setTimeout(() => {
        time = 0;
        colseShade();
    }, 1000)
}

function onZoomIn() {

    colseShade();


    imgView.value!.destroy();
    imgView.value!.update();
    imgView.value!.view(0);

}

async function onDelete() {
    colseShade();

    try {
        await ElMessageBox.confirm('确定是否删除图片', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
        })
        fileList.value.splice(0, 1);

    } catch {
        return;

    }


}

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
</style>

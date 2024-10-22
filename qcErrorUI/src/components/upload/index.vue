<template>
    <el-upload v-model:file-list="fileList" list-type="picture-card" :auto-upload="false" class="file-upload">
        <el-icon>
            <Plus />
        </el-icon>
    </el-upload>
</template>

<script setup lang="ts">
import { ElUpload } from 'element-plus'

// import type { UploadFiles } from 'element-plus'

const Emit = defineEmits<{
    (e: 'update:modelValue', value: any[]): void;
}>();

const Props = defineProps<{
    modelValue: any[]
}>();

let el = $ref(useCurrentElement());
const fileList = $ref<any[]>([]);

watch($$(fileList), (value) => {
    Emit('update:modelValue', value.map((elem) => ({ name: elem.name, file: elem.raw })));
}, {
    deep: true
});

function handleStart() {
    el.querySelector<HTMLElement>(".el-upload__input")!.click()
}


defineExpose({
    handleStart
})


</script>

<script lang="ts">
export default {
    name: ""
}


export interface UploadFile{
    name: string,
    file: File
}
export type UploadFiles = UploadFile[];


</script>

<style lang="scss">
.file-upload {

    .el-upload--picture-card,
    .el-upload-list .el-upload-list__item {
        height: 100px;
        width: 100px;
    }

    .el-upload-list--picture-card .el-upload-list__item-thumbnail {
        object-fit: fill;
    }

}
</style>

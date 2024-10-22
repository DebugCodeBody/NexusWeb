<template>


    <div class="relative">
        <div class="p-5px">

            <el-form :model="formData" :hide-required-asterisk="true" :rules="rules" label-width="auto" ref="formEl">

                <el-form-item label="图纸名" prop="tissue">
                    <span>{{ select.item?.name }}</span>
                </el-form-item>

                <el-form-item label="图纸图片" prop="tissue">
                    <div class="w-120px h-120px overflow-hidden">
                        <image-viewer :src="imgPath" />
                    </div>
                </el-form-item>

                <el-form-item label="新图纸" prop="fileCount">
                    <el-upload 
                        class="upload-pdf" 
                        v-model:file-list="fileList" 
                        multiple 
                        :auto-upload="false">
                        <el-button type="primary" v-if="!disabledUpload">上传图纸</el-button>
                        <el-button @click="onClickClearFile" v-else>清除文件</el-button>
                        <template #tip>
                            <div class="el-upload__tip">
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="留言" prop="fileCount">
                    <el-input v-model="formData.memo" type="textarea"></el-input>
                </el-form-item>

            </el-form>

            <div class="button-block mt-10px">
                <el-button type="primary" :loading="submitLoading" @click="onClickSubmit">提交更新</el-button>
                <el-button class="mt-10px" :loading="submitLoading" @click="onClickReturn">返回</el-button>
            </div>

        </div>


    </div>

    <div class="wh-full">

    </div>
</template>

<script setup lang="ts">
import imageViewer from "@/components/imageViewer/index.vue";


import to from "await-to-js";

import { ElForm, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

import type { UploadProps, UploadUserFile } from 'element-plus'

import { uploadFile, updateFile } from "@/api/update"


import dataManage from "./dataManage"

const Emit = defineEmits<{
    (e: 'done' ): void;
}>();

const { select } = dataManage;

const formData = $ref({
    fileCount: 0,
    memo: ""
});

const fileList = $ref<UploadUserFile[]>([



]);

const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    fileCount: [
        {
            validator(rule, value, callback, source, options) {

                let retError: Error | undefined = undefined;

                if (!fileList.length) {
                    retError = new Error("请上传新的图纸")
                }

                callback(retError);

            },
        }
    ]
});


let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);

let disabledUpload = $computed(() => {
    return !!fileList.length
})

let imgPath = $computed(() => {

    let retValue = "";
    if(select.item){
        
        retValue =  `/ding/media/smb/${select.item.img}`
        
        
    }


    return retValue ;


    
})


async function onClickSubmit() {

    try {
        await formEl.validate();
    } catch {
        return;
    }

    const [fileItem] = fileList;

    const data = new FormData();

    data.append("file", fileItem.raw!,  fileItem.name);


    try {

        submitLoading = true;

        let [err, path] = await to(uploadFile(data));
        if (err) {

            return;
        }

        [err] = await to(updateFile(select.item!.solid, fileItem.name, path!, formData.memo));
        if (err) {
            return;
        }

        onClickReturn();

        Emit("done");


    } finally {
        submitLoading = false;
    }




}


function onClickReturn() {

    dataManage.setSelectItem();

    nextTick(() => {
        fileList.length = 0;
    })

}


function onClickClearFile(event: Event) {

    event.stopPropagation();
    event.preventDefault();

    fileList.length = 0;

}

watch(() => select.item, (value) => {

    if (!value) {
        return;
    }

    if (formEl) {
        formEl.resetFields();
    }

})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.upload-pdf {
    width: 100%;
}
</style>

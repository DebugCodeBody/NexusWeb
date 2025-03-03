<template>
    <div class="upload-file" :class="{
        'if-max': ifMax
    }">
        <el-upload :list-type="type" :auto-upload="false" v-model:file-list="fileList" :disabled="disabled">
            <el-icon>
                <Plus />
            </el-icon>
        </el-upload>
        <div class="paste-img" v-if="pasteImg">
            <el-button @click="onPaste" :disabled="disabled">粘贴图片</el-button>
        </div>
    </div>
</template>



<script setup lang="ts">
import { search } from "../orderInput/api";
import { zipImg } from "./utils"
import httpUpload from "./http"
import { UploadFile, UploadRawFile, UploadFiles, ElMessage } from "element-plus"


const Emit = defineEmits<{
    (e: 'update:modelValue', value: number): void;
}>();

const Props = withDefaults(defineProps<{

    /** 是否是否允许粘贴图片 */
    isPasteImg?: boolean

    /** 上传文件类型 */
    type?: string,

    /** 已经上传的文件数量 */
    modelValue: number,

    /** 允许上传的最大数量 */
    max?: number,

    /** 宽度 */
    width?: number,
    /** 高度 */
    height?: number,
    disabled?:boolean


}>(), {
    type: "picture-card",
    isPasteImg: true,
    width: 100,
    height: 100,
    disabled: false
});

const fileList = $ref<UploadFiles>([]);

watch(() => fileList, (value) => {
    Emit('update:modelValue', value.length);
}, {
    deep: true
})


const height = computed(() => {
    return `${Props.height}px`
})

const width = computed(() => {
    return `${Props.width}px`
})


/** 上传文件数量是否达到允许上传量 */
const ifMax = $computed(() => {
    if (Props.max) {
        return fileList.length >= Props.max;
    } else {
        return false;
    }
})

/** 判断一下是否需要粘贴图片按钮 */
const pasteImg = $computed(() => {
    return Props.type == "picture-card" && Props.isPasteImg && !('ontouchstart' in document) && !ifMax && navigator.userAgent.indexOf("dingtalk") == -1
})

async function onPaste(event: Event) {
    try {
        const [Item] = await navigator.clipboard.read();


        if (Item.types.indexOf('image/png') && Item.types.indexOf('image/jpg')) {
            throw Item;
        }

        const img = await Item.getType(Item.types[0])

        const updateImg = {} as UploadFile;

        updateImg.name = `${Date.now()}.${Item.types[0].split("/")[1]}`;
        updateImg.url = window.URL.createObjectURL(img);
        updateImg.raw = img;

        fileList.push(updateImg);

    } catch (error) {
        ElMessage.error("剪辑板没有图片")
    }
}

async function getFile() {

    const src: string[] = [];
    let file: any[] = [];

    const { length } = fileList;
    for (let i = 0; i < length; i++) {
        const element = fileList[i];
        if (element.url.slice(0, 4) != "blob") {
            src.push(element.name)
        } else {
            file.push(zipImg(element.raw as File));
        }
    }

    if (file.length > 0) {

        file = await Promise.all(file);

    }

    return {
        /** 上一次的图片链接 */
        src,
        /** 当前上传的新图片 */
        file
    }
 
}

async function setFile(src: string | string[]) {
    

    if(!Array.isArray(src)){
        if(!src){
            return
        }
    }

    src.forEach((urlItem)=>{
        
        const updateImg = {} as UploadFile;

        updateImg.name = urlItem;
        updateImg.url = `../media/smb/${urlItem}`;

        fileList.push(updateImg);

    });



}

async function uploadFile(){

    const { src, file }  = await getFile();

    


    for (let index = 0; index < file.length; index++) {

        const fileItem = file[index];

        const sendImg = new FormData();
        sendImg.append("file", fileItem, "file.jpg");

        const url = await httpUpload(sendImg);

        // 上传成功的图片要把它设置成src，避免多次上传

        




        src.push(url);




    }




    return src;


}


function clear(){

    fileList.splice(0,fileList.length);

}



defineExpose({
    getFile,
    setFile,
    clear,
    uploadFile
});

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" >
%wh {
    width: v-bind(height);
    height: v-bind(width);
}


.upload-file {

    &.if-max {
        .el-upload--picture-card {
            display: none;
        }
    }


    display: flex;

    .el-upload-list {

        .el-upload--picture-card,
        .el-upload-list__item {
            @extend %wh;


            img {
                object-fit: fill;
            }
        }

    }

    .paste-img {
        @extend %wh;

        margin-left: 10px;
        border-radius: 6px;

        .el-button {
            width: 100%;
            height: 100%;
            border-radius: 6px;
        }
    }


}
</style>

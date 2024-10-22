<template>
    <div class="ca-drop-zone ">
        <div class="drop-zone" @click="onClickUpload" ref="dropZoneRef">
            <!-- <img :src="require('@/assets/img/drop-zone-pic.png')" class="drop-zone-icon"> -->
            <p class="drop-zone-heading">新报价:请将文件拖拽到此上传, 或点击<a href="#" role="button" data-cl-id="854098247">上传</a>
            </p>
            <p class="drop-zone-subheading">你也可以一次性将多个文件拖拽上传</p>
            <p class="drop-zone-text">实时报价支持的3D文件格式为:STEP, STP, SLDPRT, STL, SAT, 3DXML, PRT, ITP, CATPART, X_T,
                PTC, X_B<br>支持人工报价 (报价24小时内有效) 的2D文件格式为: DWS, DWF, DWG, DXF, PDF files</p>
            <p class="drop-zone-confidential"><span class="drop-zone-confidential-icon"></span>所有上传内容都是安全和保密的</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFileDialog, useDropZone, objectPick } from '@vueuse/core'
import { basename, isZip, fileSuffix, isPermitFle } from "@/utils/path"

import JSZip from 'jszip'

const Emit = defineEmits<{
    (e: 'uploadFile', value: any[]): void;
}>();




const dropZoneRef = ref<HTMLDivElement>();

const { files, open, reset } = useFileDialog({
    accept: fileSuffix.map((elem) => `${elem}`).join(", ")
});

async function unZip(zipList: File[]) {

    const retArr = [] as any[];

    for (let index = 0; index < zipList.length; index++) {
        const element = zipList[index];

        const jszip = new JSZip()

        const zipValue = await jszip.loadAsync(element);

        zipValue.forEach((filePath, zipItem) => {

            if (zipItem.dir) {
                return;
            }

            if (isPermitFle(filePath)) {
                
                let nameSplit = filePath.split("/");

                const fileName = nameSplit.pop()!;

                retArr.push({
                    name: fileName,
                    path: filePath,
                    value: zipItem
                })

            }

        })

    }

    return retArr;

}

async function onDrop(files: File[] | null) {
    if (files == null || files.length == 0) {
        return;
    }

    let zipList = [] as any[];
    let fileList = [] as any[];


    for (let index = 0; index < files.length; index++) {
        const elem = files[index];
        const { name } = elem;


        if (isPermitFle(name)) {

            if (isZip(name)) {
                zipList.push(elem);
            } else {

                fileList.push({
                    name: name,
                    value: elem
                })

            }

        }

    }

    if (zipList.length > 0) {
        const zipFiles = await unZip(zipList);

        fileList.push(...zipFiles);

    }



    Emit("uploadFile", fileList);

}



function onClickUpload() {
    open();
}



const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)


watch(files, (value) => {
    if (value && value.length) {

        onDrop(value as any as any[]);

    }

})







</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.drop-zone {
    background: #eef3f9;
    border: 1px dashed #4188e3;
    border-radius: 2px;
    box-sizing: border-box;
    cursor: pointer;
    min-height: 200px;
    padding: 24px;
    text-align: center;
    transition: all .2s;
}

.ca-drop-zone {
    min-height: 200px;
    border-color: red;
    border-style: dashed;
    border-radius: 5px;


    .drop-zone:hover {
        background-color: #ecf5ff;
    }

    .drop-zone:hover .drop-zone-heading,
    .drop-zone:hover .drop-zone-heading a {
        color: #336ec2;
    }

    .drop-zone-heading a {
        color: #4188e3;
    }

    .drop-zone-icon {
        display: inline-block;
        margin-bottom: 12px;
        max-width: 100%;
    }

    .drop-zone-heading {
        color: #253843;
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        margin-bottom: 5px !important;
    }

    .drop-zone-subheading,
    .drop-zone-text {
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
    }

    .drop-zone-text {
        color: #8c94a0;
        margin: 0 auto 12px !important;
        max-width: 650px;
        text-align: left;
    }

    .drop-zone-confidential {
        color: #8c94a0;
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        margin-bottom: 0;
    }

    .drop-zone-subheading {
        color: #45505a;
        margin-bottom: 13px;
    }

}
</style>

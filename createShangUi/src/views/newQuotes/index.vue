<template>
    <div class="wh-full flex justify-center">
        <div class="w-992px">
            <div class="page-title-container flex justify-between ">
                <div class="page-title">
                    <h2>新文件</h2>
                </div>
                <div class="page-title">
                    <div class="w-100px">
                        <el-button class="block" @click="onClickUpload" v-if="dataStore.notUploadCount" :disabled="dataStore.isUploadIng">提交</el-button>
                    </div>
                </div>
            </div>
            <quotes 
                v-for="(item, index) in dataStore.files" 
                :key="index" 
                :modelItem="item" 
                :isUploadIng="dataStore.isUploadIng"
                
                @delete="onClickDel"
                @editor="onEditor" 
                ref="quotesItem"/>
            <upload @uploadFile="onUploadFile" v-if="!dataStore.isUploadIng"/>
        </div>
    </div>
</template>

<script setup lang="ts">

import upload from "@/components/upload/index.vue"
import quotes from "@/components/quotes/index.vue"
import useDataStore from "@/store/data"

const Route = useRoute();
const Router = useRouter();
const dataStore = useDataStore();
const quotesItem = $ref<(typeof quotes)[]>()



function onClickDel(item: workPieceItem) {
    dataStore.del(item);
}


function onEditor(item: workPieceItem) {

    Router.push({
        name: "quotation",
        params: {
            id: dataStore.find(item)
        }
    })

}

function onUploadFile(file: any[]) {

    dataStore.addDropFile(file);

}

async function onClickUpload() {

    dataStore.startUpload();

    for (let index = 0; index < quotesItem.length; index++) {
        const element = quotesItem[index];

        const result = await element.startUpload();
        
       
        
    }

    dataStore.stopUpload();

}




</script>

<script lang="ts">
export default {
    name: "",
    title: "采购看板"
}
</script>

<style lang="scss">
.page-title-container {

    margin: 18px 0;

    .page-title {
        color: #253843;
        font-size: 24px;
        font-weight: 700;
        line-height: 33px;
    }
}
</style>

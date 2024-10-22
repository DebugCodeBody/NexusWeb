<template>
    <div class="new-quotes-list-item ">
        <div class="list-item-image">
            <div class="w-126px h-126px border">

            </div>
        </div>
        <div class="list-item-content flex-1 px-22px">
            <div class="flex flex-col justify-between h-full">
                <div class="content-head flex">
                    <span class="file-name ellipsis ">{{ modelItem.name }}</span>
                    <span class="divider">|</span>
                    <span class="cteate_time" v-if="isUpload">{{ modelItem.createDate }}</span>
                    <span class="no-upload" v-else>
                        <el-tag type="warning" v-if="successStatus == 0">未上传</el-tag>
                        <el-tag type="success" v-if="successStatus == 1">上传完成</el-tag>
                        <el-tag type="danger" v-if="successStatus == 2">上传失败</el-tag>
                    </span>
                </div>
                <div class="content-summary flex">
                    <div class="quantity">
                        材质：
                        <span>{{ modelItem.material }}</span>
                    </div>
                    <div class="quantity">
                        数量：
                        <span>{{ modelItem.count }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="list-item-side">
            <div class="flex flex-col justify-between h-full">
                <div class="side-head text-right">
                    <el-link type="primary" @click="onClickDel" v-if="!isUploadIng">
                        <el-icon class="mr-2px">
                            <Delete />
                        </el-icon>
                        <span>删除</span>
                    </el-link>
                </div>
                <div>
                    <el-button type="primary" class="block" @click="onClickEditor" v-if="!isUploadIng">编辑</el-button>
                    <el-button type="primary" class="block" @click="onClickEditor" :loading="isUploadIng"
                        v-else-if="!uploadSuccess">正在提交</el-button>
                </div>
            </div>
        </div>
    </div>
</template> 

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { create } from "@/api/order"



interface Emits {
    (e: 'delete', arg: workPieceItem): void;
    (e: 'editor', arg: workPieceItem): void;
}
const Emit = defineEmits<Emits>();

const Props = defineProps<{
    modelItem: workPieceItem,
    isUploadIng: boolean
}>();

let successStatus = $ref(0);

/** 是否已经上传 */
const isUpload = computed(() => {
    return Props.modelItem.id != undefined;
})
/** 是否已经上传成功 */
const uploadSuccess = computed(() => {
    return successStatus == 1;
})


function onClickDel() {
    Emit("delete", Props.modelItem);
}

function onClickEditor() {
    Emit("editor", Props.modelItem);
}



defineExpose({

    async startUpload() {

        const fileItem = Props.modelItem;

        let retValue = true;

        const sendData = new FormData();

        sendData.set("count", fileItem.count);
        sendData.set("material", fileItem.material);
        sendData.set("filename", fileItem.name);
        sendData.set("file", fileItem.value, fileItem.name)

        try {


            await create(sendData);
            successStatus = 1;


        } catch {

            successStatus = 2;
            retValue = false;

        }

        return retValue;

    }


})








</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.new-quotes-list-item {


    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;


    .list-item-image,
    .list-item-content,
    .list-item-side {
        padding: 22px;
    }

    .list-item-side {
        min-width: 230px;
    }

    .list-item-content {
        border-left-width: 1px;

        .file-name {
            font-weight: bold;
            max-width: 140px;
            min-width: 140px 

        }

        .divider {
            color: #d0d7dd;
            display: inline-block;
            font-size: 16px;
            line-height: 23px;
            margin: 0 12px;
        }

        .cteate_time {
            color: #747b86;
            font-size: 14px;
            font-weight: 400;
            line-height: 19px;
            line-height: 23px;
            margin-bottom: 0;
        }

        .content-summary {
            .quantity {
                color: #8c94a0;
                font-size: 12px;
                font-weight: 600;
                line-height: 16px;
                margin-bottom: 0;
                width: 50%;

                span {
                    color: #45505a;
                    display: block;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 19px;
                    margin-top: 3px;
                }
            }

        }

    }





}
</style>

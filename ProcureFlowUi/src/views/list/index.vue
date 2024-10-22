<template>
    <div id="list" class="wh-full overflow-hidden">

        <div class="wh-full flex flex-col">
            <div class="flex-1 overflow-hidden">
                <tab-management :dataList="dataList" :refresh="refresh" :class="{
                    'is-select': isAudit
                }">
                    <template #item="{ itemData }">
                        <list-item :item="itemData" @click.capture="onClickItem(itemData, $event)" />
                    </template>
                </tab-management>
            </div>

            <div class="mt-10px">

                <div class="flex" v-if="isAudit">
                    <el-button class="block" @click="onClickCancelCreate" :disabled="submitLoading">取消</el-button>
                    <el-button type="primary" class="block" @click="onCliickConfirm"
                        :disabled="!selectGrounp.length">确定</el-button>
                </div>
                <div v-else>
                    <el-button type="primary" class="block" @click="onClickCreate"  :disabled="!dataList.length">创建审核</el-button>
                </div>

            </div>

        </div>

        <el-drawer v-model="drawer" title="上传图片" direction="btt" size="80%" :destroy-on-close="true">
            <el-form :label-width="50" class="border rounded-5px p-10px">
                <el-form-item label="图片凭据" class="mb-0">
                    <upload-file :height="80" :width="80" v-model="fileLen" ref="fileEl" />
                </el-form-item>
            </el-form>
            <div class="mt-10px">
                <el-button type="primary" class="block" @click="onClickStartAudit" :loading="submitLoading">提交</el-button>
            </div>

        </el-drawer>

    </div>
</template>

<script setup lang="ts">
import tabManagement from "@/components/tabManagement/index.vue"
import uploadFile from "global@/uploadFile/index.vue"


import listItem from "./item.vue"
import { getList, startAudit } from "@/api"
import { uploadImg } from "@/api/upload"

import { messageError } from "@/utils/elementLib"



const dataList = $ref<buyorderItem[]>([]);

let drawer = $ref(false);

let isAudit = $ref(false);
let selectGrounp = $ref<buyorderItem[]>([]);

let submitLoading = $ref(false);


let fileLen = $ref(0);
let fileEl = $ref<typeof uploadFile>()



async function refresh() {


    const data = await getList();

    data.forEach((elem) => elem.select = false);


    dataList.length = 0;
    dataList.push(...data);


    return true;


}

function onClickItem(item: buyorderItem, event: Event) {

    // drawer = true;
    // selectItem = item;

    if (isAudit) {
        item.select = !item.select;

        if (item.select) {
            selectGrounp.push(item);
        } else {

            const index = selectGrounp.indexOf(item);
            selectGrounp.splice(index, 1);

        }

        event.stopPropagation();

    }


}


function onClickCreate() {
    selectGrounp.length = 0;
    isAudit = true;
}

function onClickCancelCreate() {

    dataList.forEach((elem) => elem.select = false);

    isAudit = false;

}

function onCliickConfirm() {

    drawer = true;

}


async function onClickStartAudit() {

    submitLoading = true;


    try {

        const urlList: string[] = [];

        if (fileLen > 0) {

            try {

                const fileList = await fileEl.getFile();

                for (let index = 0; index < fileList.file.length; index++) {
                    const element = fileList.file[index];

                    const sendForm = new FormData();
                    sendForm.set("img", element, `${element.name}.png`)

                    const string = await uploadImg(sendForm);

                    urlList.push(string);

                }

            } catch {
                submitLoading = false;
                messageError("图片上传失败，请重试");
                return;
            }
        }



        const sendId = selectGrounp.map((elem) => elem.id);

        const procInstId = await startAudit(sendId, urlList);

        location.href = `https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?corpid=dingf2f1e9ca1da23dff&dd_share=false&showmenu=false&dd_progress=false&back=native&procInstId=${procInstId}&taskId=&swfrom=isv&dinghash=approval&dtaction=os&dd_from=corp#approval`;


        selectGrounp.length = 0;


    } catch {

        submitLoading = false;
        isAudit = false;


    }



}




</script>

<script lang="ts">


export default {
    title: "采购审批列表"
}
</script>

<style lang="scss">
#list {





    .el-tabs__nav-scroll,
    .el-tabs__header {
        display: none;
    }

    .el-drawer {
        .el-drawer__header {
            padding: 10px;
            margin: 0;
        }

        .el-drawer__body {
            padding: 10px;
        }

    }


    .tab-management {

        .el-checkbox {
            display: none;
        }


    }

    .is-select {
        .column-item{
            cursor: pointer;
        }
        .el-checkbox {
            display: block;
        }


    }




}

@media screen and (min-width: 960px) {

    #list {
        width: 752px;
        margin: auto;
    }

}
</style>

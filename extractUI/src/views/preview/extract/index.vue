<template>
    <div>

        <list-card v-for="(item, index) in data" :key="index" :data="item">
            <template #top-button>
                <el-button type="primary" @click.stop="onClickAllExtract(item)">提货</el-button>
            </template>

            <template #default="{ data: itemChild }">
                <el-form size='default'>
                    <el-form-item class="oirder-item">
                        <div class="content">
                            <el-form-item class="order" v-if="itemChild.orderid">
                                <span>{{ itemChild.orderid }}</span>
                            </el-form-item>

                            <el-form-item>
                                <span>{{ itemChild.mat_name }}</span>
                            </el-form-item>

                            <div class="out-buttom">
                                <el-button type="danger" size="small" @click="onClickOut(itemChild)">缺货</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-form-item label="规格：" style="width: 60%">
                            <span>{{ itemChild.bspec }} x {{ itemChild.bcount }}</span>
                        </el-form-item>
                        <el-form-item label="交期：" style="width: 40%">
                            <el-tag type="warning" v-if="!gtNowDate(itemChild.delivery)">{{
            getFormatTime(itemChild.delivery)
        }}</el-tag>
                            <el-tag type="success" v-else>{{ getFormatTime(itemChild.delivery) }}</el-tag>
                        </el-form-item>
                    </el-form-item>

                    <!-- <el-form-item>
                        <el-form-item label="取货：">
                            <el-tag v-if="itemChild.btaketime">{{ getFormatTime(itemChild.btaketime) }}</el-tag>
                            <el-tag type="danger" v-else>未取货</el-tag>
                        </el-form-item>
                    </el-form-item> -->

                    <el-form-item label="备注：" v-if="itemChild.bremark">
                        <span>{{ itemChild.bremark }}</span>
                    </el-form-item>
                </el-form>
            </template>

        </list-card>

        <pop-dialog v-model="dialog" title="提货" :disabledConfirmButton="disabledConfirmButton" class="extract-dialog"
            @confirm="onClickConfirm">

            <el-form label-width="auto" :hide-required-asterisk="true">
                <el-form-item label="订单" class="order-list">
                    <el-checkbox-group v-model="selectOrder">

                        <div v-for="item in selectData.value" :key="item.orderid" class="item-col">
                            <el-checkbox border  :label="item.seq">
                                <span>{{ item.mat_name }} {{ item.bspec }}x{{ item.bcount }}</span>
                            </el-checkbox>
                            <el-button type="danger" size="small" class="out-button" @click="onClickOut(item)">缺货</el-button>

                        </div>

       
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="图片">
                    <upload-file v-model="fileLength" :max="1" ref="upload">

                    </upload-file>
                </el-form-item>

            </el-form>

        </pop-dialog>

    </div>
</template>

<script setup lang="ts">
import popDialog from "global@/popDialog/index.vue"
import uploadFile from "global@/uploadFile/index.vue"

import listCard from "../listCard.vue"
import { gtNowDate } from "@/utils/other"
import { orderExtract, setOut } from "@/api"
import dayjs from "dayjs"
import to from "await-to-js"
import { ElMessageBox } from 'element-plus'


import { selectItem, extractDialogShow, allExtractDialogShow, getData, presentData } from "@/store/data"




const Emits = defineEmits<{
    (e: 'clickItem', value: any, all: boolean): void;
    (e: 'setOut', value: any): void;
}>();



const Props = defineProps<{
    data: any,
}>();


const upload = $ref<typeof uploadFile>();
const fileLength = $ref(0);

let selectData = $ref<any>();
let dialog = $ref(false);
let selectOrder = $ref<string[]>([]);


const disabledConfirmButton = $computed(() => {
    return selectOrder.length == 0;
})

function onClickExtract(item: any) {
    Emits("clickItem", item, false);
}
function onClickAllExtract(dataList: any) {

    selectData = dataList;
    dialog = true;

    if (dataList.value.length == 1) {
        selectOrder = [dataList.value[0].seq]
    } else {
        selectOrder = [];
    }

}


function getFormatTime(str: string) {
    return dayjs(str).format("MM-DD")
}

async function onClickConfirm() {
    const [err, fileList] = await to(upload.getFile());


    let sendImg;
    if ((fileList as any).file.length > 0) {
        sendImg = new FormData();
        sendImg.append("file", (fileList as any).file[0], "file.jpg");
    }


    const [senderr] = await to(orderExtract(selectOrder.join(";"), sendImg));
    if (senderr) {

        await ElMessageBox.confirm(
            `提货失败，请确认订单状态！`,
            '提示',
            {
                showCancelButton: false,
                confirmButtonText: '确认',
                center: true,
                type: 'error',
            }
        )
    }

    dialog = false;
    nextTick(() => {
        getData();
    })


}

async function onClickOut(item: any) {

    const { seq } = item;

    try {
        await setOut([seq])
    } finally {
        getData();
    }


}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.extract-dialog {

    .el-form {
        display: block;
        .order-list{
            display: block;
        }
    }

    .el-checkbox {
        margin-bottom: 5px;
    }

    .item-col{
        display: flex;
        align-items: center;
        
        .out-button{
            margin-left: 10px;
        }
    }


}

.oirder-item {

    .content {
        width: 100%;
        display: flex;

        .out-buttom {

            width: auto;

            margin-left: auto;

        }
    }



}
</style>

<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title" style="background-color: #67c23a">{{ title }}</h3>
            <div class="declare_wrap wh-full mt-5px overflow-hidden">
                <div class="wh-full flex flex-col overflow-hidden">

                    <div class="relative table-wrap" :class="{
                        'flex-1': flexHeight,
                        'auto-height': !flexHeight
                    }" ref="tableWrap">
                        <div class="wh-full  overflow-hidden absolute">
                            <Table :boxTable="listTable" ref="listTableEl">
                                <template #buttons="{ renderRow }">
                                    <el-button type="danger" size="small" @click="onClickDelete(renderRow)">删除</el-button>
                                </template>
                            </Table>
                        </div>
                    </div>

                    <div class="mt-10px">
                        <el-button type="primary" @click="onClickAdd" :icon="Plus" :loading="submitLoading">添加报销</el-button>
                    </div>
                    <div class="mt-10px upload">
                        <el-form :model="formData" :label-width="50" :rules="formRules" ref="formEl">
                            <el-form-item label="图片凭据" prop="fileLen">
                                <upload-file :height="80" :width="80" v-model="formData.fileLen" ref="fileEl" />
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="button-block mt-10px flex justify-center">
                        <div>
                            <el-button type="warning" @click="onClickAudit" :icon="Tickets" :loading="submitLoading"
                                :disabled="!listTable.table.data.length">提交审核</el-button>
                        </div>
                    </div>
                    <drawer-form v-if="showForm" v-model="showForm" :listTable="listTable" />
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">

import { Plus, Tickets } from '@element-plus/icons-vue'

import { create, getList, getAutSndList, startAudit } from "@/api"
import { uploadImg } from "@/api/upload"


import uploadFile from "global@/uploadFile/index.vue"




import Table from "H:/private/newTool/UI/src/components/boxTable/index.vue"
import { boxTableControl } from "H:/private/newTool/UI/src/components/boxTable/utils/boxTable"

import { column, api } from "./data"
import drawerForm from "./drawerForm.vue"
import { listData } from "./data"
import { messageError } from "@/utils/elementLib"
import { toDing } from "@/utils/other"


column.push({
    label: "操作",
    align: 'center',
    width: 100,
    operator: false,
    prop: 'buttons',
    render: 'buttons'
})

const listTable = new boxTableControl<carItem>({
    column,
    data: listData
}, {}, {

    refresh() {
        nextTick(() => {
            updateTableHeight();
        })
    },
    delete() {
        this.Refresh();
    }

}, api);


const tableWrap = $ref<HTMLDivElement>();
const listTableEl = $ref<InstanceType<typeof Table>>();


const fileEl = $ref<InstanceType<typeof uploadFile>>();
let flexHeight = $ref(true);
let tableWrapHeight = 0;
let submitLoading = $ref(false);


let showForm = $ref(false);

const formEl = $ref<any>();
const formData = $ref({
    fileLen:0
})
const formRules = reactive({
    fileLen: [
        { type:"number", min: 1, message: '图片必须上传一张', trigger: 'blur' }
    ]
});


function updateTableHeight() {

    nextTick(() => {
        const elTable__body = document.querySelector(".el-table .el-table__body")!;
        const eltable__emptyblock = document.querySelector(".el-table .el-table__empty-block")!;
        const elTable__headerWrapper = document.querySelector(".el-table .el-table__header-wrapper")!

        const tablebodywrapper = document.querySelector<HTMLDivElement>(".el-table .el-table__body-wrapper")!;

        const height = (eltable__emptyblock || elTable__body).clientHeight + elTable__headerWrapper.clientHeight;

        tableWrap.style.height = `${height}px`;
        setTimeout(() => {
            tablebodywrapper.style.height = `${height}px`;
        })

        flexHeight = height >= tableWrapHeight;

        if (flexHeight) {
            tableWrap.style.height = "";
            tableWrap.style.height = "";
        }

        nextTick(() => {
            listTableEl.getRef().layout.updateElsHeight();
        });

    })
}



function onClickAdd() {
    showForm = true;
}

function onClickDelete(value: carItem) {

    listTable.Delete(value);


}


async function onClickAudit() {

    try{
        await formEl.validate();
    }catch{
        return;
    }


    submitLoading = true;

    const urlList: string[] = [];

    if (formData.fileLen > 0) {

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

    try {

        const id = listTable.table.data.map((elem: carItem) => elem.id);
        const procInstId = await startAudit(id, urlList);

        toDing(procInstId);

    }catch{
        listTable.Refresh();
    } finally {
        submitLoading = false;
    }


}



async function init() {
    listTable.Refresh();
}


init();




onMounted(() => {


    tableWrapHeight = tableWrap.clientHeight;

    flexHeight = false;

    updateTableHeight();




})



</script>

<script lang="ts">

const title = $ref("司机出车费用报销");

export default {
    name: "",
    title
}
</script>

<style lang="scss">
#declare {

    .declare_view {
        max-width: 800px;
        margin: auto;
    }

    .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        background-color: #66b1ff;
    }

    .declare_wrap {
        position: relative;

        .el-overlay{
            position: absolute;
        }
    }

    .form-content {

        form {
            padding: 10px;
            box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);

            .el-form-item {
                &.line-item {
                    flex-direction: column;
                }

                &:last-child {
                    margin-bottom: 0;
                }
            }

            textarea {
                height: 100px;
                resize: none;
            }

            .el-checkbox-group .el-checkbox,
            .el-radio-group .el-radio {
                margin-right: 10px;
                padding: 0 5px;
            }

        }

        .amount-input{
            display: block !important;
        }


    }

    .upload {
        .el-form-item {
            margin-bottom: 0;
        }
    }


    .button-block {
        .el-button {
            width: 100%;
        }

        .el-button+.el-button {
            margin-left: 0;
        }


    }


    .el-result {
        background-color: white;

        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        z-index: 99;

        * {
            user-select: none !important;
        }

    }


    /** 通过修改css，来达到高度自适应行数 */
    .table-wrap.auto-height {

        .el-table-relative .el-table {
            height: auto !important;

        }

        .el-scrollbar {
            height: 100%;
        }

        .el-table__empty-block {
            height: auto !important;
        }

        .el-table__body-wrapper {
            flex: none;
        }

    }


}

.el-table--large .cell {
    padding: 0 10px !important;
}

.el-select-dropdown__item {
    padding: 0 10px !important;

    .orderid {
        float: left;
        margin-right: 20px;
    }

    .custname {
        float: right;
    }
}

.el-drawer {


    .el-drawer__body {
        padding: 10px;
    }
}
</style>

<template>
    <div id="preview">
        <div class="preview-top">
            <el-button type="primary" @click="onAdd">添加</el-button>
            <el-input v-model="search" :prefix-icon="Search"></el-input>
        </div>
        <div class="preview-bottom">
            <el-table :data="tableData" stripe border>
                <el-table-column prop="name" label="名称" width="90" align="center" />
                <!-- <el-table-column prop="ftype" label="类型" width="100" align="center" />
                -->
                <el-table-column prop="fprice" label="价格" width="60" align="center" />

                <el-table-column label="库存" align="center" width="100">
                    <template #default="scope">
                        <div style="align-items: center">
                            <div>{{ ["不限制", "每餐", "每天", "全部"][scope.row.stored] }}</div>
                            <div>{{ scope.row.fqty }}</div>
                        </div>
                    </template>
                </el-table-column>


                <!-- 
                <el-table-column prop="factive" label="启用" align="center" width="100">
                    <template #default="{ row }">
                        <el-switch v-model="row.factive" />
                    </template>
                </el-table-column>
                <el-table-column prop="fpreset" label="预制菜品" align="center" width="100">
                    <template #default="{ row }">
                        <el-switch v-model="row.fpreset" />
                    </template>
                </el-table-column>
                <el-table-column prop="supplykind" label="供餐" align="center">
                    <template #default="{ row }">
                        <el-tag :type="tagType[row.supplykind-1]">{{ tagText[row.supplykind-1] }}</el-tag>
                    </template>
                </el-table-column> -->

                <el-table-column align="center" width="130">
                    <template #default="{ row }">
                        <el-button type="primary" @click="onEdit(row)">编辑</el-button>
                        <!-- <el-button type="danger" @click="delectItem(row,$index)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <popupForm v-if="addPop" v-model="addPop" :edit="editItem" @addItem="addItem" />

</template>

<script setup lang="ts">
import popupForm from "./popupForm.vue"
import { useCurrentElement, watchDebounced } from "@vueuse/core"

import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { list } from "@/api/canteen";
import { del } from "@/api/canteen"


const tagType = ["warning", "success", "info", "danger"]
const tagText = ["早餐", "中餐", "晚餐", "夜宵"]

const search = ref("")
const addPop = ref(false);
const editItem = ref<canteenItem>({} as canteenItem);


let listData: canteenItems = [];
const tableData = ref<canteenItems>([]);
const maxHeight = ref(window.outerHeight);


async function delectItem(item: canteenItem, index: number) {
    try {
        await ElMessageBox.confirm(
            '确认是否删除此菜品？',
            '提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
    } catch (error) {
        return;
    }


    try {
        await del(item.name)

        init();
    } catch (err) {
        console.log(err);
    }


}

function onEdit(item: canteenItem) {
    addPop.value = true;
    editItem.value = item;
}

function onAdd() {
    addPop.value = true;
    editItem.value = {} as canteenItem;

}


function addItem() {
    init();
}


async function init() {
    let response = await list();

    listData = JSON.parse(JSON.stringify(response));
    tableData.value = response;

    filter(search.value);
}


function filter(value: string) {
    if (!value) {
        return
    }
    tableData.value = listData.filter(({ name }) => {
        return name.indexOf(value) > -1
    })

}


watchDebounced(search, (value) => {

    if (!value) {
        tableData.value = listData;
        return;
    }

    filter(value);



}, { debounce: 500 })


onMounted(() => {
    setTimeout(() => {
        maxHeight.value = document.getElementsByClassName("preview-bottom")[0].clientHeight;
    }, 100);
})

init();




</script>

<script lang="ts">
export default {
    name: "",
    title: "菜单面板"
}
</script>

<style lang="scss">
#preview {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    button {
        padding: 5px;
        ;
    }

    .preview-top {
        padding: 10px;
        padding-left: 0;

        display: flex;

        .el-input {
            width: 300px;
            margin-left: 10px;
        }
    }

    .preview-bottom {
        flex: 1;
        position: relative;
        overflow: auto;

        .el-table {
            position: absolute;
            height: 100%;
            width: 100%;

        }
    }

}
</style>







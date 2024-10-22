<template>

    <el-row :gutter="10" class="admin-vie">

        <el-col :span="4">
            <el-table :data="groupInfo" :border="true" highlight-current-row @row-click="onRowClick"
                @current-change="onHandleCurrentChange" ref="groupTable">
                <el-table-column prop="id" label="id" width="100" :align="`center`" />
                <el-table-column prop="name" label="群名" :align="`center`" />
                <el-table-column prop="name" label="高亮" :align="`center`">
                    <template #default="{ row }">
                        <el-color-picker v-model="row.color" :disabled="true" />
                    </template>
                </el-table-column>
            </el-table>
        </el-col>

        <el-col :span="20">
            <el-card class="group-box">
                <el-button @click="addGroup">添加群</el-button>
                <el-button type="success" @click="editGroup" :disabled="disabled">编辑群</el-button>
                <el-popconfirm title="确定删除选中群？" @confirm="delGroup">
                    <template #reference>
                        <el-button type="danger" :disabled="disabled">删除群</el-button>
                    </template>
                </el-popconfirm>
            </el-card>

            <el-row :gutter="10">
                <el-col :span="6">
                    <table-card name="负责人" label="名字" prop="name" :data="selectGroup && selectGroup.child || []"
                        :disabled="disabled" @action-chan="onChargeAction" />
                </el-col>
                <el-col :span="6">
                    <table-card name="负责组" label="名字" prop="name" :data="selectGroup && selectGroup.group || []"
                        :disabled="disabled" @action-chan="onGroupAction" />
                </el-col>
                <el-col :span="6">
                    <table-card name="快捷输入选项" label="内容" prop="name" :data="selectGroup && selectGroup.quick || []"
                        :disabled="disabled" @action-chan="onFieldAction" />
                </el-col>
                <el-col :span="6">
                    <table-card name="责任人输入选项" label="名字" prop="name" :data="selectGroup && selectGroup.person || []"
                        :disabled="disabled" @action-chan="onPersonAction" />
                </el-col>
            </el-row>

        </el-col>

    </el-row>


    <group v-if="groupShow" v-model:show="groupShow" :add="isAdd" :form="selectGroup" @addAction="onAddAction"
        @editAction="onEditAction"></group>

    <user-dialog v-if="charge.show" v-model:show="userShow" :add="isAdd" :group="groupInfo"
        :form="userForm"></user-dialog>
    <field-dialog v-if="field.show" :group="groupInfo" @close="init"></field-dialog>
    <person-dialog v-if="person.show" :group="groupInfo" @close="init"></person-dialog>
    <deauser-dialog v-if="deauser.show" :group="groupInfo" @close="init"></deauser-dialog>

</template>

<script setup lang="ts">
import { groupCreate, groupList, groupDel, groupEdit, userDel } from "@/api/group"
import { personDel } from "@/api/person"
import { fieldDel } from "@/api/field"
import { deauserDel } from "@/api/deauser"



import group from "./group.vue"
import userDialog from "./userDialog.vue"
import fieldDialog from "./fieldDialog.vue"
import personDialog from "./personDialog.vue"
import deauserDialog from "./deauserDialog.vue"
import tableCard from "./tableCard.vue"


import { ElTable, ElMessage } from 'element-plus'

let isAdd = $ref(true);
let groupShow = $ref(false);
let userShow = $ref(false);
let userForm = $ref<dUser>({} as dUser);
let groupTable = $ref<InstanceType<typeof ElTable>>()


const groupInfo = $ref<GroupInfos>([]);
let selectGroup = $ref<GroupInfo>();

const disabled = $computed(() => {
    return !selectGroup
})

const charge = $ref({
    show: false,
    action: "",
    item: {

    }
})

const field = $ref({
    show: false,
    action: "",
    item: {

    }
})
const person = $ref({
    show: false,
    action: "",
    item: {

    }
})
const deauser = $ref({
    show: false,
    action: "",
    item: {

    }
})



/** 点击添加负责群按钮 */
function addGroup() {
    isAdd = true;
    groupShow = true;
}
/** 点击编辑负责群按钮 */
function editGroup() {
    isAdd = false;
    groupShow = true;
}



function delItem(fun: any, ...args: any[]) {
    fun.apply(fun, args).then(init).catch(() => {

        ElMessage({
            showClose: true,
            message: '操作失败，请稍后重试',
            type: 'error',
        })

    })

}


function onFieldAction(action: string, item: any) {
    if (action == "dele") {
        delItem(fieldDel, item.id)
        return;
    }

    field.action = action;
    field.item = item;
    field.show = true;
}

function onChargeAction(action: string, item: any) {
    if (action == "dele") {
        delItem(userDel, item.id)
        return;
    }

    charge.action = action;
    charge.item = item;
    charge.show = true;
}

function onPersonAction(action: string, item: any) {
    if (action == "dele") {
        delItem(personDel, item.id)
        return;
    }

    person.action = action;
    person.item = item;
    person.show = true;
}
function onGroupAction(action: string, item: any) {
    if (action == "dele") {
        delItem(deauserDel, item.id, item.name);
        return;
    }

    deauser.action = action;
    deauser.item = item;
    deauser.show = true;
}



/** 编辑负责群 */
function onEditAction(item: GroupInfo) {
    groupEdit(item.id, item.name, item.hook, item.color, item.is_withdraw, item.response_type, item.disabled).finally(() => {
        init();
    })
}
/** 添加负责群 */
function onAddAction(item: GroupInfo) {

    groupCreate(item.name, item.hook).finally(() => {
        init();
    })

}
/** 删除负责群 */
function delGroup() {
    const { id } = selectGroup;
    groupDel(id).then(() => {
        init();
    })
}

/**
 * 
 * 某一行被单击
 * 
 */
function onRowClick(row: any, column: any, event: any) {
    selectGroup = row;
}
/** 高亮某一行 */
function onHandleCurrentChange(data?: any) {
    groupTable.setCurrentRow(data)
}

async function init() {
    const result = await groupList();
    groupInfo.splice(0, groupInfo.length, ...result);

    if (selectGroup) {
        selectGroup = groupInfo.find(elem => elem.id == selectGroup.id)!;
    }

}


init();


provide("field", field);
provide("person", person);
provide("charge", charge);
provide("deauser", deauser);
provide("selectGroup", $$(selectGroup));


</script>

<script lang="ts">
export default {
    name: "",
    title: "群管理"
}
</script>

<style lang="scss" >
.admin-vie {

    .group-box {
        margin-bottom: 10px;
    }

    .box-card {
        .el-card__header {
            padding: 10px;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
}
</style>

<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>{{ name }}</span>
                <el-button type="primary" :disabled="disabled" @click="onClick">添加</el-button>
            </div>
        </template>

        <el-table :data="data" border style="width: 100%">
            <el-table-column type="index" label="序号" width="100" align="center" />
            <el-table-column :prop="prop" :label="label" align="center" />
            <el-table-column width="140">
                <template #default="{row}">
                    <el-button size="small" type="primary" @click="onEditUser(row)">编辑</el-button>
                    <el-popconfirm title="确定删除？" @confirm="onDelUser(row)">
                        <template #reference>
                            <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        
    </el-card>
</template>

<script setup lang="ts">

const Emits = defineEmits<{
    (e: "action-chan", action: string, item?: any): void
}>();

const Props = defineProps<{
    name: string,
    data: any[],
    label: string,
    disabled: boolean,
    prop: string
}>();



function onClick() {
    Emits("action-chan", "add")
}

function onEditUser(a: any) {
    Emits("action-chan", "edit", a);
}

function onDelUser(a: any) {
    Emits("action-chan", "dele", a);
}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

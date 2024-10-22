<template>
    <div class="ba-data-container">

        <div class="flex-1">
            <div class="el-table-relative">
                <el-table ref="tableRef" class="ba-data-table" header-cell-class-name="table-header-cell"
                    :default-expand-all="baTable.table.expandAll" :row-key="baTable.table.pk" :stripe="baTable.table.stripe"
                    :border="true" :highlight-current-row="true" :data="baTable.table.data" :height="'100%'"
                    @row-contextmenu="onRowContextmenu" @row-click="onRowClick" @row-dblclick="onRowDblClick"
                    @select-all="onSelectAll" @select="onSelect" @sort-change="onSortChange" v-bind="$attrs">
                    <template v-for="(item, key) in baTable.table.column">

                        <el-table-column v-bind="item" v-if="item.show !== false" :key="key">
                            <template v-if="item.render" #default="scope">
                                <FieldRender :field="item"
                                    :key="item.render == 'switch' ? 'column-' + scope.column.property + '-' + key + '-' + scope.row[scope.column.property] : 0"
                                    :row="scope.row" :property="scope.column.property" />
                            </template>
                        </el-table-column>

                    </template>

                </el-table>
            </div>
        </div>

        <div v-if="props.pagination" class="table-pagination">
            <el-pagination background :currentPage="state.currentPage" :page-size="state.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :layout="false ? 'prev, next, jumper' : 'sizes,total, ->, prev, pager, next, jumper'"
                :total="baTable.table.total" @size-change="onTableSizeChange"
                @current-change="onTableCurrentChange"></el-pagination>

        </div>
    </div>
</template>

<script setup lang="ts">
import "./types/enum"
import { ref, nextTick, reactive, inject } from 'vue'
import Column from './column/index.vue'
import FieldRender from './fieldRender/index.vue'

import { testBaTable } from './utils/baTable'


const tableRef = ref<any>()
const baTable = inject('baTable') as testBaTable




interface Props {
    pagination?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    pagination: true,
})

const state = reactive({
    currentPage: 1,
    pageSize: 10,
})

const emits = defineEmits<{
    (e: 'action', event: string, data: anyObj): void

    /** 行被单击 */
    (e: "row-click", event: MouseEvent): void
    /** 行被双击 */
    (e: "row-dblclick", event: MouseEvent): void
    /** 右键单击某一行弹出菜单 */
    (e: "contextmenu", event: MouseEvent): void
}>()

const onTableSizeChange = (val: number) => {
    state.pageSize = val;
    baTable.sizeChangeHandler(val);
}

const onTableCurrentChange = (val: number) => {
    state.currentPage = val
    baTable.pageChangeHandler(val);
}

const onSortChange = ({ order, prop }: { order: string; prop: string }) => {
    emits('action', 'sort-change', {
        prop: prop,
        order: order ? (order == 'ascending' ? 'asc' : 'desc') : '',
    })
}



/*
 * 是否是全选操作
 * 只检查第一个元素是否被选择
 * 全选时：selectIds为所有元素的id
 * 取消全选时：selectIds为所有子元素的id
 */
const isSelectAll = (selectIds: string[]) => {
    let data = baTable.table.data as TableRow[]
    for (const key in data) {
        return selectIds.includes(data[key][baTable.table.pk!].toString())
    }
    return false
}

/*
 * 选择子项-递归
 */
const selectChildren = (children: TableRow[], type: boolean) => {
    children.map((j: TableRow) => {
        toggleSelection(j, type)
        if (j.children) {
            selectChildren(j.children, type)
        }
    })
}

/*
 * 执行选择操作
 */
const toggleSelection = (row: TableRow, type: boolean) => {
    if (row) {
        nextTick(() => {
            tableRef.value && tableRef.value.toggleRowSelection(row, type)
        })
    }
}

/*
 * 全选和取消全选
 * 实现子级同时选择和取消选中
 */
function onSelectAll(selection: TableRow[]) {
    baTable.table.selection = selection;
}

/*
 * 手动选择时，同时选择子级
 */
const onSelect = (selection: TableRow[], row: TableRow) => {

    baTable.table.selection = selection;

    // if (
    //     selection.some((item: TableRow) => {
    //         return row[baTable.table.pk!] === item[baTable.table.pk!]
    //     })
    // ) {
    //     if (row.children) {
    //         selectChildren(row.children, true)
    //     }
    // } else {
    //     if (row.children) {
    //         selectChildren(row.children, false)
    //     }
    // }
}

/*
 * 设置折叠所有-递归
 */
const setUnFoldAll = (children: TableRow[], unfold: boolean) => {
    for (const key in children) {
        tableRef.value && tableRef.value.toggleRowExpansion(children[key], unfold)
        if (children[key].children) {
            setUnFoldAll(children[key].children!, unfold)
        }
    }
}

/*
 * 折叠所有
 */
const unFoldAll = (unfold: boolean) => {
    setUnFoldAll(baTable.table.data!, unfold)
}


/** 设置行列数据 */
function setRowColumn(newRow: any, newColumn: any, event: MouseEvent) {
    baTable.table.selectRow = newRow;

    if (newColumn && newColumn.property) {
        baTable.table.selectColumn = newRow[newColumn.property];
    } else {
        baTable.table.selectColumn = undefined;
    }

}

/** 某一行被选中 */
function onRowClick(newRow: any, newColumn: any, event: MouseEvent) {
    setRowColumn(newRow, newColumn, event);
    emits('row-click', event);

}

/** 某一行被双击选中 */
function onRowDblClick(newRow: any, newColumn: any, event: MouseEvent) {
    setRowColumn(newRow, newColumn, event);

    emits('row-dblclick', event);

}


/** 某一行右键菜单 */
function onRowContextmenu(newRow: any, newColumn: any, event: MouseEvent) {
    setRowColumn(newRow, newColumn, event);

    emits('contextmenu', event);

}


const getRef = () => {
    return tableRef.value
}


defineExpose({
    unFoldAll,
    getRef,
    setCurrentRow(value: any) {
        tableRef.value!.setCurrentRow(value);
    },
    resizeListener() {
        tableRef.value!.resizeListener();
    }
})
</script>

<style  lang="scss">
@mixin wh-full {
    width: 100%;
    height: 100%;
}


.ba-data-container {
    display: flex;
    overflow: hidden;
    flex-direction: column;

    @include wh-full;

    .el-table-relative {
        position: relative;
        @include wh-full;


        .el-table {
            position: absolute !important;
            @include wh-full;
        }

    }


    .ba-data-table {
        width: 100%;
        overflow: hidden;
    }

    .ba-data-table .el-button+.el-button {
        margin-left: 6px;
    }


    .ba-data-table .table-header-cell .cell {
        color: var(--el-text-color-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }


    .table-pagination {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        background-color: var(--ba-bg-color-overlay);
        padding: 10px 0;


        .el-pagination {
            padding: 0;
        }

        .el-pagination .el-select .el-input {
            margin-left: 0;
        }

    }
}
</style>

<template>
    <div class="box-data-container">

        <div class="flex-1">
            <div class="el-table-relative" tabindex="0" @keydown="onKeyDown" @keyup="onKeyUp">
                <el-table ref="tableRef" class="box-data-table" 
                    header-cell-class-name="table-header-cell"
                    :border="border" 
                    :highlight-current-row="highlightCurrentRow"
                    :default-expand-all="boxTable.table.expandAll"
                    :row-key="boxTable.table.pk" 
                    :stripe="boxTable.table.stripe"
                    :data="boxTable.table.data" 
                    :height="'100%'"
                    @cell-click="onCellClick"
                    @cell-contextmenu="onCellContextmenu" 
                    @row-contextmenu="onRowContextmenu"
                    @row-click="onRowClick" 
                    @row-dblclick="onRowDblClick" 
                    @select="onSelect"
                    @select-all="onSelectAll" 
                    @sort-change="onSortChange" 
                    v-bind="$attrs" 
                    v-loading="boxTable.table.loading"
                    element-loading-text="拼命加载中" 
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :default-sort="defaultOrder">
                    <template v-for="(item, key) in boxTable.table.column">

                        <el-table-column v-bind="item" v-if="item.show !== false">
                            <template v-if="item.render" #default="scope">

                                <FieldRender :field="item"
                                    :key="item.render == 'switch' ? 'column-' + scope.column.property + '-' + key + '-' + scope.row[scope.column.property] : 0"
                                    :row="scope.row" :property="scope.column.property" 
                                    :customRender="Slots[item.prop]"/>

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
                :total="boxTable.table.total" @size-change="onTableSizeChange" @current-change="onTableCurrentChange">
            </el-pagination>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive, inject } from 'vue'
import FieldRender from './fieldRender/index.vue'

import { boxTableControl, provideName } from './utils/boxTable'


const Slots = useSlots() as any;
const tableRef = ref<any>();


interface Props {
    border?: boolean,
    highlightCurrentRow?: boolean,


    pagination?: boolean,
    boxTable?: boxTableControl,

    /** 是否右键选中 */
    menuSelect?: boolean
};

const props = withDefaults(defineProps<Props>(), {
    border: true,
    highlightCurrentRow: true,

    pagination: false,

    menuSelect: false
})

const boxTable = (props.boxTable || inject(provideName)) as boxTableControl;
if (props.boxTable) {
    provide(provideName, boxTable);
}


const state = reactive({
    currentPage: 1,
    pageSize: 10,
});

const defaultOrder = computed(() => {
    return boxTable.table.defaultOrder
})


const emits = defineEmits<{
    
    (e: 'action', event: string, data: anyObj): void

    /** 行被单击 */
    (e: "row-click", event: MouseEvent, item: any, index: number): void
    /** 行被双击 */
    (e: "row-dblclick", event: MouseEvent, item: any, index: number): void
    /** 右键单击某一行弹出菜单 */
    (e: "contextmenu", event: MouseEvent, item: any, index: number): void
    /** 排序表格 */
    (e: "sort-change", prop: string, order: string): void
    /** 键盘按下 */
    (e: "keydown", event:KeyboardEvent): void
    /** 键盘松开 */
    (e: "keyup", event:KeyboardEvent): void
}>()

/** 表格单页数量被修改 */
const onTableSizeChange = (val: number) => {
    state.pageSize = val;
    boxTable.sizeChangeHandler(val);
}

/** 表格页被修改 */
const onTableCurrentChange = (val: number) => {
    state.currentPage = val
    boxTable.pageChangeHandler(val);
}

/** 表格列排序被点击的时候触发 */
const onSortChange = ({ order, prop }: { order: string; prop: string }) => {

    order = order ? (order == 'ascending' ? 'asc' : 'desc') : '';

    boxTable.sortChange(prop, order);
    emits("sort-change", prop, order);

}


/*
 * 是否是全选操作
 * 只检查第一个元素是否被选择
 * 全选时：selectIds为所有元素的id
 * 取消全选时：selectIds为所有子元素的id
 */
const isSelectAll = (selectIds: string[]) => {
    let data = boxTable.table.data as TableRow[]
    for (const key in data) {
        return selectIds.includes(data[key][boxTable.table.pk!].toString())
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

    boxTable.table.selection = selection;
    boxTable.table.selectRow = null;

}

/*
 * 手动选择时，同时选择子级
 */
const onSelect = (selection: TableRow[], row: TableRow) => {

    boxTable.table.selection = selection;
    boxTable.table.selectRow = row;

    // if (
    //     selection.some((item: TableRow) => {
    //         return row[boxTable.table.pk!] === item[boxTable.table.pk!]
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


/** 手动高亮某行数据 */
function setCurrentRow(value: any) {
    tableRef.value!.setCurrentRow(value);

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
    setUnFoldAll(boxTable.table.data!, unfold)
}


/**
 * 设置行列数据
 * @param newRow 一行数据 
 * @param newColumn 表格组件的列数据
 * @param event 事件
 */
function setRowColumn(newRow: any, newColumn: any, event: MouseEvent) {


    let index = -1;
    let target = event.target as HTMLElement;

    while (target) {

        if (target.classList.contains("el-table__row")) {

            // @ts-ignore
            if (target.__vue__) {
                // @ts-ignore
                index = target.__vue__.index
            } else {
                // @ts-ignore
                index = target.rowIndex
            }
            break;

        } else {

            target = target.parentElement as HTMLElement;
        }

    }


    boxTable.table.selectRow = newRow;

    if (newColumn && newColumn.property) {
        boxTable.table.selectRowIndex = index;
        boxTable.table.selectColumn = newRow[newColumn.property];
    } else {
        boxTable.table.selectColumn = undefined;
        boxTable.table.selectColumnIndex = -1;
        boxTable.table.selectRowIndex = -1;
    }

    return index
}


/**
 * 某个单元格被单击
 * @param row 行数据
 * @param column 表格组件的列数据
 * @param cell 表格组件
 * @param event 事件
 */
function onCellClick(row: any, column: any, cell: any, event: any) {
    boxTable.table.selectColumnIndex = cell.cellIndex;
}

/**
 * 某个单元格右键单击
 * @param row 行数据
 * @param column 表格组件的列数据
 * @param cell 表格组件
 * @param event 事件
 */
function onCellContextmenu(row: any, column: any, cell: any, event: any) {
    boxTable.table.selectColumnIndex = cell.cellIndex;
}


/**
 * 某一行被选中
 * @param newRow 一行数据 
 * @param newColumn 表格组件的列数据
 * @param event 事件
 */
function onRowClick(newRow: any, newColumn: any, event: MouseEvent) {
    const index = setRowColumn(newRow, newColumn, event);
    emits('row-click', event, newRow, index);

}

/**
 * 某一行被双击选中
 * @param newRow 一行数据 
 * @param newColumn 表格组件的列数据
 * @param event 事件
 */

function onRowDblClick(newRow: any, newColumn: any, event: MouseEvent) {
    const index = setRowColumn(newRow, newColumn, event);

    emits('row-dblclick', event, newRow, index);

}


/**
 * 某一行右键菜单
 * @param newRow 一行数据 
 * @param newColumn 表格组件的列数据
 * @param event 事件
 */
function onRowContextmenu(newRow: any, newColumn: any, event: MouseEvent) {
    const index = setRowColumn(newRow, newColumn, event);


    if (props.menuSelect) {
        setCurrentRow(newRow);
    }

    emits('contextmenu', event, newRow, index);

}


function onKeyDown(event:KeyboardEvent){
    emits("keydown", event)
}



function onKeyUp(event:KeyboardEvent){
    emits("keyup", event)
}



const getRef = () => {
    return tableRef.value
}


defineExpose({
    unFoldAll,
    getRef,
    setCurrentRow,
    resizeListener() {
        tableRef.value!.resizeListener();
    },
    getTable() {
        return tableRef.value
    }
})
</script>

<style lang="scss">
@mixin wh-full {
    width: 100%;
    height: 100%;
}


.box-data-container {
    display: flex;
    overflow: hidden;
    flex-direction: column;

    @import "./style/icon-button.scss";



    @include wh-full;

    .el-table-relative {
        position: relative;
        @include wh-full;


        .el-table {
            position: absolute !important;
            @include wh-full;
        }

    }


    .box-data-table {
        width: 100%;
        overflow: hidden;
    }

    .box-data-table .el-button+.el-button {
        margin-left: 6px;
    }


    .box-data-table .table-header-cell .cell {
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

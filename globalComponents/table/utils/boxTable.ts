import { reactive, onUnmounted, onActivated, onDeactivated } from 'vue'
import { getArrayKey } from './common'
import { findIndexRow } from './index'


import globsZhCn from "../lang/globs-zh-cn"
import mitt from "./mitt"
import { cloneDeep } from 'lodash'

// import Sortable from 'sortablejs'


const operateMap = {
    /** 空 */
    "empty": "",
    /** 添加 */
    "add": "add",
    /** 编辑 */
    "edit": "edit",
    /** 查看 */
    "watch": "watch",
    /** 删除 */
    "delete": "delete",
    /** 取消操作 */
    "cancel": "cancel"
}





interface BoxTableForm<T = any> {

    /** 表单ref，new时无需传递 */
    ref?: any

    /** 当前操作:add=添加,edit=编辑 */
    operate: string

    /** 被操作数据ID,支持批量编辑:add=[0],edit=[1,2,n] */
    operateItems: T[]

    /** 表单数据 */
    item: T

    /** 提交按钮状态 */
    submitLoading: boolean

    /** 默认表单数据(添加) */
    defaultItems: T

    /** 表单字段加载状态 */
    loading: boolean

    /** 表单标题 */
    title: string,

    /** 表单标题对应表 */
    titleTable: {
        [key: string]: string
    }

    /** 当前操作是否为添加状态 */
    isAdd: boolean
    /** 当前操作是否为编辑状态 */
    isEdit: boolean
    /** 当前操作是否为查看状态 */
    isWatch: boolean

}



interface TableApi<T = any> {

    index(filter: any): Promise<{
        list: T[],
        totalCount: number
    }>

    add(data: T): Promise<T>

    edit(oldData: T, newData: T): Promise<T>

    delete(data: T | T[]): Promise<T>

    [key: string | number | symbol]: any;
}



interface TableActionHook<T> {

    /** 添加数据 */
    add: (this: boxTableControl<T>) => boolean | void,
    /** 导出数据 */
    export: (this: boxTableControl<T>) => boolean | void
    /** 刷新数据 */
    refresh: (this: boxTableControl<T>) => boolean | void
    /** 编辑数据 */
    edit: (this: boxTableControl<T>, item: T) => boolean | void,
    /** 删除数据 */
    delete: (this: boxTableControl<T>, item: T | T[]) => boolean | void,

    /** 提交数据 */
    submit: (this: boxTableControl<T>, item: T | T[]) => boolean | void,
    /** 提交添加数据 */
    addSubmit: (this: boxTableControl<T>, item: T) => boolean | void,
    /** 提交编辑数据 */
    editSubmit: (this: boxTableControl<T>, item: T | T[]) => boolean | void

}

type PartialTableApi<T> = Partial<TableApi<T>>
type PartialBoxTable<T = any> = Partial<BoxTable<T>>
type PartialTableActionHook<T> = Partial<TableActionHook<T>>


type BaTableBeforeKey = keyof PartialTableActionHook<any>



function callAction(table: any, action: string, args: any, thisCall: any) {

    let retVal;
    const call = table[action] as any;
    if (call && typeof call == 'function') {
        retVal = call.call(thisCall, args);
    }
    if (retVal !== false) {
        retVal = true
    }

    return retVal

}



class boxTableControl<T = any> {

    public eventBus = mitt();

    /** 用来渲染表的数据 */
    public table: BoxTable<T> = reactive<BoxTable<T>>({
        ref: undefined,
        // 主键字段,在选中，编辑的时候用这个ID来作为标示
        pk: undefined,
        // 数据源
        data: [],
        // 路由remark
        remark: "",
        // 表格加载状态
        loading: false,
        // 是否展开所有子项
        expandAll: false,
        // 选中项
        selection: [],

        selectRow: undefined,

        selectColumn: undefined,

        selectRowIndex: -1,

        selectColumnIndex: -1,


        // 不需要'双击编辑'的字段
        dblClickNotEditColumn: [],
        // 列数据
        column: [],
        // 数据总量
        total: 0,
        // 字段搜索,快速搜索,分页等数据
        filter: {
            order: {

            }
        },
        defaultOrder: {
            prop: "",
            order: ""
        },
        // 拖动排序限位字段:例如拖动行pid=1,那么拖动目的行pid也需要为1
        dragSortLimitField: 'pid',
        // 接受url的query参数并自动触发通用搜索
        acceptQuery: true,
        // 显示公共搜索
        showComSearch: false,
        // 扩展数据
        extend: {},
        /** 是否需要斑马纹 */
        stripe: false

    }) as BoxTable<T>


    public select = {
        row: "" as any,
        column: "" as any,

        rowIndex: -1,

        columnIndex: -1
    }



    /* 用来增加或者编辑的表单弹窗 */
    public form = reactive<BoxTableForm>({
        // 表单ref，new时无需传递
        ref: undefined,

        // 当前操作: add=添加,edit=编辑
        operate: '',
        // 被操作数据ID,支持批量编辑:add=[0],edit=[1,2,n]
        operateItems: [],

        // 表单数据
        item: {},
        // 提交按钮状态
        submitLoading: false,
        // 默认表单数据(添加)
        defaultItems: {},
        // 表单字段加载状态
        loading: false,

        get isAdd() {
            return this.operate == operateMap.add;
        },

        get isEdit() {
            return this.operate == operateMap.edit;
        },

        get isWatch() {
            return this.operate == operateMap.watch;
        },



        title: "",
        titleTable: {
            add: "添加",
            edit: "编辑",
            watch: "查看"
        }
    })

    // BaTable前置处理函数列表(前置埋点)
    public before: TableActionHook<T>
    // BaTable后置处理函数列表(后置埋点)
    public after: TableActionHook<T>


    private api: TableApi<T>;


    constructor(table: PartialBoxTable<T>, before: PartialTableActionHook<T> = {}, after: PartialTableActionHook<T> = {}, api?: PartialTableApi<T>) {


        /** 饿了么表格只允许一个排序 */
        const { defaultOrder, column } = table;
        const tempOrder = {} as any;
        if (defaultOrder) {

            const { order } = this.table.filter;

            tempOrder.prop = defaultOrder.prop;
            tempOrder.order = defaultOrder.order == "desc" ? "descending" : "ascending";

            order[tempOrder.prop] = defaultOrder.order;

        }

        /** 要提前先给它赋值，这样才可以关联到隐藏列的数据 */
        (column || []).forEach((element) => {

            element.show = element.show != undefined ? element.show : true;

        })



        this.table = Object.assign(this.table, table);

        this.table.defaultOrder = tempOrder;

        this.before = before as TableActionHook<T>;
        this.after = after as TableActionHook<T>;

        this.api = api! as TableApi<T>;



    }


    I18n(a: string, b: any = null) {
        // @ts-ignore
        return globsZhCn[a] || a;
    }

    auth(...args: any[]) {
        return true;
    }


    /** 取消操作 */
    cancelOperate() {

        if (this.runBefore(operateMap.cancel) === false) { return; }

        this.form.operate = operateMap.empty;
        /** 取消操作后，需要把它重置一下 */
        this.form.item = cloneDeep(this.form.defaultItems);

        this.runAfter(operateMap.cancel);

    }

    /** 刷新 */
    Refresh() {

        const action = "refresh"
        if (this.runBefore(action) === false) {
            return Promise.resolve();
        }

        this.table.loading = true;

        const retPormise = this.api.index(this.table.filter).then((data) => {

            this.table.data = data.list;
            this.table.total = data.totalCount;

            this.runAfter(action, data);

        }).catch(() => {


        }).finally(() => {
            this.table.loading = false;
        })

        return retPormise;

    }

    /** 添加 */
    Add() {

        const action = "add"
        if (this.runBefore(action) === false) {
            return;
        }

        this.form.operate = action;
        this.form.item = cloneDeep(this.form.defaultItems);
        this.form.title = this.form.titleTable[action]

        this.runAfter(action);

    }

    /** 编辑 */
    Edit(data: T) {

        const action = "edit"
        if (this.runBefore(action, data) === false) {
            return;
        }

        this.form.operate = action;
        this.form.title = this.form.titleTable[action];
        this.form.item = cloneDeep(data);
        /** 这里可以进行远程获取当前需要编辑的最新信息 */


        this.runAfter(action, data);

    }

    /** 导出 */
    Export() {
        const action = "export"
        if (this.runBefore(action) === false) {
            return;
        }


        this.runAfter(action);

    }

    /** 删除 */
    Delete(data: T | T[]) {

        const action = "delete"
        if (this.runBefore(action, data) === false) {
            return;
        }

        this.api.delete(data).then(() => {
            this.runAfter(action, data);
        })

    }

    /** 提交 */
    Submit() {

        const action = "submit"
        const operateAction = `${this.form.operate}Submit`;
        if (this.runBefore(action) === false || this.runBefore(operateAction) === false) {
            return;
        }

        let promiseCall: Promise<any>;

        if (this.form.isAdd) {
            promiseCall = this.api.add(this.form.item);
        } else if (this.form.isEdit) {
            promiseCall = this.api.edit(this.table.selectRow!, this.form.item);
        } else {
            promiseCall = Promise.resolve();
        }

        return promiseCall.then(() => {

            this.runAfter(action);
            this.runAfter(operateAction);

            this.form.operate = operateMap.empty;

        })

    }

    /** 查看 */
    Watch(data: T) {

        const action = "watch"
        if (this.runBefore(action) === false) {
            return;
        }

        this.form.operate = action;
        this.form.item = cloneDeep(data);
        this.form.title = this.form.titleTable[action]

        this.runAfter(action);


    }

    /**
     * 执行代码前，通过返回逻辑性来决定后续操作时候继续执行
     * @param funName 
     * @param args 
     * @returns 
     */
    runBefore(funName: string, args?: any) {

        return callAction(this.before, funName, args, this);
    }

    /**
     * 执行代码后，会把调用结果穿进去
     * @param funName 
     * @param args 
     * @returns 
     */
    runAfter(funName: string, args?: any) {

        return callAction(this.after, funName, args, this);
    }


    Search() {




    }


    /** 当前页改变 */
    pageChangeHandler(page: number) {

        this.table.filter.page = page;
        this.Refresh();

    }

    /** 每页条数改变 */
    sizeChangeHandler(size: number) {

        this.table.filter.limit = size;
        this.Refresh();

    }

    /**
     * 字段排序的时候修改
     * @param column 列的字段名字
     * @param sort 排序方向 asc 或者 desc 或者 空文本
     */
    sortChange(column: string, sort: string) {

        const { order } = this.table.filter;

        /** 饿了么表格只允许一个排序 */
        this.table.filter.order = {
            [column]: sort
        }

        // if (sort) {
        //     order[column] = sort;
        // } else {
        //     delete order[column];
        // }

    }


    /** 设置选中的行列 */
    setRowColumn(row: T, rowIndex: number, column: keyof T, columnIndex: number) {

        this.select.row = row;
        this.select.column = column;

        this.select.rowIndex = rowIndex;
        this.select.columnIndex = columnIndex;

    }

    /** 添加数据 */
    push(data: T | T[]) {

        if (!Array.isArray(data)) {
            data = [data]
        }


        return this.table.data.push(...data);

    }

}


export {
    boxTableControl,
    operateMap
}

export {

    PartialBoxTable as BoxTable,
    PartialTableApi as TableApi,
    PartialTableActionHook as TableActionHook
}


export const provideName = "boxTable";




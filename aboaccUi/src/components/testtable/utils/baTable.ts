import { reactive, onUnmounted, onActivated, onDeactivated } from 'vue'
import { getArrayKey } from './common'
import { baTableApi, tableApi } from '../api/common'
import { findIndexRow } from './index'


import globsZhCn from "../lang/globs-zh-cn"
import mitt from "./mitt"
import { clone } from 'lodash'


// import { ElNotification, ElForm } from 'element-plus'
// import { onBeforeRouteUpdate, useRoute } from 'vue-router'



// import Sortable from 'sortablejs'





export default class baTable {
    /**
     * 增删改查api
     */
    public api

    /** 单例的事件总线 */
    public eventBus: ReturnType<typeof mitt>

    /** 单例的国际化 */
    public I18n;

    /** 单例的权限认证 */
    public auth;

    /** 用来渲染表的数据 */
    public table: BaTable = reactive({
        ref: undefined,
        // 主键字段,在选中，编辑的时候用这个ID来作为标示
        pk: 'id',
        // 数据源
        data: [],
        // 路由remark
        remark: null,
        // 表格加载状态
        loading: false,
        // 是否展开所有子项
        expandAll: false,
        // 选中项
        selection: [],

        /** 单选选中的行 */
        selectRow: {},

        // 不需要'双击编辑'的字段
        dblClickNotEditColumn: [undefined],
        // 列数据
        column: [],
        // 数据总量
        total: 0,
        // 字段搜索,快速搜索,分页等数据
        filter: {},
        // 拖动排序限位字段:例如拖动行pid=1,那么拖动目的行pid也需要为1
        dragSortLimitField: 'pid',
        // 接受url的query参数并自动触发通用搜索
        acceptQuery: true,
        // 显示公共搜索
        showComSearch: false,
        // 扩展数据
        extend: {},
        /** 是否需要斑马纹 */
        stripe: false,
    })

    /* 用来增加或者编辑的表单弹窗 */
    public form = reactive<BaTableForm>({
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
            return this.operate == "add"
        },

        get isEdit() {
            return this.operate == "edit";
        },
        get isWatch() {
            return this.operate == "edit";
        },

        title: "",
        titleTable: {
            add: "添加",
            edit: "编辑",
            watch: "查看"
        }
    })

    // BaTable前置处理函数列表(前置埋点)
    public before
    // BaTable后置处理函数列表(后置埋点)
    public after

    // 通用搜索数据-需要响应性
    public comSearch: ComSearch = reactive({
        form: {},
        fieldData: new Map(),
        Reset() {
            for (const key in this.form) {
                (this.form as any)[key] = ''
            }
        }
    })

    constructor(api: baTableApi, table: Omit<BaTable, "data">, form: Partial<BaTableForm> = {}, before: BaTableBefore = {}, after: BaTableAfter = {}) {

        table.column.forEach((element) => {
            element.show = element.show != undefined ? element.show : true;
        });

        this.api = api
        this.form = Object.assign(this.form, form)
        this.table = Object.assign(this.table, table)
        this.before = before
        this.after = after

        this.initComSearch({});

        this.eventBus = mitt();
        this.I18n = function (a: string, b: any = null) {
            return (globsZhCn as any)[a] || a;
        }

        this.auth = function (...args: any[]) {
            return true;
        }
    }

    /**
     * 执行代码前，通过返回逻辑性来决定后续操作时候继续执行
     * @param funName 
     * @param args 
     * @returns 
     */
    runBefore(funName: string, args: any = {}) {
        if (this.before && this.before[funName] && typeof this.before[funName] == 'function') {
            return this.before[funName]!.call(this, { ...args }) === false ? false : true
        }
        return true
    }

    /**
     * 执行代码后，会把调用结果穿进去
     * @param funName 
     * @param args 
     * @returns 
     */
    runAfter(funName: string, args: any = {}) {
        if (this.after && this.after[funName] && typeof this.after[funName] == 'function') {
            return this.after[funName]!({ ...args }) === false ? false : true
        }
        return true
    }

    /* API请求方法-s */
    // 查看
    getIndex = () => {
        if (this.runBefore('getIndex') === false) return
        this.table.loading = true;


        // console.log(this.table.filter)
        // const res = {
        //     "code": 1,
        //     "msg": "",
        //     "time": 1681388654,
        //     "data": {
        //         "list": (data.slice(0,50).map((ele:any)=>{
        //             ele.is_work = ele.is_work ? 1: 0;
        //             ele.is_sell = ele.is_sell ? 1: 0;
        //             return ele;

        //         })),
        //         "total": 1,
        //         "remark": ""
        //     }
        // }
        // ;

        // this.table.data = res.data.list
        // this.table.total = res.data.total
        // this.table.remark = res.data.remark
        // this.table.loading = false
        // this.runAfter('getIndex', { res })

        return this.api
            .index(this.table.filter)
            .then((res) => {
                this.table.data = res.data.list
                this.table.total = res.data.total
                this.table.remark = res.data.remark

                this.runAfter('getIndex', { res })

            }).finally(() => {
                this.table.loading = false
            });

    }
    // 删除
    postDel = (ids: string[]) => {
        if (this.runBefore('postDel', { ids }) === false) return

        /** 这里报错 any */
        this.api.del(ids).then((res: any) => {
            this.onTableHeaderAction('refresh', {})
            this.runAfter('postDel', { res })
        })

    }
    // 编辑
    requestEdit = (id: string) => {
        if (this.runBefore('requestEdit', { id }) === false) return
        this.form.loading = true
        this.form.item = {}
        return this.api
            .edit({
                [this.table.pk!]: id,
            })

            /** 这里报错 any */
            .then((res: any) => {
                this.form.loading = false
                this.form.item = res.data.row
                this.runAfter('requestEdit', { res })
            })
    }
    /* API请求方法-e */

    /**
     * 双击表格
     */
    onTableDblclick = (row: TableRow, column: any) => {
        if (this.table.dblClickNotEditColumn!.indexOf('all') === -1 && this.table.dblClickNotEditColumn!.indexOf(column.property) === -1) {
            if (this.runBefore('onTableDblclick', { row, column }) === false) return
            this.toggleForm('edit', [row[this.table.pk!]])
            this.runAfter('onTableDblclick', {
                row,
                column,
            })
        }
    }

    /**
     * 打开表单
     * @param operate 操作:add=添加,edit=编辑
     * @param operateIds 被操作项的数组:add=[],edit=[1,2,...]
     */
    toggleForm = (operate = '', operateIds: string[] = []) => {
        if (this.runBefore('toggleForm', { operate, operateIds }) === false) return
        if (this.form.ref) {
            this.form.ref.resetFields()
        }
        if (operate == 'edit') {
            if (!operateIds.length) {
                return false
            }
            this.requestEdit(operateIds[0])
        } else if (operate == 'add') {
            this.form.item = Object.assign({}, this.form.defaultItems)
        }
        if (operate) {
            this.form.title = this.form.titleTable[operate] || "";
        }
        this.form.operate = operate
        this.form.operateItems = operateIds
        this.runAfter('toggleForm', { operate, operateIds })
    }

    onSubmit = (formEl: any | undefined = undefined) => {
        if (this.runBefore('onSubmit', { formEl: formEl, operate: this.form.operate!, items: this.form.item }) === false) return

        // Object.keys(this.form.items!).forEach((item) => {
        //     if (this.form.items![item] === null) {
        //         delete this.form.items![item]
        //     }
        // })

        // // 表单验证通过后执行的api请求操作
        // const submitCallback = () => {
        //     this.form.submitLoading = true
        //     this.api
        //         .postData(this.form.operate!, this.form.items!)

        //         /** 这里报错 any */
        //         .then((res: any) => {
        //             this.onTableHeaderAction('refresh', {})
        //             this.form.submitLoading = false
        //             this.form.operateIds?.shift()
        //             if (this.form.operateIds!.length > 0) {
        //                 this.toggleForm('edit', this.form.operateIds)
        //             } else {
        //                 this.toggleForm()
        //             }
        //             this.runAfter('onSubmit', { res })
        //         })
        //         .catch(() => {
        //             this.form.submitLoading = false
        //         })
        // }

        // if (formEl) {
        //     this.form.ref = formEl
        //     formEl.validate((valid) => {
        //         if (valid) {
        //             submitCallback()
        //         }
        //     })
        // } else {
        //     submitCallback()
        // }


    }

    /* 获取表格选择项的id数组 */
    getSelectionIds() {
        const ids: string[] = []
        this.table.selection?.forEach((item) => {
            ids.push(item[this.table.pk!])
        })
        return ids
    }

    /**
     * 表格内的事件响应
     * @param event 事件:selection-change=选中项改变,page-size-change=每页数量改变,current-page-change=翻页,sort-change=排序
     * @param data 携带数据
     */
    onTableAction = (event: string, data: anyObj) => {

        if (this.runBefore('onTableAction', { event, data }) === false) return
        const actionFun = new Map([
            [
                'selection-change',
                () => {
                    this.table.selection = data as TableRow[]
                },
            ],
            [
                'page-size-change',
                () => {
                    this.table.filter!.limit = data.size
                    this.getIndex()
                },
            ],
            [
                'current-page-change',
                () => {
                    this.table.filter!.page = data.page
                    this.getIndex()
                },
            ],
            [
                'sort-change',
                () => {
                    let newOrder = ''
                    if (!data.prop) {
                        newOrder = ''
                    } else if (data.prop) {
                        newOrder = data.prop + ',' + data.order
                    }
                    if (newOrder != this.table.filter!.order) {
                        this.table.filter!.order = newOrder
                        this.getIndex()
                    }
                },
            ],
            [
                'row-click',
                () => {
                    this.runBefore('rowClick', this.table.selectRow)

                },
            ],
            [
                'contextmenu',
                () => {
                    this.runBefore('contextmenu', this.table.selectRow)

                },
            ],

            [
                'default',
                () => {
                    console.warn('未定义操作')
                },
            ],
        ])

        const action = actionFun.get(event) || actionFun.get('default')
        action!.call(this)
        return this.runAfter('onTableAction', { event, data })
    }

    /**
     * 表格顶栏按钮事件响应
     * @param event 事件:refresh=刷新,edit=编辑,delete=删除,quick-search=快速查询
     * @param data 携带数据
     */
    onTableHeaderAction = (event: string, data: anyObj) => {
        if (this.runBefore('onTableHeaderAction', { event, data }) === false) return
        const actionFun = new Map([
            [
                'refresh',
                () => {
                    this.table.data = []
                    this.getIndex()
                },
            ],
            [
                'add',
                () => {
                    this.toggleForm('add')
                },
            ],
            [
                'edit',
                () => {
                    this.toggleForm('edit', this.getSelectionIds())
                },
            ],
            [
                'export',
                () => {
                    this.runBefore('export')
                },
            ],
            [
                'delete',
                () => {
                    this.postDel(this.getSelectionIds())
                },
            ],
            [
                'unfold',
                () => {
                    if (!this.table.ref) {
                        console.warn('折叠/展开失败，因为tableRef未定义，请在onMounted时赋值tableRef')
                        return
                    }
                    this.table.expandAll = data.unfold

                    /**这里报错 */
                    // this.table.ref.unFoldAll(data.unfold)
                },
            ],
            [
                'quick-search',
                () => {
                    this.table.filter!.quick_search = data.keyword
                    this.getIndex()
                },
            ],
            [
                'change-show-column',
                () => {
                    const columnKey = getArrayKey(this.table.column, 'prop', data.field)
                    this.table.column[columnKey].show = data.value
                },
            ],
            [
                'default',
                () => {
                    console.warn('未定义操作')
                },
            ],
        ])

        const action = actionFun.get(event) || actionFun.get('default')
        action!.call(this)
        return this.runAfter('onTableHeaderAction', { event, data })
    }

    /**
     * 初始化默认排序
     * el表格的`default-sort`在自定义排序时无效
     * 此方法只有在表格数据请求结束后执行有效
     */
    initSort = () => {
        if (this.table.defaultOrder && this.table.defaultOrder.prop) {
            if (!this.table.ref) {
                console.warn('初始化默认排序失败，因为tableRef未定义，请在onMounted时赋值tableRef')
                return
            }

            const defaultOrder = this.table.defaultOrder.prop + ',' + this.table.defaultOrder.order
            if (this.table.filter && this.table.filter.order != defaultOrder) {
                this.table.filter.order = defaultOrder

                /**这里报错 */
                // this.table.ref.getRef()?.sort(this.table.defaultOrder.prop, this.table.defaultOrder.order == 'desc' ? 'descending' : 'ascending')

            }
        }
    }

    /**
     * 表格拖动排序
     */
    dragSort = () => {
        const buttonsKey = getArrayKey(this.table.column, 'render', 'buttons')
        const moveButton = getArrayKey(this.table.column[buttonsKey]?.buttons, 'render', 'moveButton')
        if (moveButton === false) {
            return
        }
        if (!this.table.ref) {
            console.warn('初始化拖拽排序失败，因为tableRef未定义，请在onMounted时赋值tableRef')
            return
        }


        /**这里报错 */
        // const el = this.table.ref.getRef().$el.querySelector('.el-table__body-wrapper .el-table__body tbody');



        /** 这是修改拖放文件 */
        // const self = this;
        // Sortable.create(el, {
        //     animation: 200,
        //     handle: '.table-row-weigh-sort',
        //     ghostClass: 'ba-table-row',
        //     onStart: () => {
        //         this.table.column[buttonsKey].buttons?.forEach((item) => {
        //             item.disabledTip = true
        //         })
        //     },
        //     onEnd: (evt: Sortable.SortableEvent) => {
        //         this.table.column[buttonsKey].buttons?.forEach((item) => {
        //             item.disabledTip = false
        //         })
        //         // 找到对应行id
        //         const moveRow = findIndexRow(this.table.data!, evt.oldIndex!) as TableRow
        //         const replaceRow = findIndexRow(this.table.data!, evt.newIndex!) as TableRow
        //         if (this.table.dragSortLimitField && moveRow[this.table.dragSortLimitField] != replaceRow[this.table.dragSortLimitField]) {
        //             this.onTableHeaderAction('refresh', {});

        //             ElNotification({
        //                 type: 'error',
        //                 message: self.I18n('utils.The moving position is beyond the movable range!'),
        //             })
        //             return
        //         }

        //         this.api.sortableApi(moveRow[this.table.pk!], replaceRow[this.table.pk!]).then(() => {
        //             this.onTableHeaderAction('refresh', {})
        //         })
        //     },
        // })



    }

    mount = () => {
        if (this.runBefore('mount') === false) return


        /**
         * 表格内的按钮响应
         * @param name 按钮name
         * @param row 被操作行数据
         */
        this.eventBus.on('onTableButtonClick', ((data: { name: string; row: TableRow }) => {
            if (data.name == 'edit') {
                this.toggleForm('edit', [data.row[this.table.pk!]])
            } else if (data.name == 'delete') {
                this.postDel([data.row[this.table.pk!]])
            }
        }) as any)

        /**
         * 通用搜索响应
         * @param comSearchData 通用搜索数据
         */
        this.eventBus.on('onTableComSearch', ((data: comSearchData) => {

            this.table.filter!.search = data
            this.getIndex()

        }) as any)

        /**
         * 表格内的字段操作响应
         * @param value 修改后的值
         * @param row 被操作行数据
         * @param field 被操作字段名
         */
        this.eventBus.on('onTableFieldChange', ((data: { value: any; row: TableRow; field: keyof TableRow; render: string }) => {


            if (data.render == 'switch') {
                data.row.loading = true
                this.api
                    .postData('edit', { [this.table.pk!]: data.row[this.table.pk!], [data.field]: data.value })
                    .then(() => {
                        data.row.loading = false
                        data.row[data.field] = data.value
                    })
                    .catch(() => {
                        data.row.loading = false
                    })
            }

        }) as any)


    }

    /**
     * 通用搜索初始化
     */
    initComSearch = (query: anyObj = {}) => {
        const form: anyObj = {}

        if (this.table.column.length <= 0) {
            return
        }
        const field = this.table.column

        for (const key in field) {

            if (field[key].operator === false) {
                continue
            }
            const prop = field[key].prop
            if (typeof field[key].operator == 'undefined') {
                field[key].operator = '='
            }
            if (prop) {
                if (field[key].operator == 'RANGE' || field[key].operator == 'NOT RANGE') {
                    form[prop] = ''
                    form[prop + '-start'] = ''
                    form[prop + '-end'] = ''
                } else if (field[key].operator == 'NULL' || field[key].operator == 'NOT NULL') {
                    form[prop] = false
                } else {
                    form[prop] = ''
                }

                // 初始化来自query中的默认值
                if (this.table.acceptQuery && typeof query[prop] != 'undefined') {
                    const queryProp = (query[prop] as string) ?? ''
                    if (field[key].operator == 'RANGE' || field[key].operator == 'NOT RANGE') {
                        const range = queryProp.split(',')
                        if (field[key].render == 'datetime') {
                            if (range && range.length >= 2) {
                                form[prop + '-default'] = [new Date(range[0]), new Date(range[1])]
                            }
                        } else {
                            form[prop + '-start'] = range[0] ?? ''
                            form[prop + '-end'] = range[1] ?? ''
                        }
                    } else if (field[key].operator == 'NULL' || field[key].operator == 'NOT NULL') {
                        form[prop] = queryProp ? true : false
                    } else if (field[key].render == 'datetime') {
                        form[prop + '-default'] = new Date(queryProp)
                    } else {
                        form[prop] = queryProp
                    }
                }

                this.comSearch.fieldData.set(prop, {
                    operator: field[key].operator,
                    render: field[key].render,
                    comSearchRender: field[key].comSearchRender,
                })
            }
        }

        // 接受query再搜索
        if (this.table.acceptQuery) {
            const comSearchData: comSearchData[] = []
            for (const key in query) {
                const fieldDataTemp = this.comSearch.fieldData.get(key)
                comSearchData.push({
                    field: key,
                    val: query[key] as string,
                    operator: fieldDataTemp.operator,
                    render: fieldDataTemp.render,
                })
            }
            this.table.filter!.search = comSearchData
        }

        this.comSearch.form = Object.assign(this.comSearch.form, form)
    }


}


const operateMap = {
    "empty": "",
    "add": "add",
    "edit": "edit",
    "watch": "watch",
    "delete": "delete",
    "cancel": "cancel"

}




interface BaTableForm<T = any> {

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

interface testBaTableBefore<T> {

    add: () => boolean | void,
    export: () => boolean | void
    refresh: () => boolean | void
    edit: (item: T) => boolean | void,
    delete: (item: T | T[]) => boolean | void,

    submit: (item: T | T[]) => boolean | void,
    addSubmit: (item: T) => boolean | void,
    editSubmit: (item: T | T[]) => boolean | void

}





class testBaTable<T = any> {

    public eventBus = mitt();

    /** 用来渲染表的数据 */
    public table = reactive<testBaTabless<T>>({
        ref: undefined,
        // 主键字段,在选中，编辑的时候用这个ID来作为标示
        pk: 'id',
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

        // 不需要'双击编辑'的字段
        dblClickNotEditColumn: [],
        // 列数据
        column: [],
        // 数据总量
        total: 0,
        // 字段搜索,快速搜索,分页等数据
        filter: {},
        // 拖动排序限位字段:例如拖动行pid=1,那么拖动目的行pid也需要为1
        dragSortLimitField: 'pid',
        // 接受url的query参数并自动触发通用搜索
        acceptQuery: true,
        // 显示公共搜索
        showComSearch: false,
        // 扩展数据
        extend: {},
        /** 是否需要斑马纹 */
        stripe: false,
    })

    /* 用来增加或者编辑的表单弹窗 */
    public form = reactive<BaTableForm>({
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
    public before: testBaTableBefore<T>
    // BaTable后置处理函数列表(后置埋点)
    public after: testBaTableBefore<T>


    private api: tableApi;


    constructor(table: BaTable, before: Partial<testBaTableBefore<T>> = {}, after: Partial<testBaTableBefore<T>> = {}, api?: tableApi) {


        table.column.forEach((element) => {
            element.show = element.show != undefined ? element.show : true;
        });

        this.table = Object.assign(this.table, table);
        this.before = before as testBaTableBefore<T>;
        this.after = after as testBaTableBefore<T>;

        this.api = api!;

    }


    I18n(a: string, b: any = null) {
       
        return (globsZhCn as any)[a] || a;
    }

    auth(...args: any[]) {
        return true;
    }


    /** 取消操作 */
    cancelOperate() {

        if (this.runBefore(operateMap.cancel) === false) { return; }

        this.form.operate = operateMap.empty;

        this.runAfter(operateMap.cancel);

    }

    /** 刷新 */
    Refresh() {

        const action = "refresh"
        if (this.runBefore(action) === false) {
            return;
        }

        this.table.loading = true;

        this.api.index(this.table.filter).then((data) => {

            this.table.data = data.list;
            this.table.total = data.totalCount;

            this.runAfter(action, data);

        }).catch(() => {


        }).finally(() => {
            this.table.loading = false;
        })

    }

    /** 添加 */
    Add() {

        const action = "add"
        if (this.runBefore(action) === false) {
            return;
        }

        this.form.operate = action;
        this.form.item = clone(this.form.defaultItems);
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
        this.form.item = clone(data);
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

        this.api.delete(this.table.selectRow).then(() => {
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

        promiseCall.then(() => {

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
        this.form.item = clone(data);
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
        const call = this.before[funName as keyof testBaTableBefore<T>];
        if (call && typeof call == 'function') {
            return call(args) === false ? false : true
        }
        return true
    }

    /**
     * 执行代码后，会把调用结果穿进去
     * @param funName 
     * @param args 
     * @returns 
     */
    runAfter(funName: string, args?: any) {
        const call = this.after[funName as keyof testBaTableBefore<T>];
        if (call && typeof call == 'function') {
            return call(args) === false ? false : true
        }
        return true
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


}


export {
    testBaTable,
    testBaTableBefore
}







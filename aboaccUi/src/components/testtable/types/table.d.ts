import { Component, ComponentPublicInstance } from 'vue'
import Table from '/@/components/table/index.vue'
import * as enumDeclare from "./enum";

declare global {


    type TableRenderType = enumDeclare.TableRenderType;


    const TableRenderType: typeof enumDeclare.TableRenderType;


    interface testBaTabless<T = any> {

        /** 表格的Vue组件实例 */
        ref?: typeof Table

        /** 主键字段 */
        pk: string

        /** 表格数据 */
        data: T[]

        /** el-alert 提示信息 */
        remark?: string

        /** 表格加载状态 */
        loading: boolean

        /** 是否展开所有子项 */
        expandAll: boolean

        /** 选中多行项 */
        selection: T[]

        /** 选中的单行 */
        selectRow?: T

        /** 选中的单行列 */
        selectColumn?: any


        dblClickNotEditColumn: string[]

        /** 列数据 */
        column: TableColumn[]

        /** 数据总量 */
        total: number

        /** 接受url的query参数并自动触发通用搜索 */
        acceptQuery: boolean

        /** 字段搜索,快速搜索,分页等数据 */
        filter: anyObj

        /** 默认排序字段 */
        defaultOrder?: { prop: string; order: string }

        /** 拖动排序限位字段:例如拖动行pid=1,那么拖动目的行pid也需要为1 */
        dragSortLimitField?: string

        /** 显示公共搜索 */
        showComSearch?: boolean

        /** 扩展数据 */
        extend?: anyObj,

        /** 是否需要斑马纹 */
        stripe: boolean

    }

    interface BaTableForm<T = any> {

        /** 表单ref，new时无需传递 */
        ref?: InstanceType<typeof ElForm>

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

    }

    /* baTable */
    interface BaTable {
        ref?: typeof Table

        /** 主键字段 */
        pk?: string
        /** 数据源 */
        data: TableRow[]
        /** 路由remark */
        remark?: string | null
        /** 表格加载状态 */
        loading?: boolean
        /** 是否展开所有子项 */
        expandAll?: boolean
        /** 选中项 */
        selection?: TableRow[]

        /** 单选选中的行 */
        selectRow?: any,
        /** 单选中的列 */
        selectColumn?: any,
        /** 单选选中的行下标 */
        selectIndex?: number



        /** 不需要'双击编辑'的字段 */
        dblClickNotEditColumn?: (string | undefined)[]
        /** 列数据 */
        column: TableColumn[]
        /** 数据总量 */
        total?: number
        /** 字段搜索,快速搜索,分页等数据 */
        filter?: anyObj
        defaultOrder?: { prop: string; order: string }
        /** 拖动排序限位字段:例如拖动行pid=1,那么拖动目的行pid也需要为1 */
        dragSortLimitField?: string
        /** 接受url的query参数并自动触发通用搜索 */
        acceptQuery?: boolean
        /** 显示公共搜索 */
        showComSearch?: boolean
        /** 扩展数据 */
        extend?: anyObj,

        /** 是否需要斑马纹 */
        stripe?: boolean

    }

    interface TableRenderPublicInstance extends ComponentPublicInstance {
        $attrs: {
            renderValue: any
            renderRow: TableRow
            renderField: TableColumn
        }
    }


    /* BaTable前置处理函数(前置埋点) */
    interface BaTableBefore {

        /** 某一行被选中 */
        rowClick?: Function
        /** 获取数据 */
        getIndex?: Function
        /** 删除数据 */
        postDel?: Function
        /** 编辑数据 */
        requestEdit?: Function
        /** 双击表格 */
        onTableDblclick?: Function
        /** 表单弹出 */
        toggleForm?: Function
        /** 提交表单 */
        onSubmit?: Function
        /** 表格事件 */
        onTableAction?: Function
        /** 表格按钮事件 */
        onTableHeaderAction?: Function
        /** 表格加载事件 */
        mount?: Function
        [key: string]: Function | undefined
    }

    /* BaTable后置处理函数(后置埋点) */
    interface BaTableAfter {

        /** 某一行被选中 */
        rowClick?: Function
        getIndex?: Function
        postDel?: Function
        requestEdit?: Function
        onTableDblclick?: Function
        toggleForm?: Function
        onSubmit?: Function
        onTableAction?: Function
        onTableHeaderAction?: Function
        mount?: Function
        [key: string]: Function | undefined
    }

    interface ComSearch {
        form: anyObj
        fieldData: Map<string, any>,
        /** 表单重置 */
        Reset: () => void
    }


    type TableRenderTypeStr = 'icon' | 'switch' | 'image' | 'images' | 'tag' | 'tags' | 'url' | 'datetime' | 'buttons' | 'customTemplate' | 'customRender'


    /* 表格列 */
    interface TableColumn extends ElTableColumn {
        /** 是否显示 */
        show?: boolean
        /** 是否在下拉菜单的复选框显示 默认为true显示 */
        enableColumnDisplayControl?: boolean
        /** 渲染为:icon|switch|image|images|tag|url|datetime|buttons|customTemplate|customRender */
        render?: TableRenderType | TableRenderTypeStr
        /** 操作按钮组 */
        buttons?: OptButton[]
        /** 渲染为Tag时:el-tag 组件的主题 */
        effect?: TagProps['effect']
        /** 渲染为Tag时:el-tag 组件的size */
        size?: TagProps['size']
        /** 自定义数据:比如渲染为Tag时,可以指定不同值时的Tag的Type属性 { open: 'success', close: 'info' } */
        custom?: any
        /** 谨慎使用：自定义渲染模板，方法可返回html内容，请确保返回内容是xss安全的 */
        customTemplate?: (row: TableRow, field: TableColumn, value: any) => string
        /** 自定义组件/函数渲染 */
        customRender?: string | Component
        /** 渲染为链接时,链接的打开方式 */
        target?: aTarget
        /** 渲染为:url 时的点击事件 */
        click?: Function
        /** 渲染为 datetime 时的格式化方式,字母可以自由组合:y=年,m=月,d=日,h=时,M=分,s=秒，默认：yyyy-mm-dd hh:MM:ss */
        timeFormat?: string
        /** 默认值 */
        default?: any
        /** 值替换数据,如{open: '开'} */
        replaceValue?: any
        /** 使用了 render 属性时,渲染前对字段值的预处理方法，请返回新值 */
        renderFormatter?: (row: TableRow, field: TableColumn, value: any) => any
        /** 通用搜索操作符,默认值为=,false禁用此字段通用搜索,支持的操作符见下定义 */
        operator?: boolean | OperatorStr
        /** 通用搜索框的placeholder */
        operatorPlaceholder?: string
        /** 公共搜索渲染方式:上方的 render=tag|switch 时公共搜索也会渲染为下拉，数字会渲染为范围筛选，时间渲染为时间选择器等 */
        comSearchRender?: 'remoteSelect' | 'select' | 'date' | 'customRender'
        /** 公共搜索自定义组件/函数渲染 */
        comSearchCustomRender?: string | Component
        /** 远程属性 */
        remote?: {
            pk?: string
            field?: string
            params?: anyObj
            multiple?: boolean
            remoteUrl: string
        }
    }

    /* 表格右侧操作按钮 */
    interface OptButton {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: string
        name: string
        title?: string
        npTooltip?: boolean
        text?: string
        class?: string
        type: ButtonType
        icon: string
        popconfirm?: any
        disabledTip?: boolean
        // 自定义点击事件
        click?: (row: TableRow, field: TableColumn) => void
        // 按钮是否显示，请返回布尔值
        display?: (row: TableRow, field: TableColumn) => boolean
    }

    /* 表格行 */
    interface TableRow extends anyObj {
        children?: TableRow[]
    }

    /* 表头支持的按钮 */
    type HeaderOptButton = 'refresh' | 'add' | 'edit' | 'delete' | 'unfold' | 'recycle bin' | 'comSearch' | 'quickSearch' | 'columnDisplay' | 'export'

    // '='：等于
    // '<>'：不等于
    // '>'：大于
    // '>='：大于或等于
    // '<'：小于
    // '<='：小于或等于
    // 'LIKE'：模糊匹配，通常与通配符一起使用
    // 'NOT LIKE'：与LIKE相反，表示不匹配
    // 'IN'：在指定的一组值中匹配
    // 'NOT IN'：与IN相反，表示不在指定的一组值中
    // 'RANGE'：在指定的范围内匹配，通常用于数值和日期类型的数据
    // 'NOT RANGE'：与RANGE相反，表示不在指定的范围内
    // 'NULL'：匹配空值
    // 'NOT NULL'：与NULL相反，表示匹配非空值
    // 'FIND_IN_SET'：在指定的逗号分隔值列表中查找匹配项

    /* 通用搜索操作符支持的值 */
    type OperatorStr =
        | '=' // 等于，默认值
        | '<>'
        | '>'
        | '>='
        | '<'
        | '<='
        | 'LIKE'
        | 'NOT LIKE'
        | 'IN'
        | 'NOT IN'
        | 'RANGE' // 范围，将生成两个输入框 以输入最小值和最大值
        | 'NOT RANGE'
        | 'NULL' // 是否为NULL，将生成单个复选框
        | 'NOT NULL'
        | 'FIND_IN_SET'

    /* 链接打开方式 */
    type aTarget = '_blank' | '_self'

    /* 通用搜索事件返回的Data */
    interface comSearchData {
        field: string
        val: string | number | string[] | number[]
        operator: string
        render: string
    }

    interface ElTreeData {
        label: string
        children?: ElTreeData[]
    }




    // /* 用来增加或者编辑的表单弹窗 */
    // interface BaTableForm {
    //     /** 表单ref，new时无需传递 */
    //     ref?: InstanceType<typeof ElForm> | undefined
    //     /** 表单label宽度 */
    //     labelWidth?: number
    //     /** 当前操作:add=添加,edit=编辑 */
    //     operate?: string
    //     /** 被操作数据ID,支持批量编辑:add=[0],edit=[1,2,n] */
    //     operateIds?: string[]
    //     /** 表单数据 */
    //     items: anyObj
    //     /** 提交按钮状态 */
    //     submitLoading?: boolean
    //     /** 默认表单数据(添加) */
    //     defaultItems?: anyObj
    //     /** 表单字段加载状态 */
    //     loading?: boolean
    //     /** 扩展数据 */
    //     extend?: anyObj,

    //     /** 表单标题 */
    //     title: string,
    //     /** 表单标题对应表 */
    //     titleTable: {
    //         [key: string]: string
    //     }
    // }


}

/*
 * ElTableColumn可用属性
 * 未找到方法直接导出tableColumn的props类型定义
 * https://element-plus.org/zh-CN/component/table.html#table-column-attributes
 */
interface ElTableColumn {
    /** 显示类型，只有在第一列上面使用 */
    type?: 'selection' | 'index' | 'expand'

    index?: number | Function

    label?: string

    'column-key'?: string
    prop: string

    /** 列宽 */
    width?: string | number
    /** 列的最小宽度 */
    'min-width'?: string | number

    fixed?: string | boolean
    'render-header'?: Function

    /** 当前列是否可以排序 */
    sortable?: string | boolean
    /** 排序模式 */
    'sort-method'?: Function
    'sort-by'?: Function
    'sort-orders'?: string[] | null[]
    resizable?: boolean
    formatter?: Function
    'show-overflow-tooltip'?: boolean

    /** 字符串显示位置 */
    align?: 'left' | 'center' | 'right'
    'header-align'?: 'left' | 'center' | 'right'
    'class-name'?: string
    'label-class-name'?: string
    selectable?: Function
    'reserve-selection'?: boolean
    filters?: { key: string; value: string }[]
    'filter-placement'?: string
    'filter-multiple'?: boolean
    'filter-method'?: Function
    'filtered-value'?: any[]
}





declare global {


    interface TableDefaultData<T = any> {
        list: T
        remark: string
        total: number
    }

    interface ApiResponse<T = any> {
        code: number
        data: T
        msg: string
        time: number
    }

    type ApiPromise<T = any> = Promise<ApiResponse<T>>


    interface anyObj {
        [key: string]: any
    }



}
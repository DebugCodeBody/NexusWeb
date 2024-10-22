<template>
    <div style="padding:10px;">
        <div style="width: 50%;height: 100%;">
            <el-table 
                ref="tableRef" 
                class="ba-data-table w100" 
                header-cell-class-name="table-header-cell"
                :height="height"
                :default-expand-all="table.expandAll" 
                :data="tableData" 
                :row-key="table.pk" 
                :border="true"
                :stripe="true">
                <template v-for="(item, index) in table.column" :key="index">

                    <Column v-if="item.show !== false" :attr="item">
                        <template v-if="item.render" #default="scope">
                            <FieldRender 
                                :field="item" 
                                :key="fieldRenderKey(item,scope,index)"
                                :row="scope.row" 
                                :property="scope.column.property" />
                        </template>
                    </Column>

                </template>
            </el-table>

        </div>

        <!-- <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
        </el-table> -->

    </div>
</template>

<script setup lang="ts">
import Column from '@/components/table/column/index.vue'
import FieldRender from '@/components/table/fieldRender/index.vue'

import data from "./data"


let tableData = $ref(data);
let height = $ref(1100);
let tableRef = $ref<any>();

function fieldRenderKey(item:any, scope:any, index:number){
    return item.render == 'switch' ? 'column-' + scope.column.property + '-' + index + '-' + scope.row[scope.column.property] : 0
}

type tsModel2 = {
    /** 菜品名字 */
    name: string,
    /** 菜品类型 */
    type: string,
    /** 是否激活 */
    active: boolean,
    /** 供餐时间 */
    supplykind: number,
    /** 是否自动排餐 */
    auto: number,
    /** 加工成本,厨师点优惠用 */
    fprocess_cost?: number,
    /** 加工方式, 现炒, 机炒 */
    fcategory: number,
    /** 预制菜品,昨天已经下料,今天采购的时候排除掉这部分的料 */
    fpreset: boolean,

    /** 库存方式 0/null=无限 1=每餐 2=每天 3=全部 */
    stored?: number | undefined,
}


/** 表格渲染类型 */
enum renderType {
    /** 图标 */
    ICON = 'icon',
    /** 开关 */
    SWITCH = 'switch',
    /** 图片 */
    IMAGE = 'image',
    /** 图片组 */
    IMAGES = 'images',
    /** 标签 */
    TAG = 'tag',
    /** 标签组 */
    TAGS = 'tags',
    /** 链接 */
    URL = 'url',
    /** 时间 */
    DATETIME = 'datetime',
    /** 自定义模板 */
    CUSTOMTEMPLATE = 'customTemplate',
    /**  自定义组件/函数渲染 */
    CUSTOMRENDER = 'customRender',
    /** 按钮组 */
    BUTTONS = 'buttons'
}


type column = {

    /** 显示类型，只有在第一列上面使用 */
    type: string,
    /** 显示位置 */
    align: string,
    /** 数据里的属性名 */
    prop: string,
    /** 列宽度 */
    width: number,

    /** 列渲染类型, 默认为字符串 */
    render?: renderType,
    
    /** 当render为 tag 的时候，这里就是渲染的标签类型 */
    custom?: string[],
    /** 当render为 tag 的时候，这里就是渲染的字典对应值 */
    replaceValue?: string[],

    /** 搜索条件 */
    operator?: string,
    
    /** 搜索框里显示的 placeholder */
    operatorPlaceholder: string,

    /** 当前列是否可以排序 */
    sortable: string,

    /** 当前列是否显示 */
    show?: boolean

}


const table: {
    [key: string]: any
} = {
    "pk": "name",
    "data": [],
    "remark": null,
    "loading": false,
    "expandAll": false,
    "selection": [],
    "dblClickNotEditColumn": [null],
    "total": 0,

    "filter": {
        "search": []
    },

    "dragSortLimitField": "pid",
    "acceptQuery": true,
    "showComSearch": false,
    "extend": {},

    "column": [{
        "type": "index",
        "align": "center",
        "operator": false,
        "width": 100
    }, {
        "label": "名称",
        "prop": "name",
        "align": "center",
        "operator": "LIKE",
        "operatorPlaceholder": "模糊查询",
        "width": 200
    }, {
        "label": "类型",
        "prop": "type",
        "align": "center",
        "width": 80,
        "operator": "LIKE",
        "operatorPlaceholder": "模糊查询"
    }, {
        "label": "加工方式",
        "prop": "fcategory",
        "align": "center",
        "operator": "LIKE",
        "operatorPlaceholder": "模糊查询"
    }, {
        "label": "加工费",
        "prop": "fprocess_cost",
        "align": "center",
        "operator": "LIKE",
        "operatorPlaceholder": "模糊查询",
    }, {
        "label": "供应时间",
        "prop": "supplykind",
        "align": "center",
        "render": "LIKE",
    }, {
        "label": "无须排单",
        "prop": "auto",
        "align": "center",
        "render": renderType.SWITCH
    }]
}


onMounted(() => {


})


</script>

<script lang="ts">
export default {
    name: "Restaurant",
    key: Math.random()

}
</script>

<style lang="scss" scoped>
div {
    width: 100%;
    height: 300%;
}
</style>

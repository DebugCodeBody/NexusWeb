<template>
    <div class="h-full overflow-hidden no-md" :class="{
        'no-md': !md
    }">
        <div class="mb-10px flex">
            <div class="flex mr-10px">
                <el-button type="danger" @click="onClickCance">注销登录</el-button>
            </div>
            <div>
                <el-select v-model="selectVal" placeholder="选择器" @change="onSelectChange">
                    <el-option v-for="(item, index) in option" :key="item" :label="item" :value="index" />
                </el-select>
            </div>
        </div>
        <el-row class="h-full" :gutter="20">

            <el-col :sm="24" :md="24" v-if="selectVal == 0">
                <div class="col-table-wrap">
                    <!-- <div class="title">外发交货清单</div> -->
                    <div class="table-wrap">
                        <el-table class="ba-data-table" header-cell-class-name="table-header-cell"
                            :default-expand-all="table.expandAll" :data="get_out_delivery" :row-key="table.pk"
                            :border="true" :stripe="true" :row-class-name="onRowClassName">
                            <template v-for="(item, index) in outDelivery_Table.column" :key="index">
                                <Column v-if="item.show !== false" :attr="item" :fixed="item.fixed" class="asdasd">
                                    <template v-if="item.render" #default="scope">
                                        <FieldRender :field="item" :key="fieldRenderKey(item, scope, index)"
                                            :row="scope.row" :property="scope.column.property" />
                                    </template>
                                </Column>
                            </template>
                        </el-table>
                    </div>
                </div>
            </el-col>
            <el-col :sm="24" :md="24" v-if="selectVal == 1">
                <div class="col-table-wrap">
                    <!-- <div class="title">待领料清单</div> -->
                    <div class="table-wrap">
                        <el-table class="ba-data-table" header-cell-class-name="table-header-cell"
                            :default-expand-all="table.expandAll" :data="get_out_use" :row-key="table.pk" :border="true"
                            :stripe="true" :row-class-name="onRowClassName">
                            <template v-for="(item, index) in outUseTable.column" :key="index">
                                <Column v-if="item.show !== false" :attr="item" :fixed="item.fixed">
                                    <template v-if="item.render" #default="scope">
                                        <FieldRender :field="item" :key="fieldRenderKey(item, scope, index)"
                                            :row="scope.row" :property="scope.column.property" />
                                    </template>
                                </Column>
                            </template>
                        </el-table>
                    </div>

                </div>
            </el-col>
            <el-col :sm="24" :md="24" v-if="selectVal == 2">
                <div class="col-table-wrap ">
                    <!-- <div class="title">外发付款清单</div> -->
                    <div class="table-wrap ">
                        <el-table class="ba-data-table " header-cell-class-name="table-header-cell"
                            :default-expand-all="table.expandAll" :data="get_out_pay" :row-key="table.pk" :border="true"
                            :stripe="true" :row-class-name="onRowClassName">
                            <template v-for="(item, index) in table.column" :key="index">
                                <Column v-if="item.show !== false" :attr="item" :fixed="item.fixed">
                                    <template v-if="item.render" #default="scope">
                                        <FieldRender :field="item" :key="fieldRenderKey(item, scope, index)"
                                            :row="scope.row" :property="scope.column.property" />
                                    </template>
                                </Column>
                            </template>
                        </el-table>
                    </div>
                </div>
            </el-col>

        </el-row>



    </div>

    <pop-edite @refresh="onRefresh" />
</template>

<script setup lang="ts">
import 'element-plus/theme-chalk/display.css'

import Column from '@/components/table/column/index.vue'
import FieldRender from '@/components/table/fieldRender/index.vue'

import editDate from './editPop/editDate.vue'
import popEdite from './editPop/popEdite.vue'
import drawing from './drawing/index.vue'
import printPdf from './printPdf/index.vue'



import get_out_payData from "./data"
import get_out_useData from "./get_out_use"
import get_out_deliveryData from "./get_out_delivery"

import { debounce } from "@/utils/other"
import { MessageBoxWarning, messageError } from "@/utils/elementLib"

import { getInfo, getDrawing } from "@/api"
import { wxCancel } from "@/api/user"
import { locale } from 'dayjs'

function fieldRenderKey(item: any, scope: any, index: number) {
    return item.render == 'switch' ? 'column-' + scope.column.property + '-' + index + '-' + scope.row[scope.column.property] : 0
}

const tableEl = $ref<HTMLDivElement>();
let md = $ref(getIsMd());



let showTable = $ref(false);
const get_out_pay = $ref<any[]>([]);
const get_out_use = $ref<any[]>([]);
const get_out_delivery = $ref<any[]>([]);

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


type tableolumn = {

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

const option = $ref([
    "外发交货清单",
    "待领料清单",
    "外发付款清单",
]);
const selectVal = $ref(0);




const productionColumn = {
    "label": "生产图纸",
    "align": "center",

    "render": "customRender",
    "customRender": drawing,
    width: 110,
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
        "label": "序号",
        "align": "center",
        "operator": false,
        "width": 65,
    }, {
        "label": "工单单号",
        "prop": "mo_name",
        "align": "center",
        "width": 110,

    }, {
        "label": "工艺",
        "prop": "wo_name",
        "align": "center",
        "width": 100,
    }, {
        "label": "材料",
        "prop": "mat_name",
        "align": "center",
        "width": 200,
    }, {
        "label": "数量",
        "prop": "qty",
        "align": "center",
        "width": 100
    }, {
        "label": "应付",
        "prop": "amount",
        "align": "center",
        "width": 100
    }
        , {
        "label": "付款日期",
        "prop": "pay_date",
        "align": "center",
        width: 120
    }
        , {
        "label": "外发日期",
        "prop": "out_date",
        "align": "center",
        width: 120
    }
        ,
        productionColumn
        , {
        "label": "扣款原因",
        "prop": "reason",
        "align": "center",
    }
    ]
}

/** 待领料清单 */
const outUseTable: {
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
        "label": "序号",
        "align": "center",
        "operator": false,
        "width": 65,
    }, {
        "label": "工单单号",
        "prop": "mo_name",
        "align": "center",
        "width": 110,

    }, {
        "label": "材料",
        "prop": "mat_name",
        "align": "center",
        "width": 200,
    }, {
        "label": "规格",
        "prop": "spec",
        "align": "center",
        "width": 150
    }, {
        "label": "数量",
        "prop": "qty",
        "align": "center",
        "width": 100
    }
        , {
        "label": "交货日期",
        "prop": "delivery_date",
        "align": "center",
        width: 120
    }
        , {
        "label": "延期日期",
        "prop": "delay_date",
        "align": "center",
        width: 120
    }
        ,
        productionColumn
        , {
            "label": "工单打印",
            "align": "center",

            "render": "customRender",
            "customRender": printPdf,
            width: 110,
    }
        , {
        "label": "补料位置",
        "prop": "est_name",
        "align": "center",
    }
    ]
}


/** 外发交货清单 */
const outDelivery_Table: {
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
        "label": "序号",
        "align": "center",
        "operator": false,
        "width": 65,
    }, {
        "label": "工单单号",
        "prop": "mo_name",
        "align": "center",
        "width": 110,

    }, {
        "label": "工艺",
        "prop": "wo_name",
        "align": "center",
        "width": 100,
    }, {
        "label": "材料",
        "prop": "mat_name",
        "align": "center",
        "width": 200,
    }, {
        "label": "规格",
        "prop": "spec",
        "align": "center",
        "width": 150
    }, {
        "label": "数量",
        "prop": "qty",
        "align": "center",
        "width": 100
    }
        , {
        "label": "交货日期",
        "prop": "delivery_date",
        "align": "center",
        width: 120
    }
        , {
        "label": "延期日期",
        "prop": "delay_date",
        "align": "center",
        width: 120
    }
        , {
        "label": "回复日期",
        "prop": "osup_reply_date",
        "align": "center",
        "render": "customRender",
        "customRender": editDate,
        width: 120
    }
        ,
        productionColumn,

        {
            "label": "工单打印",
            "align": "center",

            "render": "customRender",
            "customRender": printPdf,
            width: 110,
    }
        , {
        "label": "补料位置",
        "prop": "est_name",
        "align": "center",
    }
    ]
}


function onRowClassName(item: any) {
    return item.row.urgent ? "urgent" : "";
}


function onSelectChange(value: string) {

    // const selectItem = [].find.call(document.querySelectorAll("div.title"),(elem:HTMLDivElement)=>{
    //     return elem.innerText === value 
    // })! as HTMLDivElement;

    // document.querySelector(".el-row")!.scroll({
    //         top: selectItem.offsetTop
    // })

}



function onClickCance() {

    MessageBoxWarning("确定是要注销登录？").then(() => {

        wxCancel().finally(() => {

            location.href = "/ding/auth/wxapp/index.html?path=qrlogin"

        })

    })


}



function onRefresh() {



    if (process.env.NODE_ENV == "production") {

        getInfo().then((data: any) => {

            get_out_pay.length = 0;
            get_out_use.length = 0;
            get_out_delivery.length = 0;

            setTimeout(() => {

                get_out_pay.push(...data.outPay);
                get_out_use.push(...data.outUse);
                get_out_delivery.push(...data.outDelivery);
                showTable = true;

            })


        })

    } else {

        get_out_pay.push(...get_out_payData);
        get_out_use.push(...get_out_useData);
        get_out_delivery.push(...get_out_deliveryData);

    }

}




function getIsMd() {
    return window.innerWidth >= 992;
}


window.addEventListener("resize", () => {
    md = getIsMd();
});


onMounted(() => {

    onRefresh();




})


</script>

<script lang="ts">
export default {
    name: "",
    title: "外发商数据"
}
</script>

<style scoped lang="scss">
.ba-data-table :deep(.el-button + .el-button) {
    margin-left: 6px;
}

.ba-data-table :deep(.table-header-cell) .cell {
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

}

.ba-data-table :deep(.el-table__row.urgent) .cell {
    color: red;

}


.el-col {
    height: 100%;
}

.col-table-wrap {

    display: flex;
    flex-direction: column;
    height: 100%;

    .title {
        font-size: 16px;
        text-align: center;
        margin-bottom: 10px;
        display: none;
    }

    .table-wrap {
        flex: 1;
        overflow: hidden;
    }


    .el-table {
        height: 100% !important;
    }
}

.no-md {

    display: flex;
    flex-direction: column;

    .el-row {
        flex: 1;
        // overflow: auto;

        overflow: hidden;


        .el-col {
            margin-bottom: 20px;
        }

    }

    // &.el-row{
    //     flex-direction: column;
    //     flex-wrap:nowrap;
    //     overflow: auto;
    // }


    // .el-col{
    //     margin-bottom: 20px;
    // }



    .title {
        text-align: left;
    }

}
</style>

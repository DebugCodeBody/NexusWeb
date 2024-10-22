<template>


    <div class="locat-select">
        <el-select v-model="Locat.select" @change="setSelectLocal">
            <el-option v-for="item in Locat.arr" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button @click="setSelectLocal('')">清除</el-button>
    </div>

    <el-table class="ba-data-table " 
        header-cell-class-name="table-header-cell" 
        :default-expand-all="table.expandAll"
        :data="tableData" 
        :row-key="table.pk" 
        :border="true" 
        :stripe="true">
        <template v-for="(item, index) in table.column" :key="index">
            <Column v-if="item.show !== false" :attr="item" :fixed="item.fixed">
                <template v-if="item.render" #default="scope">
                    <FieldRender :field="item" :key="fieldRenderKey(item, scope, index)" :row="scope.row"
                        :property="scope.column.property" />
                </template>
            </Column>
        </template>
    </el-table>
</template>

<script setup lang="ts">
import Column from '@/components/table/column/index.vue'
import FieldRender from '@/components/table/fieldRender/index.vue'
import { Locat, setSelectLocal  }  from "@/store/data"





const Props = defineProps<{
    tableData: any
}>();



function fieldRenderKey(item: any, scope: any, index: number) {
    return item.render == 'switch' ? 'column-' + scope.column.property + '-' + index + '-' + scope.row[scope.column.property] : 0
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

    "column": [
        {
            "label": "订单",
            "prop": "orderid",
            "align": "center",
            "operator": false,
            "width": 82,
        },
        {
            "label": "材料",
            "prop": "mat_name",
            "align": "center",
        },
        {
            "label": "规格数量",
            "prop": "bspec",
            "align": "center",
        },
        {
            "label": "数量",
            "prop": "bcount",
            "width": 58,
            "align": "center"
        },
        {
            "label": "卸货地点",
            "prop": "cutstorename",
            "width": 58,
            "align": "center",
            "render": "tag",
            custom: {
                "尾1": "success",
                "尾2": "warning",
                "质佳": "danger",
                "精创": ""
                
            }
        }
    ]
}










</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.el-table .cell{
    padding: 0 8px
}
.locat-select{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;

    .el-button{
        margin-left: 10px;
    }
}

</style>

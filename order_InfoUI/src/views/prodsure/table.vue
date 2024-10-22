<template>

    <el-row class="table-com-search">
        <el-col :span="12">
            <div class="com-search-col">
                <el-input v-model="search" size="small" placeholder="文件搜索" clearable />
            </div>
        </el-col>
        <el-col :span="12">
            <el-radio-group v-model="selectSuffix" style="margin-left: 10px;" :max="1">
                <el-radio-button v-for="city in suffix" :key="city" :label="city">
                    {{ city }}
                </el-radio-button>
                <el-radio-button label="" v-if="selectSuffix">取消</el-radio-button>
            </el-radio-group>
            <el-button type="primary" @click="onTableSearch(search)" v-if="false">搜索</el-button>
        </el-col>
    </el-row>

    <el-table :data="tableData" :border="true" :maxHeight="height" :rowClassName="onRowClassName">
        <el-table-column prop="filename" label="文件" width="500">
            <template #default="scope">
                <div style="display:flex; justify-content:space-between">
                    <a :href="tableData[scope.$index].fileurl">{{ tableData[scope.$index].filename }}</a>
                    <a :href="`${tableData[scope.$index].fileurl}-`">
                        <el-icon style="font-size: 18px;">
                            <Download />
                        </el-icon>
                    </a>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="orderid" label="订单" width="100"></el-table-column>
        <el-table-column prop="samedoc" label="关联">
            <template #default="scope">
                <div class="samedoc-cell">
                    <a :href="getOrderUrl(samedoc)"
                        v-for="(samedoc, index) in getSamedoc(tableData[scope.$index].samedoc)" :key="index"
                        @click.prevent="onCellOrderid(samedoc)">{{ samedoc }}</a>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { getOrderUrl } from "@/utils/order"

import { orderStore } from "@/store/order"



const Props = defineProps<{
    data: any,
    height: number,
    order: string
}>();


let search = $ref("");
let tableData = $ref<any>([]);
let selectSuffix = $ref("");

/** 后缀名 */
let suffix = $computed(() => {
    const retVal = Array.from(new Set(Props.data.map((elem: any) => {
        const split = elem.filename.split(".");

        return split[split.length - 1].toLocaleLowerCase()
    })));
    return retVal
})




function onCellOrderid(orderid: string) {
    const store = orderStore();

    store.addOrder(orderid);
    store.toOrder(orderid);
}


function getSamedoc(val: any) {
    if (!val) {
        return []
    } else if (typeof val == "string") {
        return val.split(',');
    } else {
        return val
    }

}



watchDebounced($$(search),
    () => {
        onTableSearch(search);
        if (search == "") {
            selectSuffix = ""
        }
    },
    { debounce: 500 }
)
watch($$(selectSuffix), (val) => {
    search = val;
})


function onTableSearch(val: string) {
    if (!val) {
        return tableData = Props.data;
    }


    const regVal = new RegExp(val, "i");
    tableData = Props.data.filter((elem: any) => {
        return regVal.test(elem.filename);
    })


}

function onRowClassName({ row, rowIndex }: any) {
    if (row.orderid == Props.order) {
        return "is-conform"
    } else if (Array.isArray(row.samedoc) && row.samedoc.length > 0) {
        return "is-samedoc"
    }

}

onMounted(() => {
    onTableSearch("");
})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.table-com-search {
    height: 30px;
    margin: 10px 0 !important;

    .com-search-col {
        display: flex;
        align-items: center;
        height: 100%;

        .label {
            margin-right: 10px;
        }

        .el-input {
            flex: 1;
            height: 100%;
        }
    }

}



.is-conform {
    td:nth-child(2) {
        background-color: red;
        color: white;
        font-weight: bold;
    }


    &:hover td:nth-child(2) {
        background-color: white;
        color: red;

    }
}

.is-samedoc {
    a {
        color: rgb(255, 60, 255);
    }
}


.samedoc-cell {
    a {
        margin-right: 10px;
    }
}
</style>

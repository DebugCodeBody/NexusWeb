<template>
    <div class="view">
        <el-row :gutter="10">
            <el-col :span="4" class="left">
                <mach-view :data="orderList" @add="onAddOrder" />
            </el-col>
            <el-col :span="20" class="right">
                <div class="machine-view">
                    <div style="height: calc(100% - 36px);">
                        <el-row :gutter="10" :style="{transform: `translateX(-${(nowPage-1) * 100}%)`}">
                            <el-col :span="4" class="left" v-for="item in machine" :key="item.id">
                                <mach-view :data="item" @move="onMoverOrde" />
                            </el-col>
                        </el-row>
                    </div>
                    <div class="toolbar">
                        <el-radio-group v-model="dept.select">
                            <el-radio v-for="item in dept.data" :label="item.deptid" :key="item.deptid">
                                {{item.deptname}}
                            </el-radio>
                        </el-radio-group>
                        <el-pagination v-model="nowPage" background layout="pager" :total="machine.length" :pageSize="6"
                            @current-change="onCurrentChange" />
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import machView from "./mach.vue"
import { addOrder } from "@/api"

const dept = inject<provideDept>("dept")!;
const machine = inject<Machs>("machine")!;
const order = inject<Orders>("order")!;


let nowPage = $ref(1);
let orderList: Mach = {
    id: 0,
    name: "订单列表",
    data: order
}

async function onAddOrder(mcid: number, moid: number) {
    addOrder(mcid, moid);
}

function onMoverOrde() {

}


function onCurrentChange(value: number) {
    nowPage = value;
}

onMounted(() => {



})

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" scoped >
.view>.el-row {
    height: 100%;
    margin: 0  !important;

    .el-col{
        height: 100%;
    }

    .left {
        padding: 10px;
        padding-bottom: 0;
        box-sizing: border-box;

    }

    .right {}



    .machine-view {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .el-row {
            flex-wrap: nowrap;
            height: 100%;
            padding-bottom: 10px;
        }

        .el-pagination {
            padding-left: 0;
        }

        .toolbar {
            display: flex;
            background-color: white;
            padding-left: 10px;

            .el-pagination {
                margin-left: 10px;
            }
        }
    }
}
</style>

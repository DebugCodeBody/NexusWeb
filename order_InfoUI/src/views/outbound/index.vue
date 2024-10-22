<template>
    <el-row :gutter="10" class="outbound">
        <div class="order-info">
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>订单</span>
                        </div>
                    </template>
                    <el-form ref="formRef" label-width="auto">
                        <el-form-item label="销售单号">
                            <remind text="重点跟进" v-model="process.allow_reorder">
                                <el-input v-model="process.forder_name"></el-input>
                            </remind>
                        </el-form-item>
                        <el-form-item label="客户名字">
                            <el-input v-model="process.partner_name"></el-input>
                        </el-form-item>

                        <!-- <el-form-item label="尾款金额">
                            <remind text="自动报价" v-model="process.fcall_cs">
                                <el-input v-model="process.fbalance"></el-input>
                            </remind>
                        </el-form-item>
                        <el-form-item label="加急费用">
                            <el-input v-model="process.furgent_cost"></el-input>
                        </el-form-item> -->

                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>物料</span>
                        </div>
                    </template>
                    <el-form ref="formRef" label-width="auto">
                        <el-form-item label="名称">
                            <el-input v-model="process.name_template"></el-input>
                        </el-form-item>
                        <el-form-item label="数量">
                            <el-input v-model="process.product_qty"></el-input>
                        </el-form-item>
                        <el-form-item label="材质">
                            <el-input v-model="process.fmaterial_man"></el-input>
                        </el-form-item>
                        <el-form-item label="规格">
                            <el-input v-model="process.flength_man"></el-input>
                        </el-form-item>
                        <el-form-item label="备料位置">
                            <el-input v-model="process.dstname"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>出货</span>
                        </div>
                    </template>
                    <el-form ref="formRef" label-width="auto">
                        <el-form-item label="出货日期">
                            <remind text="客户催货" v-model="process.ffollow">
                                <el-input v-model="process.fdelivery_date_line"></el-input>
                            </remind>
                        </el-form-item>
                        <el-form-item label="计划延期">
                            <el-input v-model="process.fplan_delay_date"></el-input>
                        </el-form-item>
                        <el-form-item label="延期次数">
                            <el-input v-model="process.fcard_id"></el-input>
                        </el-form-item>
                        <el-form-item label="生厂完工">
                            <remind text="交期不可推" v-model="process.fundelayed">
                                <el-input v-model="process.fdeliver_date"></el-input>
                            </remind>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="12" class="note">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>备注</span>
                        </div>
                    </template>
                    <el-input v-model="process.fshipping_date" type="textarea"></el-input>
                </el-card>
            </el-col>
        </div>
        <div class="file-table">
            <samedoc-table :data="defaultTableData" :height="tabHieght" :order="order" />
        </div>

    </el-row>
</template>

<script setup lang="ts">
import remind from "@/views/outbound/remind.vue"
import samedocTable from "@/views/prodsure/table.vue"
import { getProdsure, getOrdGetAtta } from "@/api"


const process = $ref(inject<workInfo>("info")!);
const order = inject<string>("order")!;

let tabHieght = $ref(0);
let defaultTableData = $ref<any>([]);
let tableData = $ref<any>([]);

getOrdGetAtta(order).then((data: any) => {
    defaultTableData.push(...data);
    tableData.push(...data);
});

onMounted(() => {
    tabHieght = document.querySelector(".outbound .file-table")!.clientHeight - 80;
});



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" >
.el-col .outbound {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    height: 100%;

    .order-info {
        display: flex;
        flex-wrap: wrap;

        .el-col:nth-child(n+3):nth-child(-n+4) {
            margin-top: 10px;
        }
    }

    .el-card {
        height: 100%;
    }

    &>.el-col {
        margin-bottom: 10px;
    }

    .shipment {
        &>.el-form-item__label-wrap {
            margin-left: 0 !important;
        }

        &>.el-form-item__content>.el-form-item:first-child {
            margin-right: 20px;
        }
    }

    /** 留言 */
    .note {
        .el-card {
            display: flex;
            flex-direction: column;
        }

        .el-card__body {
            box-sizing: border-box;
        }

        textarea,
        .el-textarea,
        .el-card__body {
            height: 100%;
        }
    }

    .file-table {
        flex: 1;
        padding-top: 10px;
    }
}
</style>

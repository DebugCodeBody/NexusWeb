<template>
    <div class="item">
        <el-form label-width="auto">
            <el-form-item label="材料">
                <div>
                    <span>{{ data.material }}</span>
                </div>
            </el-form-item>
            <el-form-item label="规格">
                <div>
                    <span>{{ data.matspec }}</span>
                    <span class="qty">{{ data.qty }}</span>
                </div>
            </el-form-item>
            <el-form-item label="订单">
                <div>
                    <span>{{ data.moid }}</span>
                    <span class="qty">
                        <time-span :time="data.workhour" />
                    </span>
                </div>
            </el-form-item>
            <el-form-item label="时间">
                <span :class="status" class="time-state">{{text}}</span>
            </el-form-item>

            <!-- <el-form-item label="部门">
                <div>
                    <span>{{ data.woname }}</span>
                </div>
            </el-form-item>
            <el-form-item label="开始">
                <div>
                    <span>{{ data.plan_start }}</span>
                </div>
            </el-form-item>
            <el-form-item label="结束">
                <div>
                    <span>{{ data.plan_done }}</span>
                </div>
            </el-form-item> -->

        </el-form>
        <el-button type="primary" :icon="Memo" v-if="menu" />
    </div>
</template>

<script setup lang="ts">
import { Memo } from '@element-plus/icons-vue'
import TimeSpan from "./time.vue"

import moment from "moment"

window.moment = moment;
const Props = defineProps<{
    data: Order,
    menu: boolean
}>()

const textTable: Record<number, string[]> = {
    [1]: ["昨天截止", "明天截止"],
    [2]: ["前天截止", "后天截止"]
}

const nowTime = moment(moment().format('YYYY-MM-DD'))
const stop = moment(Props.data.plan_done);

const diffDay = nowTime.diff(stop, "days");

let text = "";
let status = "";

if (diffDay == 0) {
    text = "今天截止";
    status = "warning"
} else {
    let attribution = textTable[Math.abs(diffDay)];
    if (attribution) {
        if (diffDay > 0) {
            status = "error";
            text = attribution[0];
        } else if (diffDay < 0) {
            status = "info";
            text = attribution[1];
        }
    } else {
        status = "error";
        text = `${stop.format('MM-DD')} 截止`
    }
}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" scoped>
.item {
    
    position: relative;

    padding: 10px;
    box-sizing: border-box;
    background-color: white;
    border-radius: 5px;
    font-size: 14px;


    span.qty {
        margin-left: 10px;
    }


    .el-form-item {
        margin-bottom: 0;
    }



    ::v-deep .el-form-item__label,
    ::v-deep .el-form-item__content {
        height: 24px;
        line-height: 24px;
    }

    button {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    .time-state {
        color: white;
        padding: 0 5px;
        border-radius: 5px;
        font-size: 12px;
        line-height: 18px;

        &.info {
            background-color: #1b9aee;
        }

        &.warning {
            background-color: #fa8c15;
        }

        &.error {
            background-color: red;
        }
    }


}
</style>

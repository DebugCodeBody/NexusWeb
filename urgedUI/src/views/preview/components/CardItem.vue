<template>
    <div class="item">
        <div class="head" v-if="false">
            <el-button size="small">转移</el-button>
            <el-button size="small">结案</el-button>
        </div>
        <div class="foote">
            <div class="left">
                <el-form label-width="85px" class="demo-ruleForm">
                    <el-form-item label="工单号：">
                        <a :href="getSrc(data.orderid)" target="_blank">{{ data.orderid }}</a>
                        <span class="time">{{ parseTime(data.createdate) }}</span>
                    </el-form-item>
                    <el-form-item label="负责员：" v-if="Attrs.type == 'demand'">
                        <span class="incharge">{{ Princi.incharge.join(",") }}</span>
                        <span class="branch">{{ Princi.deptname }}</span>
                    </el-form-item>
                    <el-form-item label="催单员：" v-else>
                        <span class="incharge">{{ data.createuser }}</span>
                    </el-form-item>
                    <el-form-item label="详细描述：" class="detailed">
                        <span>{{ data.memo }}</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="right">
                <el-button @click="onClick">处理</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, useAttrs } from "vue"

import { popUpIng } from "../store/popup"
import { selectItem, selectType } from "../store/data"
import { branch, branchMap } from "@/store/branch"
import moment from "moment"


const Attrs = useAttrs() as {
    type: perType
};
const Props = defineProps<{
    data: task
}>();

function onClick() {
    popUpIng.value = true;
    selectItem.value = Props.data;
    selectType.value = Attrs.type;
}

function parseTime(str: string) {
    return moment(str).format("MM-DD HH:mm")
}
function getSrc(orderid:string){
    return `?path=order&order=${orderid}`
}


const Princi = branchMap[Props.data.deptname]

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" scoped>
.item {


    font-size: 14px;
    border-radius: 5px;
    border: 1px solid rgb(220, 223, 230);
    margin-bottom: 10px;

    display: flex;
    flex-direction: column;

    .head {
        height: 35px;
        display: flex;

        justify-content: end;
        align-items: center;
        padding-right: 10px;

        box-sizing: border-box;
        background-color: rgb(230, 230, 230);
    }

    .foote {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }

    .left {
        display: flex;

        .other {
            margin-left: 10px;
        }

        .time,
        .branch {
            margin-left: 10px;
        }

    }

    .right {
        margin-left: 10px;

        button {
            height: 100%;

        }
    }

}

:deep(.el-form-item) {
    margin: 0;

    &.detailed {
        margin-top: 5px;

        .el-form-item__content,
        .el-form-item__label {
            line-height: 20px;
        }

        .el-form-item__label {
            height: 20px;
        }

    }

    .el-form-item__content,
    .el-form-item__label {
        line-height: 30px;
        padding-right: 5px;
    }

    .el-form-item__label {
        height: 30px;
    }

}
</style>

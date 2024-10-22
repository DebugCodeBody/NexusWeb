<template>
    <el-card class="box-card" :class="{hide}" >

        <template #header>
            <div class="card-header" @click="onClickCardHeader">
                <span class="name">{{ data.name || "" }}<span class="num">({{ data.value.length }})</span></span>
                <el-button type="danger" size='small' @click.capture.stop="onClickAllExtract"
                    v-if="extract">全部提货</el-button>
                <el-button type="danger" size='small' @click.capture.stop="onClickAllExtract" v-else
                    plain>全部撤销</el-button>
            </div>
        </template>

        <el-card class="box-item-card" v-for="itemChild in data.value" :key="itemChild.orderid">
            <el-form size='default'>
                <el-form-item class="oirder-item">
                    <el-form-item class="order">
                        <span>{{ itemChild.orderid }}</span>
                    </el-form-item>
                    <el-form-item>
                        <span>{{ itemChild.mat_name }}</span>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-form-item label="规格：">
                        <span>{{ itemChild.bspec }}</span>
                    </el-form-item>
                    <el-form-item label="数量：">
                        <span>{{ itemChild.bcount }}</span>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-form-item label="交期：">
                        <el-tag type="warning" v-if="!gtNowDate(itemChild.delivery)">{{ getFormatTime(itemChild.delivery) }}</el-tag>
                        <el-tag type="success" v-else>{{  getFormatTime(itemChild.delivery) }}</el-tag>
                    </el-form-item>
                    <el-form-item label="取货：">
                        <el-tag v-if="itemChild.btaketime">{{ getFormatTime(itemChild.btaketime) }}</el-tag>
                        <el-tag type="danger" v-else>未取货</el-tag>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="备注：" v-if="itemChild.bremark">
                    <span>{{ itemChild.bremark }}</span>
                </el-form-item>
                <div class="operation">
                    <el-button type="primary" @click="onClickExtract(itemChild)" v-if="extract">提货</el-button>
                    <el-button type="warning" @click="onClickExtract(itemChild)" v-else>撤销</el-button>
                </div>

            </el-form>
        </el-card>

    </el-card>

</template>

<script setup lang="ts">
import dayjs from "dayjs"
import { gtNowDate } from "@/utils/other"



const Emits = defineEmits<{
    (e: 'clickItem', value: any, all: boolean): void;
}>();

const Props = defineProps<{
    data: any,
    extract: boolean
}>();


let hide = $ref(true);




function onClickCardHeader() {
    hide = !hide;
}


function onClickExtract(item: any) {
    Emits("clickItem", item, false);
}
function onClickAllExtract() {
    Emits("clickItem", Props.data.value, true);
}

function getFormatTime(str: string) {
    return dayjs(str).format("MM-DD")
}



console.log(Props.data)


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.oirder-item {
    padding: 0 10px !important;

    .order {
        width: 100px !important;
    }
}
</style>

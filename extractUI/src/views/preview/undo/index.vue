<template>
    <div>

        <list-card v-for="(item, index) in data" :key="index" :data="item">
            <template #top-button>
                <el-button type="danger" size='small' @click.capture.stop="onClickAllExtract(item)" plain>全部撤销</el-button>
            </template>

            <template #default="{ data: itemChild }">
                <el-form size='default'>
                    <el-form-item class="oirder-item">
                        <el-form-item class="order" v-if="itemChild.orderid">
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
                            <el-tag type="warning" v-if="!gtNowDate(itemChild.delivery)">{{
                                getFormatTime(itemChild.delivery)
                            }}</el-tag>
                            <el-tag type="success" v-else>{{ getFormatTime(itemChild.delivery) }}</el-tag>
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
                        <el-button type="warning" @click="onClickExtract(itemChild)">撤销</el-button>
                    </div>
                </el-form>
            </template>

        </list-card>

    </div>
</template>

<script setup lang="ts">

import listCard from "../listCard.vue"
import { gtNowDate } from "@/utils/other"
import dayjs from "dayjs"




const Emits = defineEmits<{
    (e: 'clickItem', value: any, all: boolean): void;
}>();




const Props = defineProps<{
    data: any,
}>();



function onClickExtract(item: any) {
    Emits("clickItem", item, false);
}
function onClickAllExtract(item: any) {
    Emits("clickItem", item.value, true);
}


function getFormatTime(str: string) {
    return dayjs(str).format("MM-DD")
}

onMounted(() =>{ 


})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

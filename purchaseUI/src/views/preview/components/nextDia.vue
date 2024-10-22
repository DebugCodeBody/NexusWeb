<template>
    <el-dialog @closed="closed" v-model="dialogShow" custom-class="next-dia">
        <el-card>
            <div class="process">
                <work-steps></work-steps>
            </div>
        </el-card>
        <template v-if="!isDone">
            <el-card>
                <div class="process">
                    <label>操作步骤：</label>
                    <el-radio-group v-model="nextProcess">
                        <template v-for="([key, value]) in Object.entries(stepDic)" :key="key">
                            <el-radio :label="key" size="large" v-if="selectItem.stage_id != parseInt(key)">
                                {{ value.name }}</el-radio>
                        </template>
                    </el-radio-group>
                </div>
            </el-card>
            <el-card v-if="showInvoice">
                <div class="process">
                    <label>开票方式：</label>
                    <el-radio-group v-model="invoice">
                        <template v-for="(value, index ) in invoiceList" :key="value">
                            <el-radio :label="index + 1" size="large">{{ value }}</el-radio>
                        </template>
                    </el-radio-group>
                    <div class="invoice" v-if="invoiceErr">请选择开票方式</div>
                </div>
            </el-card>
            <el-card>
                <div class="process describe">
                    <label>详细描述：</label>
                    <el-input v-model="describe" type="textarea" ref="textarea"></el-input>
                </div>
            </el-card>

        </template>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeShow" v-if="!isDone">取消</el-button>
                <el-popover v-model:visible="visible" :disabled="disabled" placement="top" :width="160" trigger="click">
                    <p>请先选择操作步骤！</p>
                    <template #reference>
                        <el-button type="primary" @click="onConfirm">确定</el-button>
                    </template>
                </el-popover>
            </span>
        </template>

    </el-dialog>
</template>

<script setup lang="ts">
import workSteps from "./workSteps.vue"


import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElMessage } from 'element-plus'


import { getStep, nextProcess, invoice, stepDic } from "../store/step"
import { selectItem, allItem } from "../store/data"

// import { doneProblem, moveBranch, problemMessage } from "@/api"

import { moveStep, messageStep } from "@/api"

const Emits = defineEmits(["close"]);

const visible = ref(false);
const disabled = ref(true);
const invoiceList = ref(["普票", "增票", "未税"])


const invoiceErr = ref(false);
const dialogShow = ref(true);
const describe = ref(String.Empty);
const isDone = computed(() => {
    return selectItem.value.stage_id == 3
})
const showInvoice = computed(() => {
    return nextProcess.value == '3';

})


function closed() {
    Emits("close");
}

function closeShow() {
    dialogShow.value = false;
}


async function onConfirm() {
    if (isDone.value) {
        return closeShow();
    }
    if (showInvoice.value && !invoice.value) {
        invoiceErr.value = true;
        return;
    }


    const { value } = nextProcess;
    if (value == String.Empty) {
        disabled.value = false;
        return;
    } else {
        disabled.value = true;
    }
    try {
        const { value: item } = selectItem;

        let result: any;
        if (value == "2" || value == "3") {
            result = await move(item);
        } else if (value == "99") {
            result = await message(item)
            closeShow();
            return;
        }

        const { stage_id } = selectItem.value;


        const index = allItem[stage_id].findIndex((elem) => elem == item);
        if (index > -1) {
            allItem[stage_id].splice(index, 1);
            allItem[nextProcess.value].push(selectItem.value)

            selectItem.value.stage_id = nextProcess.value;

            result.memo = describe.value;

            getStep(selectItem.value).then((data) => {
                data.push(result);
            })
        }

        closeShow();

    } catch (error: any) {
        ElMessage.error(error.msg || error.message || "未知错误，请联系管理员");
    }

}

async function move(item: good) {
    return await moveStep(item.id, nextProcess.value, describe.value, invoice.value);
}


async function message(itme: good) {
    const result = await messageStep(itme.id, describe.value);

    result.memo = describe.value;

    getStep(itme).then((data) => {
        data.push(result);
    })

}

watch(invoice, () => {
    invoiceErr.value = false;
})


onUnmounted(() => {
    nextProcess.value = String.Empty;
    invoice.value = String.Empty;
})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.next-dia {

    .el-card {
        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0px;
        }

        .el-card__body {
            padding: 10px;
        }
    }


    .process {
        display: flex;
        align-items: center;

        &>label {
            margin-right: 10px;
        }

        &.describe {
            align-items: flex-start;

            .el-textarea {
                flex: 1;
            }

            textarea {
                height: 100px;
                resize: none;
            }



        }



    }

    .move-branch {
        position: relative;
        height: 60%;

        .branch-dialog {
            position: absolute;

        }

    }

    .invoice {
        margin-left: 10px;
        color: red;
        ;
    }

}
</style>

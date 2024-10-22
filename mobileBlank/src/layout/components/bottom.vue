<template>
    <div class="button-wrap independent">
        <div class="order-button el-button" :class="{ 'is-disabled': disabled }">
            <orderDetailed v-if="nextOrder" v-model="nextOrder" @click="onAdd" />
            <div v-else class="no-order">暂无新订单</div>
        </div>
        <div class="order-other">
            <div class="other-item jiugong">

                <el-button @click="latexShow = !latexShow">
                    <div>
                        <div class="num">{{ length }}</div>
                        <div class="name">
                            <el-tag size="large">{{ name }}</el-tag>
                        </div>
                    </div>
                </el-button>
            </div>
            <div class="other-item tail-item">
                <el-button @click.stop="ondialogTail" :disabled="!nextOrder">补料</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import orderDetailed from "./orderDetailed.vue"

import { ElButton } from 'element-plus'

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElTag } from 'element-plus'

import userData from "@/layout/hooks/userData"
import userTail from "@/layout/hooks/userTail"
import { latexShow } from "@/layout/hooks/userlatex"
import type { order, machineInfo, machineList } from "@/layout/module";


const { dialogTail } = userTail();
const { nextOrder, selectValue, listMachine, onAddOrder, ISMOBILE } = userData();

const props = defineProps<{
    match?: machineInfo
}>();


const length = computed(() => {
    try {
        return listMachine[selectValue.value].order.length;
    } catch {
        return 0;
    }
})

const name = computed(() => {
    try {
        return listMachine[selectValue.value].name;
    } catch {
        return String.Empty;
    }
})

const disabled = computed(() => {

    if (props.match) {
        return props.match.mid == 999
    } else {

        try {

            return listMachine[selectValue.value].mid === 999;
        } catch {
            return true;
        }

    }

})

function ondialogTail(){
    dialogTail.value = !dialogTail.value;
}

function onAdd() {
    if (props.match) {
        onAddOrder(props.match)
    } else {
        onAddOrder(listMachine[selectValue.value]);
    }

}

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.button-wrap .num {
    padding-top: 5px;
    margin-bottom: 10px;

    .el-button.is-disabled,
    .el-button.is-disabled:focus,
    .el-button.is-disabled:hover {
        color: var(--el-button-disabled-text-color) !important;
        cursor: not-allowed;
        background-image: none;
        background-color: var(--el-button-disabled-bg-color);
        border-color: var(--el-button-disabled-border-color);
    }
}
</style>

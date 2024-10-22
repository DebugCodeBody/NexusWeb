<template>
    <div class="machine" ref="machine" :class="{ supplement: supplement }">

        <div class="machine-content">
            <div class="title-wrap">
                <topFunction />
                <div class="name">{{ data.name }}</div>
            </div>

            <div class="item-content">
                <template v-if="data.order.length > 0">
                    <div class="item" v-for="(order, index) in data.order" :key="index" :class="{ isdone: index == 0 }">
                        <div class="detailed">
                            <div>订单：{{ order.no }} <span style="color:red; margin-left: 5px;"
                                    v-if="order.fullmatch">完全匹配</span>
                            </div>
                            <div class="cancel" @click="clickDeleOrder(data, index)" v-if="autoButton && !supplement">
                                <button>X</button>
                            </div>
                        </div>
                        <template v-if="false">
                            <div class="detailed">
                                <div>尾料：{{ order.stname }}</div>
                            </div>
                            <div class="detailed">
                                <div>客户：{{ order.custname }}</div>
                            </div>
                        </template>
                    </div>
                </template>

                <el-empty description="暂无订单" v-else />
            </div>

            <bottom v-if="!ISMOBILE" :match="data" />

        </div>

    </div>
</template>

<script setup lang="ts">
import bottom from "./bottom.vue"
import topFunction from "./topFunction.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, computed, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import type { order, machineInfo, machineList } from "@/layout/module";

import { ElSelect, ElOption, ElIcon, ElEmpty } from 'element-plus'
import { RefreshLeft, Timer, Sort } from '@element-plus/icons-vue'

import hammerjs from "hammerjs";

import { ISMOBILE, updateIndex } from "@/layout/hooks/userData"

const props = defineProps<{
    data: machineInfo,
    autoButton: boolean,
    clickDeleOrder: any,
}>();



const el = useCurrentElement();

onMounted(() => {
    const hammerEl = new hammerjs(el.value as HTMLElement);
    hammerEl.on("swipeleft swiperight", updateIndex);
})

const supplement = computed(() => {
    return props.data.mid === 999 && !(process.env.NODE_ENV != "production")
})


</script>

<script lang="ts">
export default {
    name: "machine"
}
</script>

<style lang="scss">
.main-wrap .machine.supplement {
    padding-bottom: 20px !important;
}

div.supplement {
    button {
        padding: 0;

        i {
            transform: rotate(90deg);
        }
    }

}
</style>

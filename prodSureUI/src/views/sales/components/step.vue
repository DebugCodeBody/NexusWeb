<template>
    <el-card class="box-card" id="setp-box">
        <el-scrollbar class="content" ref="scrollbar" :height="scrollHeight">
            <el-steps direction="vertical" style="height: 450px;" :align-center="true">
                <el-step v-for="(item, index) in setp.process" :key="index" :icon="table[item.stage].icon"
                    :title="title(item, index)">
                    <template #description>
                        <div class="description">
                            <span>操作人员：</span><span>{{ item.username }}</span>
                        </div>
                        <div class="description">
                            <span>操作时间：</span><span>{{ item.createdate }}</span>
                        </div>
                        <div class="description" v-if="!!item.memo">
                            <span>详细描述：</span><span class="memo">{{ item.memo }}</span>
                        </div>
                    </template>
                </el-step>
                <el-step v-if="!!nextSetp" :icon="nextSetp.icon" :title="title(nextSetp, 1)"></el-step>
            </el-steps>
        </el-scrollbar>
    </el-card>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { paskSetp, paskSetps } from "@/module/paskStep"
import { setp, table, nextSetp, nextMemo, seleItem } from "../hooks/data"
import paskStateEnum from "@/enums/paskStateEnum"

const Props = defineProps<{
    height?: number
}>()

const el = useCurrentElement();
const scrollbar = ref();
const scrollHeight = ref(Props.height || 450);

function title(item: paskSetp, index: number) {
    if (index == 0) {
        return "发起工单"
    }

    return table[item.stage].button
    
    // if (item.stage == paskStateEnum.PREPA) {
    //     if (seleItem.value.outsvr) {
    //         return "转外发"
    //     } else {
    //         return "转车间"
    //     }
    // } else {
    //     return table[item.stage].button
    // }

    
}

watch(setp, () => {
    scrollbar.value.update();

    nextTick(() => {

        const title = document.querySelector<HTMLElement>(".el-step__main .el-step__title ")!.clientHeight
        const description = document.querySelector<HTMLElement>(".el-step__main .el-step__description ")!.clientHeight

        const height = title + description;
        const length = document.querySelectorAll(".el-step.is-vertical").length;

        if (length > 1) {
            document.querySelector<HTMLElement>(".el-steps.el-steps--vertical")!.style.height = `${length * height}px`
        }

    })

})




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" >
#setp-box {

    .el-step.is-vertical {
        .el-step__main {
            * {
                color: black !important;
            }

        }

        .description:last-child {
            margin-bottom: 10px;
        }
    }

}

.steps-popover {
    width: 500px !important;

    .description {
        display: flex;



        span+span {
            flex: 1;
        }
    }


}
</style>

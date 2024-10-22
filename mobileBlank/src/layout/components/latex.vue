<template>
    <div class="latex" @click="latexShow = false">
        <div class="latex-contnet">
            <div class="latex-item" v-for="(item, index) in listMachine" :key="item.mid" ref="item"
                @click.stop="onItemClick(index)">
                <div class="num">{{ item.order.length }}</div>
                <div class="name">
                    <el-tag size="large" :type="type(index)">{{ item.name }}</el-tag>
                </div>
            </div>
            <div class="latex-item account" v-for="index in rem" :key="index">
                <div class="num"></div>
                <div class="name"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElTag } from 'element-plus'

import type { order, machineInfo, machineList } from "@/layout/module";



import userData from "@/layout/hooks/userData"

import { latexShow } from "@/layout/hooks/userlatex"

const { nextOrder, selectValue, listMachine, onAddOrder, ISMOBILE } = userData();

const el = useCurrentElement();

const rem = ref(0);

const prop = defineProps<{
    modelValue: machineList
}>();

onMounted(() => {

    nextTick(() => {
        const item = document.querySelector(".latex .latex-contnet .latex-item")
        if (!item) { return }

        const { offsetWidth } = el.value as HTMLElement;

        const com = Math.trunc(offsetWidth / (item as HTMLElement).offsetWidth);

        rem.value = com - listMachine.length % com;

    })




})

function type(index: number) {
    return index == selectValue.value ? "danger" : "";
}


function onItemClick(index: number) {
    selectValue.value = index;

    latexShow.value = false;

}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.latex {
    height: 100%;
    width: 100%;

    position: absolute;
    top: 0;

    background-color: white;

    .latex-contnet {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;

        justify-content: space-around;

        overflow: auto;

    }

}

.latex-item {
    margin: 10px 5px;

    padding: 5px;

    box-sizing: border-box;

    min-width: 95px;


    text-align: center;
    border-radius: 10px;
    box-shadow: var(--el-box-shadow-light);

    display: inline-block;

    &.account {
        opacity: 0;
    }

    .num {
        padding-top: 5px;
        margin-bottom: 10px;


    }

    .name {
        span {
            width: 100%;

        }
    }



}
</style>

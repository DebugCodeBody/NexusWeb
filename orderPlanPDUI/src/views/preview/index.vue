<template>
    <div id="preview">
        <div class="preview-top" v-if="false"></div>
        <div class="preview-bottom">
            <bottom-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import bottomView from "./bottom/index.vue"
import to from "await-to-js"
import { ElLoading } from 'element-plus'

import { getAllDep, getMachine, getOrder } from "@/api"
import { parseOrder, parseTime } from "@/utils/other"



const dept = $ref<provideDept>({
    select: 0,
    data: [],
});


const machine = $ref<Machs>([]);
const order = $ref<Orders>([]);
let loading: any = undefined;


function startLoading() {
    loading = ElLoading.service({
        lock: true,
        text: '正在操作',
        background: 'rgba(0, 0, 0, 0.7)'
    });
}

watch(() => {
    return dept.select
}, async (value) => {

    if (!loading) {
        startLoading();
    }
    const [err, result] = await to(Promise.all([getOrder(value), getMachine(value)]))
    if (err) {
        return;
    }

    result[0].forEach((elem) => {
        elem.workhour = parseTime(elem.workhour as any);
    })
    result[1].forEach((mach) => {
        parseOrder([mach.data]);
    })


    order.splice(0, order.length, ...result[0])
    machine.splice(0, machine.length, ...result[1])

    nextTick(() => {
        loading.close();
        loading = undefined;
    })

})



async function init() {


    startLoading();
    {
        const [err, result] = await to(getAllDep())

        if (err) {
            return;
        }

        dept.data.push(...result);
    }
    const { deptid } = dept.data[0];
    dept.select = deptid;

}

provide("dept", dept);
provide("machine", machine);
provide("order", order);

init();




</script>

<script lang="ts">
export default {
    name: "",
    title: "采购看板"
}
</script>

<style lang="scss">
#preview {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;


    .preview-top,
    .preview-bottom {
        .view {
            height: 100%;
        }
    }

    .preview-top {
        height: 80px;

        background-color: yellow;
        flex-shrink: 0;
    }

    .preview-bottom {
        flex: 1;
        overflow: hidden;
    }
}
</style>

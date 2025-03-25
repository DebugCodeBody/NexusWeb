<template>
    <div>
        <el-button type="primary" size="small" @click="onClickPrint">打印</el-button>
    </div>
</template>

<script setup lang="ts">

import { printPdf } from "@/api";
import to from "await-to-js";

import { loadService } from "@/utils/elementLib"


const Props = defineProps<{
    renderRow: any,
    renderField: any,
    renderValue: any
}>();

const onClickPrint = loadService(async function () {

    const { renderRow } = Props;

    const [err, reuslt] = await to(printPdf(renderRow.mo_id, renderRow.od_id))!;
    if (err) {
        return;
    }

    if (reuslt.err) {
        alert(reuslt.err)
        return;
    }


    const aEl = document.createElement("a");

    aEl.href = `./download?filename=${reuslt.filename}`;
    aEl.target = '_blank'

    aEl.click();


})



</script>


<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

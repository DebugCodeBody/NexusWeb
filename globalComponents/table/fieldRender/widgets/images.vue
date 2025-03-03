<template>
    <div class="box-render-image">
        <template v-if="Array.isArray(renderValue) && renderValue.length">
            <el-image v-for="(item, idx) in renderValue" :key="idx" :initial-index="idx" :preview-teleported="true"
                :preview-src-list="arrayFullUrl(renderValue)" class="images-item" :src="fullUrl(item)"></el-image>
        </template>
    </div>
</template>

<script setup lang="ts">

import { fullUrl, arrayFullUrl } from '../../utils/common'


const props = defineProps<{
    renderRow: TableRow
    renderField: TableColumn
    renderValue: string,
    property: any,
}>();





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

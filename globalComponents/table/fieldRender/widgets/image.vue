<template>
    <el-image :preview-teleported="true" :preview-src-list="[fullUrl(renderValue)]" :src="fullUrl(renderValue)"></el-image>
</template>

<script setup lang="ts">
import { fullUrl, arrayFullUrl } from '../../utils/common'
import { boxTableControl, provideName } from '../../utils/boxTable'




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

<style lang="scss">

</style>

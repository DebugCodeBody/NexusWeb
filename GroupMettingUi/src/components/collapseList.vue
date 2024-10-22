<template>
    <el-collapse class="collapse-list p-10px " v-model="activeNames" accordion>

        <template v-if="data.length">
            <template v-for="(item) in data" :key="item.id">
                <slot name="item" :item="item"></slot>
            </template>

        </template>
        <el-empty description="暂无数据" v-else />
    </el-collapse>
</template>

<script setup lang="ts">

const Props = defineProps<{
    data: mettItems
}>();

const activeNames = $ref("");


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.collapse-list {

    .el-collapse-item__content {
        padding-bottom: 0;
    }

}
</style>

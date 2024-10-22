<template>
    <div class="branch-content">
        <p class="name">{{ data.deptname }}</p>
        <div class="children">
            <template v-if="data.children">
                <el-button v-for="item in data.children" size="default" :key="item.idx"
                    @click="onClick(item)">{{ item.deptname
                    }}</el-button>
            </template>
            <el-button v-else size="default" @click="onClick(data)">{{ data.deptname }}</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

const Emits = defineEmits<{
    (e: 'select', value: branch): void;
}>();

const Props = defineProps<{
    data: branch
}>();

function onClick(item: branch) {
    Emits("select", item)
}


</script>

<script lang="ts">
export default {
    name: "Branch-Item"
}
</script>

<style lang="scss">
.branch-content {
    margin-top: 5px;

    .name {
        font-size: 14px;
    }

    .children {
        margin-top: 5px;
        margin-left: 10px;

        button {
            margin-left: 0;
            margin-right: 10px;
            margin-bottom: 5px;
        }
    }

    &:last-child {
        padding-bottom: 20px;
    }

}
</style>

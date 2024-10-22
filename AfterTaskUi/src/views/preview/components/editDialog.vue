<template>
    <task-dialog v-model="drag.selected" custom-class="edit-dia" @confirm="drag.submit" @cancel="drag.submit"
        title="编辑" :showCancelButton="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <el-card>
            <double-column label="标题" center class="move-view">
            </double-column>
        </el-card>
        <el-card>
            <double-column label="状态">
                <el-input v-model="drag.memo" type="textarea" />
            </double-column>
        </el-card>
        <el-card>
            <double-column label="时间">
                <el-input v-model="drag.memo" type="textarea" />
            </double-column>
        </el-card>
    </task-dialog>
</template>

<script setup lang="ts">
import taskDialog from "@/components/dialog/index.vue"
import DoubleColumn from "@/components/douCol/index.vue"


import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { dragStore } from "@/store/drag"

const drag = dragStore();

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.move-dia {
    .move-view {
        span:first-child {
            margin-right: 10px;
        }

        span:last-child {
            margin-left: 10px;
        }
    }

}
</style>

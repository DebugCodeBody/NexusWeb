<template>
    <task-dialog v-model="select.selected" custom-class="next-dia" @confirm="onConfirm" title="任务流程"
        :disabled="disabled">
        <el-card>
            <taskStep @loadDoen="taskLoad"></taskStep>
        </el-card>
        <el-card v-if="!doneItem">
            <double-column label="留言">
                <el-input v-model="message" type="textarea" />
            </double-column>
        </el-card>
    </task-dialog>
</template>

<script setup lang="ts">
import taskDialog from "@/components/dialog/index.vue"
import DoubleColumn from "@/components/douCol/index.vue"

import taskStep from "./step.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { setMessage } from "@/api"

import { selectStore } from "@/store/select"
import { stepStore } from "@/store/step"

const step = stepStore();
const select = selectStore();
const message = ref(String.Empty);
const disabled = ref(true);

const doneItem = select.item.stageid == 99;

async function onConfirm(colse: diaCloseCb) {
    if (!doneItem) {
        if (message.value.trim() == "") {
            return;
        }

        try {
            const selectItem = select.item;
            const response = await setMessage(selectItem.taskid, message.value);
            const taskStep = await step.getStep(selectItem)!;

            taskStep.push(response)

        } catch (error) {
            console.log(error)

        }
    }

    colse();

}

function taskLoad() {
    disabled.value = false;

}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.next-dia {
    .el-textarea textarea {
        height: 100px;
    }


}
</style>

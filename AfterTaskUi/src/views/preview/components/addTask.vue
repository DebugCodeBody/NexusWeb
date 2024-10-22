<template>
    <task-dialog v-model="data.addOpen" custom-class="add-task-dia" @confirm="onConfirm" :title="dioTitle">

        <el-card>
            <double-column label="负责部门" center>
                <p>{{ data.addTask.sing.name }}</p>
            </double-column>
        </el-card>
        <el-card v-if="false">
            <double-column label="工单单号" center>
                <el-input v-model="order" placeholder="输入工单单号" />
                <el-popover v-model:visible="visible" placement="bottom">
                    <div class="priority-view">
                        <div v-for="(item, index) in priMap" :key="index"
                            :class="{ 'priority-select': index == priority }" @click="selectPriority(index)">
                            <el-icon :size="24">
                                <Check />
                            </el-icon>
                            <el-tag :type="item.type" effect="plain">{{ item.label }}</el-tag>
                        </div>
                    </div>
                    <template #reference>
                        <el-tag :type="priMap[priority].type" effect="plain" class="priority-tab">
                            {{ priMap[priority].label }}</el-tag>
                    </template>
                </el-popover>
            </double-column>
        </el-card>
        <el-card>
            <double-column label="是否紧急" center class="end-time-view">
                <el-switch v-model="danger" inline-prompt active-text="是" inactive-text="否" />
            </double-column>
        </el-card>
        <el-card>
            <double-column label="截止时间" center class="end-time-view">
                <el-date-picker v-model="selectDate" type="date" placeholder="选择日期" />
                <el-time-select v-model="selectTime" start="00:00" step="00:15" end="23:45" placeholder="选择时间" />
            </double-column>
        </el-card>
        <el-card>
            <double-column label="任务标题">
                <el-input v-model="title" type="textarea" placeholder="输入标题以新建任务" />
            </double-column>
        </el-card>

    </task-dialog>
</template>

<script setup lang="ts">
import taskDialog from "@/components/dialog/index.vue"
import DoubleColumn from "@/components/douCol/index.vue"


import { useCurrentElement, computedEager } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"


import { taskCreate, taskEdit } from "@/api"
import { dataStore } from "@/store/data"
import { selectStore } from "@/store/select"

import moment from "moment"

const dioTitle = ref("添加任务")
const selectTime = ref("18:00");
const selectDate = ref(moment().format('YYYY-MM-DD'));
const joinTime = computed(() => {
    return `${moment(selectDate.value).format('YYYY-MM-DD')} ${selectTime.value}`
})
const danger = ref();

const data = dataStore();
const select = selectStore();

const title = ref(String.Empty);
const order = ref(String.Empty);
const priority = ref<number>(0);
const visible = ref(false);
const priMap = [
    { type: "info", label: "普通" },
    { type: "warning", label: "紧急" },
    { type: "danger", label: "非常紧急" }
]


async function onConfirm(colse: diaCloseCb) {
    // order.value == "" ||
    if (title.value == "") {
        return;
    }



    try {

        if (data.edit) {
            await taskEdit(select.item.taskid, order.value, title.value, priority.value, joinTime.value, danger.value);

        } else {
            await taskCreate(data.addTask.sing.id, order.value, title.value, priority.value, joinTime.value, danger.value);
        }


        await data.onSearch();

    } catch (error) {
        console.log(error);
    }

    colse();
}

function selectPriority(index: number) {
    priority.value = index;
    visible.value = false;
}

onMounted(() => {

    if (!data.edit) {
        return;
    }

    dioTitle.value = "编辑任务"

    const selectItem = select.item;

    danger.value = selectItem.urgent;


    const showTitle = [];
    if (selectItem.orders) {
        showTitle.push(selectItem.orders);
    }
    showTitle.push(selectItem.title);
    title.value = showTitle.join(" ");


    if (!selectItem.endof) {
        return;
    }

    const endofMoent = moment(selectItem.endof);

    selectDate.value = endofMoent.format('YYYY-MM-DD');
    selectTime.value = endofMoent.format('HH:mm');

})

onUnmounted(() => {
    data.edit = false;
})

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.add-task-dia {
    .el-tag {
        margin-right: 10px;
        cursor: pointer;

    }

    .el-textarea textarea {
        height: 100px;
    }

    .priority-tab {
        margin-left: 10px;
    }

    .end-time-view {
        .el-select--large {
            margin-left: 10px;
        }
    }
}

.priority-view {
    div {
        margin-bottom: 10px;
        cursor: pointer;

        display: flex;
        align-items: center;

        &:hover {
            background: #f7f7f7;
        }

        .el-icon {
            opacity: 0;
        }

        .el-tag {
            margin-left: 10px;
            ;
        }

        &.priority-select {
            .el-icon {
                opacity: 1;
            }
        }
    }
}
</style>

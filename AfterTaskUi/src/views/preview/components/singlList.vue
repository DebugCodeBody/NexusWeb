<template>
    <div class="kanban-single-list">
        <div class="kanban-single-list-contents">
            <div class="kanban-head">
                <div class="menu-wrapper">
                    <div class="title">
                        <span class="title-name">{{ modelValue.name }}</span>
                        <span class="title-amount">{{ modelValue.data.length }}</span>
                    </div>
                </div>
            </div>
            <div class="kanban-bucket">
                <div class="kanban-bucket-single-list">
                    <div class="kanban-dnd-card">
                        <draggable v-model="list" group="people" @start="startDrag" @end="endDrag" item-key="taskid"
                            animation="300" :move="dragOptions">
                            <template #item="{ element }">
                                <task-card @click="onSelectTask(element)" :data="element"></task-card>
                            </template>
                        </draggable>
                    </div>
                    <div class="kanban-none-list-container">
                        <div class="add-container" @click="onAdd">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import taskCard from "./taskCard.vue";
import draggable from "vuedraggable";


import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElMessage } from 'element-plus'

import { moveTask } from "@/api"
import { selectStore } from "@/store/select"
import { dragStore } from "@/store/drag"
import { dataStore } from "@/store/data"

const Props = defineProps<{
    modelValue: singItem
}>();


const drag = dragStore();
const select = selectStore();
const data = dataStore();
const dragMove = ref(false);

function onSelectTask(item: TaskCard) {
    select.item = item;
    select.selected = true;
}

const list = computed({
    get() {
        return Props.modelValue.data
    },
    set(value) {
        setModel(Props.modelValue, value)
    }
})

function setModel(model: singItem, value: TaskCards) {

    model.data.splice(0, model.data.length, ...value);
    
    if (dragMove.value) {
        drag.dragged = Props.modelValue
    } else {
        drag.related = Props.modelValue
    }

}

function dragOptions(event: any) {
    event.from.style.overflow = "hidden"
    event.to.style.overflow = "hidden"

    drag.event = event;

}

function startDrag() {
    dragMove.value = true;
}

async function endDrag() {
    if (!drag.event.dragged) {
        return;
    }
    if(!drag.dragged && !drag.related){
        return;
    }


    dragMove.value = false;

    const { dragged, draggedContext, from } = drag.event;
    const { related, relatedContext, to } = drag.event;

    
    const moveDragged: moveDra = drag.moveDragged = {} as moveDra;
    const moveRelated: moveDra = drag.moveRelated = {} as moveDra;


    moveDragged.stageid = draggedContext.element.stageid
    moveDragged.taskid = draggedContext.element.taskid
    moveDragged.idx = draggedContext.element.idx

    

    if (related === to) {
        // 从其他列表移动到一个没有任务的列表
        moveRelated.stageid = drag.related!.id!;

    } else {

        const { list, element } = relatedContext;
        const { length } = list;

        const index = list.findIndex((elem: any) => elem.taskid === draggedContext.element.taskid);

        if (relatedContext.index == 0 && list[0].taskid == draggedContext.element.taskid) {

            moveRelated.stageid = list[index + 1].stageid
            // console.log("插到最上面")

        } else if (index < length - 1) {

            moveRelated.stageid = list[index - 1].stageid
            moveRelated.taskid = list[index - 1].taskid
            moveRelated.idx = list[index - 1].idx

            // console.log("插人到某个上面")

        } else if (index == length - 1) {

            moveRelated.stageid = list[index - 1].stageid
            moveRelated.taskid = list[index - 1].taskid
            moveRelated.idx = list[index - 1].idx

            // console.log("插到最下面")
        }

    }

    // 把结果置为空，因为单单拖动的时候也会触发结束的事件
    drag.event = {};
    // 把这两个东西置为空，在执行前先判断一下再来确定是否触发后面的操作
    // 如果在一列一直一个数据的时候拖动又放回原先列，那么这两个东西是不会有值得
    drag.dragged = undefined;
    drag.related = undefined;

    drag.done();




}


function onAdd() {
    data.addTask.sing = Props.modelValue;
    data.addOpen = true;

}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.kanban-head {
    height: 48px;
    display: flex;

    .menu-wrapper {
        display: flex;
        align-items: center;

        .title-name {
            font-size: 14px;
            font-weight: 700;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .title-amount {
            color: #595959;
            flex-shrink: 0;
            font-size: 12px;
            margin-left: 12px;
        }
    }
}


.kanban-single-list {
    height: 100%;
    width: 400px;
    padding: 0 12px;
    flex-shrink: 0;

    .kanban-single-list-contents {

        height: 100%;
        width: 100%;

    }

}

.kanban-bucket {
    height: calc(100% - 48px);
    width: 100%;

    .kanban-bucket-single-list {
        height: 100%;

        display: flex;
        flex-direction: column;
    }

    .kanban-none-list-container {

        .add-container {
            height: 28px;
            margin-top: 8px;
            margin-bottom: 4px;
            line-height: 20px;
            box-sizing: border-box;
            background-color: white;
            border-radius: 4px;

            display: flex;
            justify-content: center;
            align-items: center;

            cursor: pointer;


        }

    }

}

.kanban-dnd-card {
    overflow: auto;
}

.flip-list-move {
    transition: transform 0.5s;
}
</style>

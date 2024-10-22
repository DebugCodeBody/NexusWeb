<template>
    <div class="work-column">
        <div class="item-view">
            <div class="item-top-container">
                <span class="name">{{ title }}</span>
                <span class="number">{{ modelValue.length }}</span>
            </div>
            <div class="item-middle-container">
                <el-scrollbar>
                    <draggable :data="Props.modelValue" :bind="draggableBind" itemkey="id" :move="onItemMove"
                        :resize="onItemResize">
                        <template #default="{ element }">
                            <item :id="id" :data="element" @click="onStepItem(element)" @edit="onEditItem(element)"/>
                        </template>
                    </draggable>
                </el-scrollbar>
            </div>
            <div class="item-bottom-container" v-if="allowAdd">
                <div class="add-container" @click="onAddItem">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import item from "./item.vue";


import Draggable from "global@/Draggable/index.vue"
import type { Resize } from "global@/Draggable/index.vue"


const Emits = defineEmits<{
    (e: 'popDialog', action: "add" | "edit", item?: any): void
    (e: 'pop-step', action: string, item: any): void
}>();


const Props = defineProps<{
    id: number,
    /** 标题 */
    title: string,
    /** 是否允许添加 */
    allowAdd: boolean,
    modelValue: workItems
}>();


type bind = {
    id: number,
    data: workItems
}

const draggableBind = $computed<bind>(() => {
    return {
        id: Props.id,
        data: Props.modelValue
    }
})



function onAddItem() {
    Emits('popDialog', "add");
}

function onEditItem(item: any) {
    Emits('popDialog', "edit", item);
}

function onStepItem(item: any) {
    Emits('pop-step', "step", item);
}


function onItemMove(event: Resize<bind>) {
    if (![3, 4].includes(event.toData.id)) {
        return false;
    }
    if(event.toData.id == 4 && event.fromData.id == 3){
        return false;
    }




    return new Promise((resolve, reject) => {
        window.draggableMove = {
            resolve,
            reject
        }

        
        // "step" | "done" | "bei"

        let action:string;

        switch(event.toData.id){
            case 3:
                action = "done";
                break;
            case 4:
                action = "bei";
                break;
        }


        Emits('pop-step', action!, event.fromData.data[event.fromIndex]);
    })

}

function onItemResize() {
    return false;
}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.work-column .item-view {
    height: 100%;
    display: flex;
    flex-direction: column;


    .item-top-container {
        margin-bottom: 10px;

        .name {
            font-size: 14px;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .number {
            color: #595959;
            flex-shrink: 0;
            font-size: 12px;
            margin-left: 12px;
        }
    }

    .item-middle-container {
        overflow: auto;
        flex: 1;

        .el-scrollbar__view{
            height: 100%;
        }
    }

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
</style>

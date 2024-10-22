<template>
    <div>
        <draggable v-model="draggableData" group="people" animation="300" :itemKey="itemkey" @start="startDrag"
            @end="endDrag" :move="dragOptions" ref="draggableEl">
            <template #item="{ element }">
                <div class="drag-item">
                    <slot :element="element"></slot>
                </div>
            </template>
        </draggable>
        <el-empty description="暂无订单" v-if="!draggableData.length" />
    </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

import { from, to } from "./store"




const Props = defineProps<{
    /** 用来生成拖拽的数据 */
    data: any,
    /** 绑定的数据，用来回调的时候使用 */
    bind: any,
    /** 唯一标识key，在vue中用来做for key使用，在数据中做移动判断使用 */
    itemkey: string,
    /** 同个布局元素上下调整的时候触发 */
    resize: (value: Resize) => boolean
    /** 不同布局元素相互移动时候触发 */
    move: (value: Resize) => boolean
}>();

const draggableData = $computed({
    get() {
        return Props.data
    },
    set() {
    }
});


const el = $ref(useCurrentElement())

function dragOptions(event: any) {
    event.from.style.overflow = "hidden"
    event.to.style.overflow = "hidden"
}

function startDrag(event: any) {
    from.data = event.from.modelValue;
    from.index = event.oldIndex;
}

async function endDrag(event: any) {
    to.data = event.to.modelValue;
    to.index = event.newIndex;

    const resizeData: Resize = {
        fromData: from.data.bind,
        fromIndex: from.index,
        toData: to.data.bind,
        toIndex: to.index
    }


    const fromData = from.data.data;
    const toData = to.data.data;


    if (from.data === to.data) {
        if (from.index == to.index) {
            /** 放弃移动 */
            return;
        } else {

            const result = Props.resize(resizeData);
            if (result === false) {
                return;
            }

            fromData.splice(to.index, 0, ...fromData.splice(from.index, 1))

            // if (to.index == 0) {
            //     console.log("移动到最上面")
            // } else if (to.index == from.data.length - 1) {
            //     console.log("移动到最下面")
            // } else if (from.index < to.index) {
            //     console.log("向下移动")
            // } else if (from.index > to.index) {
            //     console.log("向上移动")
            // }
        }

    } else {
        const result = Props.move(resizeData);
        if (result === false) {
            return;
        }

        toData.splice(to.index, 0, ...fromData.splice(from.index, 1))

        // console.log('移动到其他位置');
    }

}


onMounted(() => {
    (el as any).childNodes[0].modelValue = Props;
})



</script>

<script lang="ts">
export default {
    name: ""
}

export interface Resize<T = any> {
    /** from 绑定的数据 */
    fromData: T,
    /** 原始位置 */
    fromIndex: 0,
    /** to 绑定的数据 */
    toData: T,
    /** 结束位置 */
    toIndex: 0
}

</script>

<style lang="scss">

.drag-item:not(:last-child){
    margin-bottom: 10px;
    
}

</style>

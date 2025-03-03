<template>
    <div class="draggable-content">
        <draggable v-model="draggableData" group="people" animation="300" :itemKey="itemkey" @start="startDrag"
            @end="endDrag" :move="dragOptions" ref="draggableEl" class="draggable-list">
            <template #item="{ element }">
                <div class="drag-item">
                    <slot :element="element"></slot>
                </div>
            </template>
        </draggable>
        <!-- <div class="draggable-empty">
            <slot name="empty">
                <el-empty description="暂无数据" />
            </slot>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'

import { from, to } from "./store"
import { callFinallyFun } from "../coreUtils/Common"


const Props = withDefaults(defineProps<{
    /** 用来生成拖拽的数据 */
    data: any,
    /** 绑定的数据，用来回调的时候使用 */
    bind: any,
    /** 唯一标识key，在vue中用来做for key使用，在数据中做移动判断使用 */
    itemkey: string,
    /** 同个布局元素上下调整的时候触发 */
    resize?: (value: Resize) => boolean
    /** 不同布局元素相互移动时候触发 */
    move?: (value: Resize) => boolean
}>(), {
    resize: () => { },
    move: () => { }
})

const draggableData = $computed({
    get() {
        return Props.data
    },
    set() {
    }
});


const el = $ref(useCurrentElement())

let isDrag = false;
let fromOverflow = "";
let toOverflow = "";
function dragOptions(event: any) {
    if (!isDrag) {

        fromOverflow = event.from.style.overflow;
        toOverflow = event.to.style.overflow;
        isDrag = true;
    }



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



            before(Props.resize, resizeData, () => {
                fromData.splice(to.index, 0, ...fromData.splice(from.index, 1))
            })


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
        before(Props.move, resizeData, () => {
            toData.splice(to.index, 0, ...fromData.splice(from.index, 1))
        })


        // console.log('移动到其他位置');
    }


    nextTick(() => {
        event.from.style.overflow = fromOverflow;
        event.to.style.overflow = toOverflow;

        isDrag = false;
    })
}


function before(fun: any, data: any, call: any) {

    const result = fun(data);
    if (result === false) {
        return;
    }
    if (result === true) {
        call();
        return;
    }
    if (result instanceof Promise) {
        result.then(call).catch(() => {
            console.log("异步取消拖放")
        })
    }
}


onMounted(() => {
    (el as any).childNodes[0].modelValue = Props;
})

</script>

<script lang="ts">
/**
 * 二次封装的拖拽库
 * 能够通过事件返回值来决定是否移动
 * 
 */
export default {
    name: ""
}

export interface Resize<T = any> {
    /** from 绑定的数据 */
    fromData: T,
    /** 原始位置 */
    fromIndex: number,
    /** to 绑定的数据 */
    toData: T,
    /** 结束位置 */
    toIndex: number
}

</script>

<style lang="scss">
// 这里需要父级高度才能正常
.draggable-content,
.draggable-list {
    height: 100%;
}

.draggable-content {

    position: relative;

    /**
        空白元素设置成绝对定位，且顶边位置为0
        这样才不会被父级的元素100%给顶到下边去
    */
    .draggable-empty {
        position: absolute;
        width: 100%;
        top: 0;
    }

    /** 
        如果当前有数据的话，那么久不需要显示这个
        为什么要用Css来判断而不是用v-if来判断
        如果使用v-if的话，在从其他列拖进一个空白列的时候。空列表元素依然存在，因为这个时候数据是没有添加进去的，需要松开鼠标的时候才能触发回调事件
        但是用css的话，拖进去的时候，dom元素已经移动了位置，列表上有着数据，这时候css就可以隐藏掉空元素

     */
    .draggable-list:not(:empty)+.draggable-empty {
        display: none;
    }

}

.drag-item:not(:last-child) {
    margin-bottom: 10px;

}
</style>

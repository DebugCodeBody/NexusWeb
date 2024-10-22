<template>
    <van-dialog v-model:show="show" title="确认提交？" show-cancel-button @confirm="confirm" @cancel="cancel"
        class="dialog-view">
        <div class="dialog-list-view-warn">
            <div class="warn" v-for="(item,index) in lackList" :key="index">
                <span class="date">{{item[0]}}</span>
                <span>{{item[1]}}</span>
                <span>{{item[2]}}</span>
                <span>没有点</span>
            </div>
        </div>

        <!-- <div class="dialog-view-warn" v-if="lackFood.length > 0">
            <span class="title">未点主食</span>
            <div class="date-view">
                <span v-for="(str,index) in lackFood" :key="index">{{str}}</span>
            </div>
        </div>
        <div class="dialog-view-warn" v-if="lackMenu.length > 0">
            <span class="title">未点菜品</span>
            <div class="date-view">
                <span v-for="(str,index) in lackFood" :key="index">{{str}}</span>
            </div>
        </div> -->

    </van-dialog>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"


import { timeStore } from "@/store/time"
import { orderStore } from "@/store/order"


const time = timeStore();
const order = orderStore();

const lackList = reactive<Array<Array<string>>>([]);
const show = ref(false);
const callBack = {
    resolve: (v: boolean) => { },
    reject: (v: boolean) => { }
};

function confirm() {
    callBack.resolve(true);
}

function cancel() {
    callBack.resolve(false);
}

function checkLack() {
    lackList.length = 0;

    let popIng = false;

    order.dataList.forEach((elem) => {

        const { str } = elem;

        order[str].data.forEach((item, index) => {
            if (item.length == 0 || index == 0) {
                return;
            }

            let lackFood = true;
            let lackRice = true;

            item.forEach((orderItem) => {
                const { type } = orderItem.taste.parent;

                if (type == "主食") {
                    lackRice = false;
                } else if (type == "菜") {
                    lackFood = false;
                }
            })

            if (lackRice) {
                popIng = true;
                lackList.push([str, time.time[index], "主食"])
            }
            if (lackFood) {
                popIng = true;
                lackList.push([str, time.time[index], "菜品"])
            }

        })


    })


    return popIng

}

function dialog() {
    return new Promise((resolve, reject) => {
        callBack.resolve = resolve;
        callBack.reject = reject;


        if (checkLack()) {
            show.value = true;
        } else {
            confirm();
        }
    })
}

defineExpose({
    dialog
});
</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.dialog-list-view-warn {
    font-size: 12px;
    padding: 0 20px;
    color: #ee0a24;
    text-align: center;
    margin: 10px 0;

    .warn {
        line-height: 20px;

        .date {
            margin-right: 2px;
            font-weight: bolder;

        }
    }
}

.dialog-view-warn {
    display: flex;
    flex-direction: column;

    padding: 0 20px;


    .title {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 10px
    }

    .date-view {
        display: flex;
        flex-wrap: wrap;

        span {
            padding: 5px;
            font-size: 14px;
            border-radius: 5px;
            background-color: #f4f4f5;
            border-color: #e9e9eb;
            color: #909399;
            border: 1px solid #d9ecff;

            margin-right: 5px;
            margin-bottom: 10px;
        }

    }

}
</style>

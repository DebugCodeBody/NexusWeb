<template>

    <div class="task-card">
        <div class="task-priority" :class="getClass()"></div>
        <div class="task-card-top"></div>
        <div class="task-card-body">
            <!-- 
            <span class="check-box">
                <div></div>
            </span> -->
            <div class="task-content-set">
                <header class="task-content-wrapper">
                    <div class="content-left-view">
                        <p class="task-content-text">
                            <template v-if="orders">
                                <template v-for="txt in splitTitle" :key="txt">
                                    <span v-if="txt">{{txt}}</span>
                                    <a :href="toInfoUrl(orders)" target="_blank" v-else @click.stop="()=>{}">{{orders}}</a>
                                </template>
                            </template>
                            <template v-else>
                                {{ data.orders + " " + data.title }}
                            </template>
                        </p>
                        <p class="task-content-text other">
                            <span class="name">{{ data.createuser }}</span>
                            <span class="date"> {{ fromDate(data.createdate) }}</span>
                            <span class="end-time" v-if="data.endof" :class="{ [endTimeColor]:true }"> {{
                            difftime(data.endof) }} 截止</span>
                        </p>
                    </div>
                    <div class="content-right-view" v-if="data.stageid != 99">
                        <el-button type="primary" :icon="Edit" size="small" @click.stop="onEditClick" />
                    </div>

                </header>
                <div class="task-infos">

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { Edit } from '@element-plus/icons-vue'

import moment from "moment";

import { dataStore } from "@/store/data"
import { parseOrder } from "@/utils/order"





const Props = defineProps<{
    data: TaskCard
}>();

const endTimeColor = ref("info");

function getClass() {
    return `priority-${["grey", "orange", "red"][Props.data.urgent ? 2 : 0]}`
    // return `priority-${["grey", "orange", "red"][(Props.data.priority || 1) - 1]}`
}

function fromDate(date: string) {
    return moment(date).format('MM-DD HH:mm');
}

function difftime(date: string) {
    const taskDate = moment(date);
    const nowDate = moment();

    const diffDay = moment(nowDate.format('YYYY-MM-DD')).diff(moment(taskDate.format('YYYY-MM-DD')), "days");



    if (diffDay == 0) {

        if (taskDate.diff(nowDate, "minute") > 0) {
            endTimeColor.value = "warning"
        } else {
            endTimeColor.value = "danger"
        }

        return `今天 ${moment(date).format("HH:mm")}`
    } else if (Math.abs(diffDay) > 2) {
        if (diffDay > 0) {
            endTimeColor.value = "danger"
        }

        return `${taskDate.format('MM-DD')}`
    } else if (diffDay < 0) {
        return ['明天', '后天'][Math.abs(diffDay) - 1]
    } else {

        endTimeColor.value = "danger";
        return ['昨天', '前天'][Math.abs(diffDay) - 1]
    }

}

function onEditClick() {
    dataStore().editItem(Props.data);
}

function toInfoUrl(val:string){
    return `../order_info/index.html?order=${encodeURIComponent(val)}`
}

const orders = parseOrder(Props.data.title)




const splitTitle: string[] = [];

if (orders) {


    const left = Props.data.title.indexOf(orders);
    if (left == 0) {
        splitTitle.push('');
        splitTitle.push(Props.data.title.slice(orders.length));
    } else {
        splitTitle.push(Props.data.title.slice(0, left))
        splitTitle.push('');
        splitTitle.push(Props.data.title.slice(splitTitle[0].length + orders.length));
        
    }




}






















</script>

<script lang="ts">
export default {
    name: "taskCard"
}
</script>

<style lang="scss">
.task-card {
    display: flex;
    background-color: white;
    border-radius: 4px;
    margin-bottom: 10px;

    user-select: none;
    cursor: pointer;

    position: relative;

    &:hover .task-priority {
        width: 6px;

        &.priority-grey {
            background-color: #8c8c8c;

        }
    }

    .task-priority {
        position: absolute;
        width: 3px;
        position: absolute;
        top: 0;
        bottom: 0;
        transition: width 218ms ease-in;
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;

        &.priority-red {
            background: red;
        }

        &.priority-orange {
            background: #fa8c15;
        }





    }

    .task-content-text {
        line-height: 30px;

        &.other {
            font-size: 12px;
            color: #595959;

            span {
                margin-right: 10px
            }

            .end-time {
                padding: 2px 10px;
                color: white;
                border-radius: 4px;

                &.info {
                    background: #1b9aee;
                }

                &.warning {
                    background: #fa8c15;
                    ;
                }

                &.danger {
                    background: red;
                }

            }
        }

    }

}

.task-card-body {
    display: flex;
    flex: 1;


    .check-box {
        margin: 12px 8px 12px 12px;

        div {
            width: 16px;
            height: 16px;
            border: 1px solid #8c8c8c;
            border-radius: 2px;
            box-sizing: border-box;
            cursor: pointer;

        }
    }

    .task-content-set {
        word-wrap: break-word;
        flex: 1;
        min-width: 0;
        overflow: hidden;
        cursor: pointer;
        line-height: 20px;
        overflow: hidden;
        padding: 12px 16px;
        font-size: 14px;
        padding-left: 0px;

        padding-left: 10px;
    }

    .task-content-wrapper {
        display: flex;

        .content-left-view {
            flex: 1;
        }
    }
}
</style>

<template>
    <div class="log-content">
        <div class="log-item" v-for="(item, index) in data" :key="index">
            <div>
                <span class="name">{{ item.username }}</span>
                <span class="ml-10px stageid" v-if="index == 0">
                    <el-tag size="small" v-if="stageid == 1">创建工单</el-tag>
                    <el-tag type="warning" size="small" v-else-if="stageid == 2">处理中</el-tag>
                    <el-tag type="danger" size="small" v-else-if="stageid == 3">已结案</el-tag>
                    <el-tag type="info" size="small" v-else-if="stageid == 99">留言</el-tag>
                </span>
                <span class="ml-10px time">{{ format(item.createdate) }}</span>
            </div>
            <div class="mt-10px ">
                <span class="info">{{ item.memo || getTitle(item.stageid) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"

const Props = defineProps<{
    data: logItem[]
}>();

function format(timeStr: string) {
    return dayjs(timeStr).format("MM-DD HH:mm")
}


const stageid = $computed(() => {
    const { data } = Props;
    return data[data.length - 1].stageid
})

function getTitle(id:number) {

    return ({
        "1": "创建工单",
        "2": "转到处理",
        "3": "转到结案",
        "99": "留言",
    })[id]

}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

<template>
    <div class="log-content">
        <el-card>

            <el-collapse v-model="activeName" v-if="logList.length">
                <el-collapse-item v-for="(item, index) in logList" :key="index" :name="index">
                    <template #title>
                        <div>
                            <el-tag class="time">{{ item.create_time }}</el-tag>
                            <span class="name">{{ item.name }} {{ item.form }}</span>
                        </div>
                    </template>
                    <pre>{{ item.content }}</pre>
                </el-collapse-item>
            </el-collapse>

            <el-empty description="请在左边表格选中查看日志" v-else/>


        </el-card>
    </div>
</template>

<script setup lang="ts">


let activeName = $ref([] as any[]);
const logList = $ref([] as any[]);

let selectItem: any;





window.onBeiliaoLog = function (item: any) {

    selectItem = item;

    logList.length = 0;
    logList.push(...item.log);

    activeName = logList.map((elem, index) => index)

    window.selectBeianItem = item;



}


onMounted(() => {


    if (window.selectBeianItem) {
        window.onBeiliaoLog(window.selectBeianItem);
    }

})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.log-content {
    width: 100%;
    height: 100%;

    overflow: auto;

    .name {
        margin-left: 10px;
    }
}
</style>

<template>
    <div class="relative h-full">
        <div class="group-item">
            <el-button v-for="item in data.list" :key="item.name" @click="onClickName(item)">{{ item.name
                }}</el-button>
        </div>
        <div class="mt-10px">
            <el-button class="w-full" type="primary" @click="onClickAdd">新增</el-button>
        </div>


    </div>
</template>

<script setup lang="ts">




import { data } from "./data";


function onClickName(item: any) {

    data.action = "edit";
    data.selectItem = item;

}


function onClickAdd() {

    data.action = "add";
    data.selectItem = {
        id: 0,
        name: "",
        user: []
    };

}

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

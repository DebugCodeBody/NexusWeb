<template>
    <div>
        <span class="mr-10px">{{ title }}</span>
        <el-radio-group v-model="selectModel" @change="onChange">
            <el-radio v-for="item in radioList" :key="item" :label="item">{{ item }}</el-radio>
        </el-radio-group>
    </div>
</template>

<script setup lang="ts">

import { selectArr } from "./Helper"

interface Emits {
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void;
}

const Emit = defineEmits<Emits>();

const radioList = $ref([...selectArr])

const Props = defineProps<{
    title: string,
    modelValue: string
}>();


let selectModel = $ref(Props.modelValue);



function onChange(value: string) {
    Emit('update:modelValue', value);
    Emit('change', value);
}

function init() {

    let index = -1;
    if (selectModel == "") {
        index = 0;
    } else if (radioList.indexOf(selectModel) == -1) {
        index = 2;
    }

    if (index > -1) {
        selectModel = radioList[index];
        onChange(selectModel)
    }

}

init();

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

<template>
    <el-radio-group v-model="thisType" @change="onRadioChange">
        <el-radio v-for="(item, index) in typeArr" :key="index" :label="item">{{ item }}</el-radio>
    </el-radio-group>
</template>

<script setup lang="ts">

const Emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const Props = defineProps<{
    modelValue: string
}>();

let thisType = $ref(Props.modelValue);

// "现场类",
let typeArr = $ref(["在产类", "防呆类", "畅聊类",  "建议类"]);


function onRadioChange(value: string) {
    Emit('update:modelValue', value);
}

watch(()=> Props.modelValue, (value)=>{

    thisType = value;
    
})




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

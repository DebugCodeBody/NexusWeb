<template>
    <el-radio-group v-model="value" @change="onChangeResult">
        <el-radio label="0" v-show="false">无</el-radio>
        <el-radio label="1">程序改善</el-radio>
        <el-radio label="3">个案结案</el-radio>
        <el-radio label="2">
            <div class="flex">
                <span class="">培训</span>
                <div class="ml-5px w-100px">
                    <el-input v-model="train" @input="onInputTrain" ref="trainInputEl"
                        :disabled="inputDisabled"></el-input>
                </div>
            </div>
        </el-radio>
    </el-radio-group>
</template>

<script setup lang="ts">


const Emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const Props = defineProps<{
    modelValue: string,
}>();


let value = $ref("0");
let train = $ref("");
const trainInputEl = $ref<any>();

const inputDisabled = $computed(() => {
    return value != "2";
});



function updateValue(value: string) {
    Emit('update:modelValue', value);
}



function onChangeResult(value: string) {

    if (value) {

        const result = (["", "程序改善", "培训", "个案结案"])[parseInt(value)];
        if (value == "2") {
            trainInputEl.focus();
        }

        updateValue(result);

    }


}

/** 输入培训名字 */
function onInputTrain(value: string) {

    updateValue(`培训：${value}`);

}




defineExpose({

    rule() {

        let error: Error | undefined = undefined;

        if (value == "2" && train == "") {
            error = new Error("请填写培训名字");
        }

        return error;

    },
    clear(){
        value = "0";
        train = "";
    },
    parse(item: mettItem) {



        const split = (item.result || "").split(/[：:]/)

        const index = (["", "程序改善", "培训", "个案结案"]).indexOf(split[0]);

        value = `${index}`;

        train = split[1] || "";

        
        onChangeResult(value);
            
        if(train){
            onInputTrain(train);
        }


    }


})







</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

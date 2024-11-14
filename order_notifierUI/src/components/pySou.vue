<template>
    <div class="py-ss-input">
        <el-input v-model="pyValue" clearable @clear="onPyClear" ref="pyInputEl" :disabled="disabled"></el-input>
        <div>

            <el-radio-group v-model="popParams.radioValue" class="person" @change="onRadioChange" :disabled="disabled">
                <el-radio v-for="(item, index) in pyList" :label="item.name" :key="index" >
                    {{ item.name }}
                </el-radio>
            </el-radio-group>
            <el-input v-model="personInput" :disabled="disabledPersonInput || disabled" @input="onPersonInput"></el-input>

        </div>

    </div>
</template>

<script setup lang="ts">

import { pinyin } from "pinyin-pro";


const Emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const Props = withDefaults(defineProps<{
    modelValue: string,
    list: any[],
    disabled?: boolean
}>(), {

    disabled: false

});

const pyValue = $ref("");

const personInput = $ref("");

const pyInputEl = $ref<any>();


const popParams = $ref({

    pyValue: "",

    /** 单选框选中的值 */
    radioValue: ""

});


let inputEl: HTMLInputElement;
let timtEmitClear = false;

const pyList = $computed(() => {


    const { list } = Props;
    const { pyValue } = popParams;


    if(!pyValue){
        return list;
    }

    const retVal = list.filter(({ name }) => {

        const py = pinyin(name,{ toneType: 'none' });

        const splitPy = py.split(" ");

        /** 首拼 */
        const sp = splitPy.map((elem) => elem[0]).join("");


        return name.includes(pyValue) || py.includes(pyValue) || sp.includes(pyValue);

   
    })


    return retVal;

});

const disabledPersonInput = $computed(() => {

    return popParams.radioValue != "其他";

})


function updateModelValue(value:string){
    Emit('update:modelValue', value);
}

function onPyClear(){

    popParams.pyValue = "";


}



function onPyInput(event: Event) {

    const { value } = inputEl;



    /** 
     *
     * 这里因为在回车按下的时候，有时候还是会触发到这个输入事件
     * 所以需要做个拦截，在回车定时器里设置 timtEmitClear = true
     * 然后再输入事件判断，如果为true的话不再进行赋值，而且需要把他们的值给删除掉
     * 
     */
    if (timtEmitClear) {
        timtEmitClear = false;
        setTimeout(() => {
            onPyClear();
        })
        return;
    }

    popParams.pyValue = value;


}

function onPyKeyDown(event: KeyboardEvent) {


    /**
     * 
     * keyCode = 229 的话，那就是当前是中文输入法
     * 需要判断当前案件的是不是回车
     * 
     * 13 = 英语输入的回车
     * 
     * 
     * 
     *  */
    if ((event.keyCode != 13 && event.keyCode != 229) || (event.keyCode == 229 && event.code != 'Enter' && event.code != 'NumpadEnter')) {
        return;
    }



    // const { showUserList, selectList } = popParams;

    // if (showUserList.length == 1) {

    //     const { name } = showUserList[0];

    //     selectList.push(name);

    //     onChange(name);

    //     if (!popParams.isOne) {

    //         setTimeout(() => {
    //             timtEmitClear = true;
    //             onPyClear();
    //         });
    //     }

    // }

}


function onRadioChange(name:string){
    
    if(disabledPersonInput){

        updateModelValue(name);    

    }else{
        updateModelValue("");   
    }


}

function onPersonInput(value:string) {

    updateModelValue(value);

}





function addEvent() {


    inputEl = document.querySelector<HTMLInputElement>(".py-ss-input .el-input__inner")!;

    inputEl.addEventListener("keydown", onPyKeyDown);
    inputEl.addEventListener("input", onPyInput);



}

onMounted(() => {



    addEvent();






})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

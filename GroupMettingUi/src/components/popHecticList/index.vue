<template>

    <pop-dialog class="pop-edit_track" title="繁忙时间清单" v-model="popValue" v-if="renderValur" @confirm="onConfirm">

        <el-button v-for="item in nameList" :key="item" @click="onClickName(item)">{{ item }}</el-button>



    </pop-dialog>

    <pop-form ref="formEl"/>

</template>

<script setup lang="ts">

import popDialog from "global@/popDialog/index.vue";

import popForm from "./popForm.vue"


import { getLeaveList } from "@/api/leave"


const Props = defineProps<{
    refresh: any
}>()

let renderValur = $ref(false);
let popValue = $ref(false);



const formEl = $ref<any>();



const formData = $ref({
    data: [] as any[]
});

const nameList = $computed(()=>{

    return formData.data.map((elem) => elem.name);

}) 



function onConfirm(){

    popValue = false;

}

function onClickName(name:string){

    const item = formData.data.find((elem) => elem.name == name)!;


    formEl.set(item);


}






async function init() {

    const data = await getLeaveList();

    formData.data.length = 0;
    formData.data.push(...data);

}



defineExpose({


    open(){

        renderValur = popValue = true;

        init();
        
    }



})




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.pop-edit_track {

    textarea {
        height: 100px;
        resize: none;
    }

}
</style>

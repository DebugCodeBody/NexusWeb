<template>
    <pop-dialog 
        class="pop-set_next_time" 
        title="设置期待时间" 
        v-model="popValue" 
        v-if="renderValur" 
        @confirm="onConfirm"
        @opened="onOpenEd"
        @closeed="onCloseEd">

        <el-form :model="formData" label-width="auto" :rules="formRules" :hide-required-asterisk="true" ref="formEl">

            <el-form-item label="日期" prop="date" v-show="false">
                <div>
                    <div><el-date-picker v-model="formData.date" type="date" placeholder="请选择日期" /></div>
                    <!-- <div class="mt-10px">
                        <el-button size="small">明天</el-button>
                        <el-button size="small">后天</el-button>
                    </div> -->
                </div>
            </el-form-item>

            <el-form-item label="时间" prop="time">
                <div>
                    <div>
                        <el-time-picker v-model="formData.time" placeholder="请选择时间" :disabled="true"/>
                    </div>
                    <div class="mt-10px">
                        <el-button size="small" @click="onClickAddMinutes(30)">半小时内</el-button>
                        <el-button size="small" @click="onClickAddMinutes(60)">当班次</el-button>
                        <el-button size="small" @click="onClickAddMinutes(120)">两班次</el-button>
                        <el-button size="small" @click="onClickSetHour(9)">三班次</el-button>
                    </div> 
                </div>
                
            </el-form-item>


        </el-form>


    </pop-dialog>

</template>

<script setup lang="ts">

import { setNextTime } from "@/api/nexttime"

import type { FormRules } from 'element-plus'
import dayjs from "dayjs";

import popDialog from "global@/popDialog/index.vue";

import { setTagContent } from "@/api/tag"
import { onOpenEd, onCloseEd } from "@/utils/popKey";


const Props = defineProps<{
    refresh: any
}>()


let renderValur = $ref(false);
let popValue = $ref(false);

const formEl = $ref<any>();
let selectItem = $ref({} as mettItem);

const formRules = reactive<FormRules>({
    date: [
        { required: true, message: '请选择日期', trigger: 'change' }
    ],
    time: [
        { required: true, message: '请选择时间', trigger: 'change' }
    ]
});

const formData = $ref({
    date: undefined as any as Date ,
    time: undefined as any as Date
});


function setTtime(value:any){
    
    formData.date = new Date(value.format("YYYY-MM-DD HH:mm"));
    formData.time = new Date(value.format("YYYY-MM-DD HH:mm"));


}


function onClickAddMinutes(value:number){


    const nowTime = dayjs();

    const addTime = nowTime.add(value, 'minute');

    
    setTtime(addTime);

}


function onClickSetHour(hour:number, minute = 0){

    const nowTime = dayjs();

    const setTime = dayjs(`${nowTime.format("YYYY-MM-DD")} ${hour}:${minute}`);

    setTtime(setTime);




}







async function onConfirm() {

    try {
        await formEl.validate();
    } catch {
        return;
    }


    const dateDay = dayjs(formData.date);
    const timeDay = dayjs(formData.time);

    const setTime = `${dateDay.format("YYYY-MM-DD")} ${timeDay.format("HH:mm")}`;


    try {

        await setNextTime(selectItem.id, setTime)

    } finally {

        popValue = false;

        Props.refresh();

    }







}

window.onSetNextTime = function (item: mettItem) {

    popValue = true;
    renderValur = true;

    selectItem = item;

    if(item.next_time){

        const itemTime = dayjs(item.next_time );

        formData.date = new Date(itemTime.format("YYYY-MM-DD"));
        formData.time = new Date(itemTime.format("YYYY-MM-DD HH:mm"));

    }

    


}





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

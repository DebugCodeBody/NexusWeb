<template>
    <div>
        <div>
            <el-date-picker type="datetime" v-model="formData.time" placeholder="请选择时间" @change="onChangeDate" />
        </div>
        <div class="mt-10px">
            <el-button size="small" v-for="item in quickList" :key="item.name" @click="onClickQuick(item)">{{ item.name
                }}</el-button>
        </div>
    </div>

</template>

<script setup lang="ts">

import dayjs from "dayjs"

const Emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();


const Props = defineProps<{
    modelValue: string
}>();

const formData = $ref({
    date: undefined as any as Date,
    time: undefined as any as Date,
    banci: ""
});

let isUpdate = false;

const quickList = $ref([
    {
        name: "半小时内",
        handle() {
            onClickAddMinutes(30);
        }
    },
    {
        name: "当班次",
        handle() {
            onClickAddBnaCi(0);
        }
    },
    {
        name: "两班次",
        handle() {
            onClickAddBnaCi(1);
        }
    },
    {
        name: "三班次",
        handle() {
            onClickAddBnaCi(2);
        }
    },
])


function updateModelValue(value: any) {

    isUpdate = true;


    const updateValue = [value];

    if(formData.banci){
        updateValue.push(formData.banci);
    }

    Emit('update:modelValue', updateValue.join(";"));

}


function setTtime(value: any) {

    if (typeof value != "string") {
        value = value.format("YYYY-MM-DD HH:mm");
    }

    formData.date = new Date(value);

    formData.time = new Date(value);

    updateModelValue(value);

}


function onClickAddBnaCi(value: number) {

    const nowTime = dayjs();

    const hour = nowTime.hour();
    const minute = nowTime.minute();

    const banciTab = [
        {
            start: {
                hour: 9,
                minute: 0
            },
            end: {
                hour: 12,
                minute: 0
            }
        },
        {
            start: {
                hour: 13,
                minute: 30
            },
            end: {
                hour: 17,
                minute: 30
            }
        },
        {
            start: {
                hour: 18,
                minute: 0
            },
            end: {
                hour: 22,
                minute: 0
            }
        },

    ];


    let addDay = 0;

    let banciIndex = -1;

    // 小时 大于9点 且 小于 12点
    // 小时 大于等22 点
    if ((hour >= 9 && hour < 12) || (hour >= 22)) {

        banciIndex = 0;

    } else
        // 小时 大于12点 且 小时 小于12 活 小时等于17 且 分钟小于等于30
        if (hour >= 12 && (hour < 17 || (hour == 17 && minute <= 30))) {

            banciIndex = 1;

        } else
            // 小时 大于等于18 且 小于等于  22 
            if (hour >= 18 && hour <= 22) {

                banciIndex = 2

            }

    banciIndex += value;

    if (banciIndex > (banciTab.length - 1)) {
        addDay += 1;

        banciIndex -= banciTab.length


    }

    let nextTime = nowTime.add(addDay, "day");
    const thisBan = banciTab[banciIndex];

    nextTime = nextTime.set("h", thisBan.end.hour);
    nextTime = nextTime.set("m", thisBan.end.minute);

    setTtime(nextTime);

}


function onClickAddMinutes(value: number) {


    const nowTime = dayjs();

    const addTime = nowTime.add(value, 'minute');

    setTtime(addTime);

}

function onClickQuick(item: any) {

    formData.banci = item.name;

    item.handle();

}


function onChangeDate(value:string){

    setTtime(dayjs(value));

}



if (Props.modelValue) {
    setTtime(Props.modelValue);
}

watch(() => Props.modelValue, (value) => {

    if(isUpdate){
        return;
    }

    if (value) {

        const split = value.split(";");

        setTtime(split[0]);

        formData.banci = split[1] || "";

    } else {

        formData.date = undefined as any as Date;
        formData.time = undefined as any as Date;
        formData.banci = "";
    }


})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

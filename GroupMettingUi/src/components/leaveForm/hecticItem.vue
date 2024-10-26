<template>

    <el-checkbox-group v-model="selectList" @change="onChangeValue">

        <el-checkbox v-for="(item) in banList" :key="item.id" :value="item.id" :label="item.id">
            <div class="flex items-center">
                <span>{{ item.name }}</span>
                <div class="ml-10px">
                    <el-time-picker v-model="item.value" is-range range-separator="到"
                        :disabled="!selectList.includes(item.id)" @change="onTimeChange" />
                </div>
            </div>
        </el-checkbox>

    </el-checkbox-group>



</template>

<script setup lang="ts">

import dayjs from "dayjs";

const Props = defineProps<{
    value: any[]
}>()


const selectList = $ref<any[]>([]);

const selectBan = $computed(() => {

    return banList.filter((elem) => selectList.includes(elem.id));

});

const banList = $ref([
    {
        name: "早上",
        id: "zs",
        start: "09:00",
        end: "12:00",
        value: [] as Date[]
    },
    {
        name: "下午",
        id: "xw",
        start: "13:30",
        end: "17:30",
        value: [] as Date[]
    },
    {
        name: "晚上",
        id: "ws",
        start: "18:00",
        end: "21:00",
        value: [] as Date[]
    }
]);

function updateValue() {

    Props.value.length = 0;


    const newValue = selectBan.map((elem) => {

        const retVal = {

            id: elem.id,
            start: dayjs(elem.value[0]).format("HH:mm"),
            end: dayjs(elem.value[1]).format("HH:mm"),
        }

        return retVal;

    });

    Props.value.push(...newValue);

}




function onChangeValue(value: string[]) {

    updateValue();

}

function onTimeChange() {

    updateValue();

}


function init() {

    const ymdTime = dayjs().format("YYYY-MM-DD")


    banList.forEach((item) => {

        item.value = [
            new Date(`${ymdTime} ${item.start}`),
            new Date(`${ymdTime} ${item.end}`)
        ];

    })




}





defineExpose({
    set(value: any[]) {


        selectList.length = 0;
        init();

        const ymdTime = dayjs().format("YYYY-MM-DD");

        value.forEach((item) => {

            const findItem = banList.find((elem) => elem.id == item.id)!;

            findItem.value = [
                new Date(`${ymdTime} ${item.start}`),
                new Date(`${ymdTime} ${item.end}`),
            ]

            selectList.push(item.id);


        })

        updateValue();


    }
})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

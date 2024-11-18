<template>
    <el-card class="box-card" :class="{ hide }">

        <template #header>
            <div class="card-header" @click="onClickCardHeader">
                <span class="name">{{ data.name || "" }}<span class="num">({{ data.value.length }})</span></span>
                <slot name="top-button"></slot>
            </div>
            <div class="card-header-two"  v-if="showMap">
                <map-button :item="data"/>
            </div>
        </template>

        <el-card class="box-item-card" v-for="itemChild in data.value" :key="itemChild.orderid">
            <slot :data="itemChild"></slot>
        </el-card>

    </el-card>

</template>

<script setup lang="ts">
import dayjs from "dayjs"
import mapButton from "global@/mapButton/index.vue"



const Emits = defineEmits<{
    (e: 'clickItem', value: any, all: boolean): void;
}>();

const Props = defineProps<{
    data: any,
}>();


const showMap = $computed(() =>{


    const { data } = Props;

    return !!(data.sndname || data.sndaddr || data.sndlocate)


})

let hide = $ref(true);


function onClickCardHeader() {
    hide = !hide;
}

function onClickExtract(item: any) {
    Emits("clickItem", item, false);
}
function onClickAllExtract() {
    Emits("clickItem", Props.data.value, true);
}

function getFormatTime(str: string) {
    return dayjs(str).format("MM-DD")
}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.oirder-item {
    padding: 0 10px !important;

    .order {
        width: 100px !important;
    }
}
</style>

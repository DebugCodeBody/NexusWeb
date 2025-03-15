<template>
    <collapse-item :data="item" :resize="onResize" :drag="draggable">
        <template #default="{ foodItem, MealTime }">
            <div class="flex justify-between" draggable="true">
                <van-checkbox v-model="foodItem.pack" shape="square" @click="onFoodCPackChange(foodItem, foodItem.pack)"
                    :label-disabled="submitDone">{{
                        foodItem.name
                    }}</van-checkbox>
                <div class="absolute right-1/3 reminder-tab">
                    <span><van-tag plain type="primary" v-if="submitDone && foodItem.pack">打包</van-tag></span>
                    <span><van-tag plain type="danger" v-if="!foodItem.submit">未提交</van-tag></span>
                </div>
                <div>
                    <foodStep v-model="foodItem.num" :data="foodItem.food"
                        @numChange="onNumChange(MealTime, foodItem, $event)" :min="0" />
                </div>
            </div>
        </template>

    </collapse-item>
</template>

<script setup lang="ts">
import { Resize } from "global@/Draggable/index.vue"
import { cartStore } from "@/store";

import collapseItem from "@/views/components/collapseItem.vue"
import foodStep from "@/views/components/foodStep.vue";



const Props = withDefaults(defineProps<{

    mdTime: Time,
    item: dateFoodCard,
    submitDone?: boolean,
    draggable?: boolean,
    disabledPack?: boolean
}>(), {
    submitDone: false,
    draggable: false,
    disabledPack: false
})

const cart = cartStore();

function onFoodCPackChange(item: foodCard, value: boolean) {
    if(Props.disabledPack){
        return;
    }
    cart.changePackFood(item, value);
}
function onNumChange(time: MealTime, item: foodCard, num: number) {
    cart.addDateFoot(Props.mdTime, time, item.food, item.attributes, item.specFoods, num);
}

function onResize(item: Resize<dateFoodCard>) {




    return false;


}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

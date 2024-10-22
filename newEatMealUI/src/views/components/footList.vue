<template>

    <collapse-item :data="item">
        <template #default="{ foodItem, MealTime }">
            <div class="flex justify-between">
                <van-checkbox v-model="foodItem.pack" shape="square"
                    @change="onFoodCPackChange(foodItem, foodItem.pack)" :label-disabled="submitDone">{{
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
import { cartStore } from "@/store";

import collapseItem from "@/views/components/collapseItem.vue"
import foodStep from "@/views/components/foodStep.vue";



const Props = withDefaults(defineProps<{

    mdTime: Time,
    item: dateFoodCard,
    submitDone?: boolean
}>(), {
    submitDone: false
})

const cart = cartStore();

function onFoodCPackChange(item: foodCard, value: boolean) {
    cart.changePackFood(item, value);
}
function onNumChange(time: MealTime, item: foodCard, num: number) {
    cart.addDateFoot(Props.mdTime, time, item.food, item.attributes, item.specFoods, num);
}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

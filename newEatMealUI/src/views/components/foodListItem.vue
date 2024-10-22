<template>
    <div class="flex justify-between">
        <van-checkbox v-model="pack" shape="square" @change="onFoodCPackChange(food, food.pack)"
            :label-disabled="submitDone">{{
                food.name
            }}</van-checkbox>
        <div class="absolute right-1/3 reminder-tab">
            <span><van-tag plain type="primary" v-if="submitDone && food.pack">打包</van-tag></span>
            <span><van-tag plain type="danger" v-if="!food.submit">未提交</van-tag></span>
        </div>
        <div>
            <foodStep v-model="num" :data="food.food" @numChange="onNumChange(mealTime, food, $event)" :min="0" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { cartStore } from "@/store";
import foodStep from "@/views/components/foodStep.vue";



const Props = withDefaults(defineProps<{
    food: foodCard,
    mealTime: MealTime,
    YMD: Time,
    submitDone?: boolean
}>(), {
    submitDone: false
});


const cart = cartStore();

const num = computed({
    get() {
        return Props.food.num
    },
    set(value) {

    }
})
const pack = computed({
    get() {
        return Props.food.pack
    },
    set(value) {


    }
})




function onFoodCPackChange(item: foodCard, value: boolean) {
    cart.changePackFood(item, value);
}
function onNumChange(time: MealTime, item: foodCard, num: number) {
    cart.addDateFoot(Props.YMD, time, item.food, item.attributes, item.specFoods, num);
}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

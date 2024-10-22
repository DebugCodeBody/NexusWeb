<template>

    <div class="food-list">
        <template v-for="(item, index) in data" :key="index">
            <div class="mb-5px meal-time-container" v-if="item.length">
                <div class="mb-5px" style="color:black">
                    <div></div>
                    <span>{{ time.MealTimeArr[index].key }}</span>
                </div>
                <div :class="listClass">
                    <div v-for="food in item" :key="food.name + index" class="py-5px relative item">
                        <slot :foodItem="food" :MealTime="index"></slot>
                        
                    </div>
                </div>
            </div>
        </template>
    </div>

</template>

<script setup lang="ts">
import { timeStore } from "@/store";


const Props = withDefaults(defineProps<{
    data: dateFoodCard,
    listClass?: string
}>(), {

});

const time = timeStore();



</script>

<script lang="ts">
export default {
    name: "collapse-item"
}
</script>

<style lang="scss">

</style>

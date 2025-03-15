<template>
    <div class="food-list">
        <template v-for="(item, index) in data" :key="index">
            <div class="mb-5px meal-time-container" v-if="item.length">
                <div class="mb-5px" style="color:black">
                    <span>{{ time.MealTimeArr[index].key }}</span>
                </div>
                <div :class="listClass">

                    <draggable :data="item" :itemkey="'name'" :bind="item" :resize="onResize" v-if="drag">
                        <template #default="{ element }">
                            <div class="py-5px relative item">
                                <slot :foodItem="element" :MealTime="index"></slot>
                            </div>
                        </template>

                    </draggable>
                    
                    <template v-for="(dataItem,dataIndex) in item" :key="dataIndex" v-else>
                        <div class="py-5px relative item" >
                            <slot :foodItem="dataItem" :MealTime="index"></slot>
                        </div>
                    </template>


                    
    

                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import Draggable, { Resize } from "global@/Draggable/index.vue"

import { timeStore } from "@/store";




const Props = withDefaults(defineProps<{
    data: dateFoodCard,
    listClass?: string,
    /**  */
    drag?:boolean
}>(), {
    drag: false
});

const time = timeStore();


function onResize(item: Resize<dateFoodCard>) {


    let retVal = false; 
    if(window.itemResize){
        retVal = !!window.itemResize(item);
    }

    return retVal;
    
    
    



}



</script>

<script lang="ts">
export default {
    name: "collapse-item"
}
</script>

<style lang="scss">
#app {
    position: relative;
}
</style>

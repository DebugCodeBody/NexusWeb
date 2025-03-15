<template>
    <div class="w-full p-10px mb-10px rounded-10px flex flex-wrap overflow-y-auto food-block ">
        <div class="w-1/2 mb-10px food-item-block " v-for="item in foodList" :key="item.name"
            @click="onClick(item)">
            <div class="rounded-5px p-5px h-full food-item">
                <div class="mb-10px text-16px overflow-hidden show-name">
                    <span>{{ item.showName }}</span>
                </div>
                <div>
                    <div class="flex justify-between items-end">
                        <span>
                            <span class="text-0.85em price">{{ item.showPrice }}</span>
                        </span>
                        <div>
                            <div class="raw-container" v-if="item.cartNum == 0 && item.raw.length > 0">
                                <p v-for="(rowItem, index) in item.raw" :key="index">{{ rowItem }}
                                </p>
                            </div>
                            <span class="text-16px" v-if="item.cartNum > 0">
                                <van-tag plain type="primary">已选购：{{ item.cartNum }}</van-tag>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">

const Emit = defineEmits<{
    (e: 'click', value: reFood): void;
}>();


const Porps = defineProps<{
    foodList: reFood[]
}>();



function onClick(item: reFood) {
    Emit("click", item);
}





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

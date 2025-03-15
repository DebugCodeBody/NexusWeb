<template>
    <div class="h-full flex flex-col overflow-hidden">
        <slot name="header"></slot>

        <div class="flex-1 overflow-hidden" :class="{
            'hidden-collapse': !showTime,
            'hidden-pack-check': !showPack,
        }" v-if="dataList.length">
            <div class="h-full overflow-auto pb-50px">
                <van-collapse v-model="activeNames" ref="collapse">
                    <van-collapse-item v-for="[key, value] in dataList" :key="key.YMD">
                        <template #title>
                            <div v-if="Slots.title">
                                <slot name="title" :item="key"></slot>
                            </div>
                            <div v-else>{{ key.MD }} {{ key.week }}</div>
                        </template>
                        <slot :mdTime="key" :item="value"></slot>
                    </van-collapse-item>
                </van-collapse>
            </div>

        </div>

        <div class="flex-1" v-else>
            <slot name="empty"></slot>
        </div>

        <div class="footer-area h-50px" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">

const Slots = useSlots();

const Props = withDefaults(defineProps<{
    dataList: Array<[Time, dateFoodCard]>,
    showTime?: boolean,
    showPack?: boolean,
    submitDone?: boolean
}>(), {
    showTime: true,
    showPack: true,
    submitDone: false,
})

const activeNames = $ref([]);
const collapse = ref();


function toggleAll() {
    if(collapse.value){
        collapse.value.toggleAll();
    }
}




onMounted(() => {
    toggleAll()
})

defineExpose({
    toggleAll
})



</script>

<script lang="ts">
export default {
    name: "item-collapse"
}
</script>

<style lang="scss">
.footer-area {
    background-color: white;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);

    .van-action-bar {
        padding-top: 0;
    }
}


.hidden-collapse {

    .van-collapse-item__title,
    .hidden-pack-check .van-checkbox__icon {
        display: none;
    }

    // .van-stepper__minus,
    // .van-stepper__plus,
    // .van-checkbox__icon {
    //     display: none;
    // }
}


.van-collapse-item {

    background-color: white;

    .van-collapse-item__title {
        padding: 10px 10px 10px 5px;
        font-weight: 700;
    }

    .van-collapse-item__title--expanded:after {
        display: none;
    }

    .van-collapse-item__wrapper {
        .van-collapse-item__content {
            padding-top: 0;
            padding-bottom: 0;
        }
    }


    .van-collapse-item--border:after {
        width: 100%;
        left: 0;
    }


}
</style>

import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, useAttrs } from "vue"



const selectItem = ref<good>({} as good );

const allItem = reactive<Record<string | number, goods>>({});



export {
    selectItem,
    allItem
}

import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"


const allItem = reactive<PreData>({} as PreData);
const selectItem = ref<task>({} as task);
const selectType = ref<"demand" | "task">("demand");

  
export {
    allItem,
    selectItem,
    selectType

}
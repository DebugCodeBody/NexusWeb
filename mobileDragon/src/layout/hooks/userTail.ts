import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';



const dialogTail = ref(false);
const tailForm = ref();
const tailing = ref()
const tailerror = ref("")

export {
    dialogTail,
    tailForm,
    tailing,
    tailerror
}

import "viewerjs/dist/viewer.css";
import viewerjs from "viewerjs";

import { ref, reactive, computed, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import type { UploadFile, UploadFiles, UploadUserFile } from "element-plus";


let viewer: Viewer | undefined = undefined;
const imgView = computed({
    get() {

        viewer = new viewerjs(document.querySelector(".el-upload-list")!, {
            inline: false,
            toolbar: false,
            title: false,
            navbar: false,
            button: false,
            transition: false,
            zIndexInline: 9999
        });

        return viewer;

    },
    set() {

    }
})


const ruleForm = reactive<{
    name: string
    barcode: string
    describe: string
    num: number,
    tight:boolean
}>({
    name: "",
    barcode: "",
    describe: "",
    num: 1,
    tight:false
})


const fileList = ref<UploadUserFile[]>([] as UploadUserFile[])
const updateDisabled = computed(() => {
    return fileList.value.length > 0;
});



const submitDone = ref(false);

export {
    ruleForm,
    imgView,
    fileList,
    updateDisabled,
    submitDone

}
import { paskType, paskTypes } from "@/module/paskType"
import { paskSetps } from "@/module/paskStep"

import paskStateEnum from "@/enums/paskStateEnum"

import { Dialog, seleItem, paskList, salename } from "./data"
import { shallowReactive, shallowRef, ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

const allLable = "全部";

const searchDialog = ref(false);
const searchName = ref(allLable);


const label = ref<paskStateEnum>();
const name = ref(String.Empty);
const order = ref(String.Empty);
const dateTime = ref([]);

const from = reactive({
    name,
    label,
    order,
    dateTime
})



watch(searchName, (value) => {
    const all = value == allLable;
    paskList[paskStateEnum.TRACK].forEach((elem: paskType) => {
        elem.show = (elem.salname == value || all);
    })
})

const checklabel = (rule: any, value: any, callback: any) => {
    if (value != undefined && value >= 1) {
        callback();
    } else {
        callback(new Error("请选择搜索范围"))
    }
}


const fromRules = reactive({
    label: [{ validator: checklabel, trigger: 'change' }]
})


const searchResult = ref<paskTypes>([]);



export {
    searchDialog,
    searchName,

    searchResult,
    label,
    name,
    order,
    dateTime,
    from,
    fromRules
}
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { productStep } from "@/api"


const stepMap = new WeakMap();
const nextProcess = ref();
const invoice = ref();


const stepDic: Record<string | number, { title: string, name: string }> = {
    "1": {
        title: "申请采购",
        name: "转待采购"
    },
    "2": {
        title: "采购中",
        name: "转采购中"
    },
    "3": {
        title: "已采购",
        name: "转已采购"
    },
    "99": {
        title: "留言",
        name: "留言"
    }
}




function getStep(item: good): Promise<steps> {

    return new Promise((resolve, reject) => {

        if (stepMap.has(item)) {
            return resolve(stepMap.get(item));
        }

        productStep(item.id).then((data: steps) => {
            stepMap.set(item, data);
            resolve(data);

        }).catch(reject)

    })

}




export {
    nextProcess,
    invoice,
    getStep,


    stepDic
}

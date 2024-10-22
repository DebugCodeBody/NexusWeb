import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { problemStep } from "@/api"


const stepMap = new WeakMap();
const nextProcess = ref();



function getStep(item: task): Promise<steps> {

    return new Promise((resolve, reject) => {

        if (stepMap.has(item)) {
            return resolve(stepMap.get(item));
        }

        problemStep(item.expid).then((data: steps) => {
            stepMap.set(item, data);
            resolve(data);

        }).catch(reject)

    })

}




export {
    nextProcess,
    getStep
}

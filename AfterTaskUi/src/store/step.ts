import { defineStore } from "pinia"
import { getStep } from "@/api"



interface STATE {
    data: WeakMap<TaskCard, steps>
}


const state: STATE = {
    data: new WeakMap()
}




export const stepStore = defineStore('step', {
    state() {
        return state
    },
    actions: {
        async getStep(item: TaskCard) {

            if (this.data.has(item)) {
                return this.data.get(item)!;
            }

            const resopnse = await getStep(item.taskid)
            this.data.set(item, resopnse);

            return resopnse;

        }
    }
})
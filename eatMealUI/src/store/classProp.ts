import { defineStore } from "pinia";
import { getClass } from "@/api"

type STATE = {
    table: Map<string, Awaited<ReturnType<typeof getClass>>>
};

const state: STATE = {
    table: new Map()
}

export const propStore = defineStore("prop", {
    state() {
        return state;
    },
    actions: {
        async getProp(name: string) {
            let retVal = this.table.get(name);

            if (!retVal) {
                retVal = await getClass(name);

                this.table.set(name, retVal);
            }
            return retVal
        }
    }
})

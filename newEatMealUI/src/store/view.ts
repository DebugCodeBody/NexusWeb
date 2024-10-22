import { defineStore } from "pinia";
import { getPathSearch } from "@/utils/urlSearch"




const state = {
    path: getPathSearch() || "declare"
}



export default defineStore("view", {
    state() {
        return state;
    },
    actions: {

        toView(toPath: string) {
            this.path = toPath;
        }
    }


})
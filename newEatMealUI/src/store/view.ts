import { defineStore } from "pinia";
import { getPathSearch } from "@/utils/urlSearch"




const state = {
    last: "",
    path: getPathSearch() || "declare",
    fcardid: "",
    license: false
}



export default defineStore("view", {
    state() {
        return state;
    },
    actions: {

        toView(toPath: string) {
            
            this.last = this.path;
            this.path = toPath;
            
        },
        toLast(){

            this.path = this.last;
        }
    }


})
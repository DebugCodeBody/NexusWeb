import { defineStore } from "pinia"

interface STATE {
    item: TaskCard,
    selected: boolean,

}


const state: STATE = {

    item: {} as TaskCard,
    selected: false,

}




export const selectStore = defineStore('select', {
    state() {
        return state
    },

    actions: {

    }
})
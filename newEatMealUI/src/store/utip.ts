import { defineStore } from "pinia";


const state: any = {
    nextWeek: {},
    nowWeek: {},
}

export default defineStore("utip", {

    state() {
        return state;
    },
    getters: {
        next(): boolean {
            return this.getBool(this.nextWeek)
        },
        now(): boolean {
            return this.getBool(this.nowWeek)
        }
    },
    actions: {

        getBool(arr: {
            [key: string]: number[]
        }) {

            return Object.values(arr).some((elem) => {
                return elem.some((value) => value == 1)
            })

        }


    }





})
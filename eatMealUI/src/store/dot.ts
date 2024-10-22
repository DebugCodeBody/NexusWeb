import { defineStore } from "pinia";
import { getUtip } from "@/api"
import { timeStore } from "@/store/time"

type STATE = Record<string, Array<boolean>>;

const state: STATE = {

    /**
     * 下周
     */
    next: [false],

    /**
     * 本周
     */
    schedu: [false],


    submit: [false]

}



export const dotStore = defineStore("dot", {
    state() {
        return state;
    },
    actions: {
        async init(date: string) {
            try {
                const result = await getUtip(date) as any;

                if(Object.keys(result).length == 0){
                    return;
                }

                const time = timeStore();

                const { next } = result;

                delete result.next;

                Object.assign(this, result);

                if (next != null && !time.next) {
                    this["next"][0] = next
                }

                this.schedu[0] = !this.schedu[0];

            } catch (error) {

                console.log(error);

            }

        },

        set(date: string, time: number, val: boolean) {
            const storeTime = timeStore();


            const timeItem = storeTime.nowWeek.concat(storeTime.nextWeek).find((elem) => {
                return elem.str == date
            })!


            date = timeItem.date;

            if (this[date] && this[date][time] != null) {
                this[date][time] = val;
            }
        }

    }
})

import { defineStore } from "pinia";






const state = {
    casual: {} as {
        [key: string]: boolean
    }

}


const store = defineStore("auto", {
    state() {

        return state;
    },
    getters: {

    },
    actions: {


    }

});


export default store;

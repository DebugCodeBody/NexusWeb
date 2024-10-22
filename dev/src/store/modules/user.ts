import { defineStore } from "pinia";
import { removeToken } from "@/utils/auth"


interface state {
    token: string,
    name: string,
    avatar: string,
    introduction: string,
    roles: string[]
}


const state: state = {
    token: "",
    name: '',
    avatar: '',
    introduction: '',
    roles: []
}


export default defineStore('user', {
    state() {
        return state
    },
    actions: {
        resetToken(){
            
            this.token = "";
            this.roles = [];
            removeToken();

        }

    },
})
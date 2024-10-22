import { getToken ,setToken} from "@/utils/auto"
import { login } from "@/api/user"


import { defineStore } from 'pinia'

const state: Record<string, string> = {
    "token": getToken()
}


export default defineStore('user', {
    state(){
        return state
    },
    actions:{
        async login(username:string,password:string){
            
            return login(username,password).then((result:any)=>{
                const { token } = result;

                setToken(token);
                this.token = token;

            })

        }
    }
})
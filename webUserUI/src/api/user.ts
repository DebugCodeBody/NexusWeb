import request from "@/utils/request"



export function login(username:string,password:string) {
    return request({
        url: "/login",
        method: "get",
        params: { username ,password}
    })

}

export function dinglogin(code:string) {
    return request({
        url: "/login",
        method: "get",
        params: { code }
    })

}

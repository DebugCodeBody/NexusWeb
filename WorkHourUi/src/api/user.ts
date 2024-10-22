import request from "@/utils/request"



export function login(code: string) {
    return request({
        url: "/login",
        method: "get",
        params: { code }
    })

}

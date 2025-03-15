import request from "@/utils/request";




export function bindPhone(code: string, username: string, password: string) {
    return request({
        url: "/login/bind",
        method: "post",
        data: {
            code,
            username,
            password
        }
    })
}
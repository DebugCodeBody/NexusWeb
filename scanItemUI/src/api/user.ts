import request from "@/utils/request"

let baseUrl = "";
if (process.env.NODE_ENV == "production") {
    baseUrl = `${location.origin}/ding`
}



export function login(code: string) {
    return request({
        url: "/login",
        method: "get",
        params: { code }
    })

}


export function getInfo() {
    return request({
        url: `${baseUrl}/auto/info`
    }) as unknown as Promise<userInfo>
}


export function dingToken(corpId: string, code: string) {
    return request({
        url: `${baseUrl}/auto/code/login`,
        params: {
            code,
            corpId
        }
    }) as unknown as Promise<userInfo>
}

export function tokenLogin(user: string) {
    return request({
        url: `${baseUrl}/auto/code/login`,
        params: {
            user
        }
    }) as unknown as Promise<userInfo>
}
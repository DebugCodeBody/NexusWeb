import request from "@/utils/request"

const baseUrl = process.env.NODE_ENV == "development" ? "" : `${location.origin}/ding`

export function login(code: string) {
    return request({
        url: `${baseUrl}/auto/info`,
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


export function getCorpId() {
    return request({
        url: `${baseUrl}/auth/corpid`,
    }) as unknown as Promise<string[]>
}


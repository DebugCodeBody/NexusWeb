import request from "@/utils/request"


const baseUrl = process.env.NODE_ENV == "development" ? "" : ".."

export function login(code: string) {
    return request({
        url: "/login",
        method: "get",
        params: { code }
    })

}

export function autoLogin(corpId: string, code: string) {

    return request({
        url: `${baseUrl}/auto/code/login`,
        params: {
            corpId,
            code
        }
    })

}

export function tokenLogin(user: string) {
    return request({
        url: `${baseUrl}/auto/code/login`,
        params: {
            user
        }
    })
}

export function getInfo() {
    return request({
        url: `${baseUrl}/auto/info`
    })
}



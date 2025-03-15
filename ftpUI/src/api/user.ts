import request from "@/utils/request"

const baseUrl = process.env.NODE_ENV == "development" ? "" : ".."

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




export function wxOauthLogin(code: string, appid?: string) {

    return request({
        url: `${baseUrl}/auth/wxapp/oauth2/login`,
        params: {
            code, appid
        }
    });

}

export function wxCodeLogin(code: string) {

    return request({
        url: `${baseUrl}/auth/wxapp/code/login`,
        params: {
            code
        }
    });

}



export function getWxInfo() {
    return request({
        url: `${baseUrl}/auth/wxapp/info`
    }) as unknown as Promise<userInfo>
}



export function wxOauthBind(code: string, phone: string) {

    return request({
        url: `${baseUrl}/auth/wxapp/oauth2/bind`,
        params: {
            code,
            phone
        }
    });

}

export function wxCancel() {
    return request({
        url: `${baseUrl}/auth/wxapp/logcancel`
    });
}



export function authLogin(token: string) {
    return request({
        url: `${baseUrl}/auth/wxapp/authorization/login`,
        params: {
            token
        }
    }) as unknown as Promise<userInfo>
}

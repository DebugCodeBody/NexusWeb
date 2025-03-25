import request from "@/utils/request"

type user = {
    name: string,
    token: string,
    nickname: string
}


export function login(code: string, type: string | number) {
    return request({
        url: `/auth/wxapp/login`,
        params: {
            code: encodeURIComponent(code),
            type: type || null
        }
    }) as any as Promise<user>
}

export function logOut() {
    return request({
        url: `/auth/wxapp/logout`
    })
}

export function logCancel() {
    return request({
        url: `/auth/wxapp/logcancel`
    })
}



export function bindPhone(code: string, nickname: string, username: string, password: string) {
    return request({
        url: `/auth/wxapp/login`,
        method: 'POST',
        data: {
            code,
            nickname,
            username,
            password
        }

    }) as any as Promise<user>
}


export function getAuthTempToken() {
    return request({
        url: `/auth/wxapp/authorization/get`
    }) as any as Promise<string>
}







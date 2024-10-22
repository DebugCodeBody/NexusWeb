import axios from "axios";

export const loginUrl = `${location.origin}/ding/auth`;

const request = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "" : loginUrl
});

request.interceptors.response.use(

    response => {
        const res = response.data
        if (res.code !== 200) {
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res.data;
        }
    },
    error => {
        if (error.message == "Network Error") {
            error.message = "网络连接失败！"
        } else {
            if (error.response.status == 500) {
                error.message = "请求失败，请稍后重试"
            }
        }

        return Promise.reject(error)
    }
)


export function getInfo() {
    return request({
        url: `/info`
    }) as unknown as Promise<userInfo>
}

export function dingToken(corpId: string, code: string) {
    return request({
        url: `/login`,
        params: {
            code,
            corpId
        }
    }) as unknown as Promise<userInfo>
}

export function dingCodeLogin(corpId: string, code: string) {
    return request({
        url: `/login`,
        params: {
            code,
            corpId
        }
    }) as unknown as Promise<userInfo>
}

export function tokenLogin(user: string) {
    return request({
        url: `/login`,
        params: {
            user
        }
    }) as unknown as Promise<userInfo>
}


export function getCorpId() {
    return request({
        url: `/corpid`,
    }) as unknown as Promise<string[]>
}



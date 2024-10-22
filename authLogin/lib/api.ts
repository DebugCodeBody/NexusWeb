import axios from "axios";
import { setLoginError } from "./storage";


let baseURL = "";

if (process.env.NODE_ENV == "development") {
    baseURL = "./api/auth"
} else {
    baseURL = `${location.origin}/ding/auth`
}

const request = axios.create({
    baseURL
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

        let message = "";

        if (error.message == "Network Error") {
            message = "网络连接失败！"
        } else {

            const { response } = error;
            const { status, data } = response;

            let { msg } = data;
            if (status == 500) {
                message = "请求失败，请稍后重试";
            } else if (status == 401) {
                message = msg;
            }
        }

        return Promise.reject(message)
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


export function toLogin(err: string) {

    setLoginError(err);

    if (process.env.NODE_ENV == "development") {
        location.href = `http://192.168.1.222/ding/auth?redirect=${encodeURIComponent(location.href)}&message=${encodeURIComponent(err)}`;
    } else {
        location.href = `${baseURL}?redirect=${encodeURIComponent(location.href)}`;
    }


}









































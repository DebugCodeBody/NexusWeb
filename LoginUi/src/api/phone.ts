import axios from "axios";
import { messageError } from "@/utils/elementLib"

export const loginUrl = `${location.origin}/ding/auth/phone`;

const request = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "/api/phone" : loginUrl
});

request.interceptors.response.use(

    response => {
        const { code, msg, data } = response.data
        if (code!== 200) {
            if (msg) {
                messageError(msg)
            }
            return Promise.reject(new Error(msg || 'Error'))
        } else {
            return data;
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


export function sendSms(phone: string) {

    return request({
        url: "/sms/send",
        method: "post",
        data: {
            phone
        }
    }) as any as Promise<{
        captcha_key: string
    }>

}

export function smsLogin(phone: string, code: string, captcha_key: string) {

    return request({
        url: "/login/sms",
        method: "post",
        data: {
            phone,
            code,
            captcha_key
        }
    })

}
import request from "@/utils/request"

const baseUrl = process.env.NODE_ENV == "development" ? "" : `${location.origin}/ding`

export function sendSms(phone: string) {

    return request.post("/sms/send", {
        phone
    })

}

export function userLogin(phone: string, sms: string) {

    return request.post("/login", {
        phone,
        sms
    })

}
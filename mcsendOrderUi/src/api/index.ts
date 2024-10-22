import request from "@/utils/request";




export function getOrder() {
    return request({
        url: "/get"
    }) as any as Promise<any[]>
}


export function doneOrder() {
    return request({
        url: "/done"
    })
}
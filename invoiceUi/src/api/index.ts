import request from "@/utils/request";




export function getInfo() {
    return request({
        url: "/get"
    }) as any as Promise<{
        info: invoiceInfo
    }>
}


export function submitInfo(data: any) {
    return request({
        url: "/submit",
        method: "post",
        data
    })
}



export function getHistory() {
    return request({
        url: "/history"
    }) as any as Promise<invoiceInfo[]>
}
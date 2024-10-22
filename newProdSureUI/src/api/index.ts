import request from "@/utils/request";




export function getList() {
    return request({
        url: "/list"
    }) as any as Promise<tackOrdItem[]>
}


export function submitDone(order: string) {
    return request({
        url: "/done",
        params: {
            order
        }
    })
}
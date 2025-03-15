import request from "@/utils/request";




export function getList() {
    return request({
        url: "/list"
    }) as any as Promise<tackOrdItem[]>
}


export function createOvertime(data: any) {
    return request({
        url: "/create/overtime",
        method: "post",
        data
    })
}





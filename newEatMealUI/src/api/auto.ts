import request from "@/utils/request";


export function getList() {

    return request({
        url: "/automatic/list"
    }) as any as Promise<{
        list: any[],
        shop: any[]
    }>

}

export function Submit(data: any) {

    return request({
        url: "/automatic/submit",
        method: "post",
        data
    }) as any as Promise<any>


}
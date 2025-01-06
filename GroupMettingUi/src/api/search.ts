import request from "@/utils/request";



export function searchGet(data: any) {
    return request({
        url: "/search/get",
        method: "post",
        data
    }) as any as Promise<{
        count: any[],
        view: mettItems
    }>

}



export function searchExport(data: any) {

    return request({
        url: "/search/export",
        method: "post",
        data
    }) as any as Promise<mettItems>

}


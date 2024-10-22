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


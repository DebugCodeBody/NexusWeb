import request from "@/utils/request";




export function queryOrder(data:any) {
    return request({
        url: "/query",
        method: "post",
        data
    }) as any as Promise<orderResult>
}


export function submitData(data:any) {
    return request({
        url: "/submit",
        method: "post",
        data
    }) as any as Promise<{
        status: boolean,
        errmsg: string,
        spec: string
    }>
}

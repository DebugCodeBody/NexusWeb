import request from "@/utils/request";




export function getList(status: number | string) {

    return request({
        url: "/audit/list",
        params: {
            status
        }
    }) as any as Promise<any[]>

}

export function setApproved(id: string, status: number | string) {

    return request({
        url: "/audit/approved",
        params: {
            id,
            status
        }
    }) as any as Promise<any[]>

}

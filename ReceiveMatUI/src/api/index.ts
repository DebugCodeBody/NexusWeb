import request from "@/utils/request";



export function scanMoid(moid: string) {

    return request({
        url: "/scan",
        params: {
            moid
        }
    }) as any as Promise<scanItem>

}


export function submitScan(moid: string, store: string) {
    return request({
        url: "/submit",
        method: "post",
        data: {
            moid,
            store
        }
    }) as any as Promise<{
        success: true,
        message: string
    }>
}
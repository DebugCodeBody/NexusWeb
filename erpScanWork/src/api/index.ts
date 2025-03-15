import request from "@/utils/request";


export function submitScan(moid: string) {
    return request({
        url: "/scan",
        method: "post",
        data: {
            moid 
        }
    }) as any as Promise<scanResult>
}
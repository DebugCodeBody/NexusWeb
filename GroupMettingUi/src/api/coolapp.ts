import request from "@/utils/request";


export function getSignature(url: string) {
    return request({
        url: "../signature",
        params: {
            url
        }
    }) as Promise<any>
}
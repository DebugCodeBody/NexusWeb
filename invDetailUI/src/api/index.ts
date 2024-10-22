import request from "@/utils/request";




export function getInfo(id: string, key: string) {
    return request({
        url: "/get",
        params: {
            id,
            key
        }
    }) as any as Promise<tackOrdItem[]>
}


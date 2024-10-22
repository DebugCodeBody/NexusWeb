import request from "@/utils/request"


export function getJson(id: string) {
    return request({
        url: `/json/${id}`
    }) as unknown as Promise<{
        name: string,
        data: string
    }>



}
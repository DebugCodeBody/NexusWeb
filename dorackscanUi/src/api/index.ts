import request from "@/utils/request";




export function getList() {
    return request({
        url: "/list"
    }) as any as Promise<tackOrdItem[]>
}


export function submit(text: string) {
    return request({
        url: "/submit",
        params: {
            text
        }
    })
}
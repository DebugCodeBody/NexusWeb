import request from "@/utils/request"



export function getNotice() {
    return request({
        url: "/notice/get"
    }) as any as Promise<any>
}

export function setNotice(value: string, date: string[]) {
    return request({
        url: "/notice/set",
        method: "post",
        data: {
            value,
            date
        }
    }) as any as Promise<any>
}
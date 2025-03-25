import request from "@/utils/request";




export function create(data: any) {
    return request({
        url: "/create",
        method: "post",
        data
    })
}

export function uploadImg(data: any) {
    return request({
        url: "../media/upload/img",
        method: "post",
        data
    }) as unknown as Promise<string>
}
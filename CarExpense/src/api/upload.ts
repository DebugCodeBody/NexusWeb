import request from "@/utils/request"

const baseUrl = process.env.NODE_ENV == "development" ? "" : `${location.origin}/ding`



export function uploadImg(data: FormData) {
    return request({
        url: `${baseUrl}/media/upload/img`,
        method: "post",
        data
    }) as any as Promise<string>
}

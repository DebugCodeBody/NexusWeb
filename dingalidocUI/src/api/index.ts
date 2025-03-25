import request from "@/utils/request";




export function Get(id: string | number) {
    return request({
        url: `/get/${id}`
    }) as any as Promise<{
        page: number[],
        desc: documentDesc,
        isUpload: boolean
    }>
}



export function getDocUrl(id: string, page: string) {
    return request({
        url: `/getdoc/${id}/${page}`
    }) as any as Promise<string>
}





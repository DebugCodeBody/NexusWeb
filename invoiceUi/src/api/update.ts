import request from "@/utils/request";




export function getFile(order: string, hash: string) {
    return request({
        url: "/pdf/get",
        params: {
            order,
            hash
        }
    }) as any as Promise<pdfItem[]>
}

export function uploadFile(file: any) {

    return request({
        url: "../media/upload/file",
        method: "post",
        data: file
    }) as any as Promise<string>

}

export function updateFile(solid: number, name: string, path: string, memo: string) {

    return request({
        url: "/pdf/set",
        method: "post",
        data: {
            solid,
            name,
            path,
            memo
        }
    }) as any as Promise<any>

}
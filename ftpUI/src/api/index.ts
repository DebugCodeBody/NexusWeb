import request from "@/utils/request";




export function getFileList(order: string) {
    return request({
        url: "/file",
        params: {
            order
        }
    }) as any as Promise<{
        fileList: string[],
        folderList: string[]
    }>
}

export function download(order: string, name: string) {
    return request({
        url: "/download",
        params: {
            order,
            name
        }
    })
}


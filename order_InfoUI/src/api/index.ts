import request from "@/utils/request"


export function getProcess(order: string | string[]) {
    return request({
        url: `/process/${order}`
    }) as unknown as Promise<workInfo>

}


export function getProdsure(order: string | string[]) {
    return request({
        url: `/prodsure/${order}`
    }) as unknown as Promise<workInfo>

}

export function getOrdGetAtta(order: string | string[]) {
    return request({
        url: `/detailed/atta/${order}`
    }) as unknown as Promise<workInfo>
}

export function getFilePath(order: string | string[]) {
    return request({
        url: `/detailed/dir`
    }) as unknown as Promise<{
        dir: string
    }>
}




export function getBeiliao(order: string) {

    return request({
        url: `/beiliao/get`,
        params: {
            order
        }
    }) as unknown as Promise<any[]>

}
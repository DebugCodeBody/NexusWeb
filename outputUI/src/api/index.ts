import request from "@/utils/request";




export function getDeclare() {
    return request({
        url: "/declare/get"
    }) as any as Promise<declareInfo[]>
}


export function createDeclare(data: any) {
    return request({
        url: "/declare/create",
        method: "post",
        data
    }) as any as Promise<any>
}


export function getView() {

    return request({
        url: "/view/get"
    }) as any as Promise<viewInfo[]>

}
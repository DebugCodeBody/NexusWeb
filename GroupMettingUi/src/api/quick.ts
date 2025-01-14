import request from "@/utils/request";



export function setTrack(id: number | string, track: string) {
    return request({
        url: "/quick/setTrack",
        method: "post",
        data: {
            id,
            track
        }
    }) as any as Promise<{
        noSet: boolean
    }>
}

export function endView(id: number | string, track = "") {
    return request({
        url: "/quick/end",
        method: "post",
        data: {
            id,
            track
        }
    }) as any as Promise<{
        auth: boolean
    }>

}




export function setMark(id: number | string) {
    return request({
        url: "/quick/setMark",
        method: "post",
        data: {
            id
        }
    }) as any as Promise<{
        auth: boolean
    }>

}


export function endPropose(id: number | string, result: string){

    return request({
        url: "/quick/endPropose",
        method: "post",
        data: {
            id,
            result
        }
    }) as any as Promise<{
        auth: boolean
    }>

}



export function isGetNext() {
    return request({
        url: "/quick/isGetNext",
    }) as any as Promise<boolean>
}

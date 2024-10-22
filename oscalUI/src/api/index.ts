import request from "@/utils/request";



export function getReasons() {

    return request({
        url: "/reasons"
    }) as any as Promise<{
        name:string,
        is_img: boolean,
        is_prefix: boolean
    }[]>
}


export function setSubmit(moid: string, supid: string, data: any) {
    return request({
        url: "/submit",
        method: "post",
        params: {
            moid,
            supid
        },
        data
    })
}

export function getTrackLog(moid: string, supid: string) {

    return request({
        url: "/log",
        params: {
            moid,
            supid
        }
    }) as any as Promise<logItem[][]>
}

export function findSupid(supid: string) {

    return request({
        url: "/find",
        params: {
            supid
        }
    }) as any as Promise<boolean>
}

export function osupDone(moid: string, supid: string) {

    return request({
        url: "/done",
        params: {
            moid,
            supid
        }
    }) as any as Promise<{
        result:string
    }>
}
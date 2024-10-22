import request from "@/utils/request";



export function getProcess(moid: string) {

    return request({
        url: "/process",
        params: {
            moid
        }
    }) as any as Promise<proceeItems>

}

export function Submit(seq: number, process: string, stid: string) {

    return request({
        url: "/submit",
        method: "post",
        data: {
            seq,
            process,
            stid
        }
    }) as any as Promise<submitResult>
}

export function getRackList() {
    return request({
        url: "/rack/list",
        method: "get"
    }) as any as Promise<any[]>
}

export function getRackStore(name: string) {
    return request({
        url: "/rack/store",
        params: {
            name
        },
        method: "get"
    }) as any as Promise<any[]>
}
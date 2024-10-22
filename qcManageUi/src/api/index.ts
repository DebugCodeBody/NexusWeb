import request from "@/utils/request";




export function scan(moid: string) {
    return request({
        url: "/scan",
        params: {
            moid
        }
    }) as any as Promise<{
        process: processItem[],
        reason: reasonItem[],
        badness: nameItem[],
        msg: string,
        wran: string,
        match: string[]
    }>
}

export function match(moid: string) {
    return request({
        url: "/match",
        params: {
            moid
        }
    }) as any as Promise<string>
}


export function submitResult(moid: string, state: number, process: number, reason: string, badness: string, next: string) {
    return request({
        url: "/result",
        method: "post",
        data: {
            moid,
            state,
            process,
            reason,
            badness,
            next
        }
    }) as any as Promise<{
        success: boolean,
        msg: string,
        next: string,
        warn: string
    }>
}
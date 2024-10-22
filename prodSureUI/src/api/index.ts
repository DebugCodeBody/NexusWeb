import type { AxiosPromise } from "axios";

import request from "@/utils/request"



export function salesLogin() {
    return request({
        url: "/sales/login"
    })
}


export function submit(data: FormData) {
    return request({
        url: "/submit",
        method: "post",
        data
    })
}



export function getAllPask() {
    return request({
        url: "/getallpask",
        method: "get"
    })

}


export function getPaskProcess(askid: number) {
    return request({
        url: "/getpaskprocess",
        method: "get",
        params: { askid }
    })
}

export function setPaskProcess(askid: number, stage: number, memo: string) {
    return request({
        url: "/setpaskprocess",
        method: "post",
        data: { askid, stage, memo }
    })
}

export function search(name: string, order: string, start: string, end: string) {
    return request({
        url: "/search",
        params: { name, order, start, end }
    })
}

/**
 * 留言
 * @param askid 
 * @param memo 
 */
export function SendGuestBook(askid: number, memo: string) {
    return request({
        url: "/guestbook",
        method: "post",
        data: { askid, memo }
    })
}

/**
 * 结案再转销售专员
 * @param askid 
 * @param memo 
 */
export function continPask(askid: number, memo: string) {
    return request({
        url: "/continpask",
        method: "post",
        data: { askid, memo }
    })
}


const baseUrl =  ".."

/**
 * 工单单号搜索
 * @param wd 
 * @returns 
 */
export function suggest(txt: string): Promise<remoteSearchs> {
    return request({
        url: baseUrl + "/onlineorder/search",
        params: {
            txt
        }
    }) as unknown as Promise<remoteSearchs>
}


/**
 * 通过moid获取到orderid
 * @param moid 
 * @returns 
 */
export function moidAndOrderid(moid: string): Promise<string> {
    return request({
        url: baseUrl + "/onlineorder/search",
        params: {
            moid
        }
    }) as unknown as Promise<string>

}

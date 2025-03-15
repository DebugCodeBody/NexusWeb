import request from "@/utils/request";



/** 获取类型 */
export function getType() {

    return request({
        url: "/getType"
    }) as any as Promise<string[]>

}

/** 获取刀具 */
export function getId(type: string) {

    return request({
        url: "/getId",
        params: {
            type
        }
    }) as any as Promise<{
        id: string,
        name: string
    }[]>

}

/** 获取历史 */
export function getLast() {

    return request({
        url: "/getLast"
    }) as any as Promise<{
        cid: number,
        ctype: string,
        pick_type: number
    }[]>

}

/** 提交申请 */
export function submit(type: string, id: string | number, ptype: number) {

    return request({
        url: "/submit",
        params: {
            id,
            type,
            ptype
        }
    }) as any as Promise<any>

}

import request from "@/utils/request"

/**
 * 搜索订单号，只能够二选一
 * @param txt 要搜索的订单内容
 * @param moid 要搜索的moid
 * @returns 
 */
export function search(txt?: string, moid?: string) {
    return request({
        url: `${location.origin}/ding/onlineorder/search`,
        params: {
            txt: txt || null,
            moid: moid || null
        }
    })

}


export function searchText(txt: string) {
    return search(txt);
}

export function searchMoid(moid: string) {
    return search(undefined, moid);
}
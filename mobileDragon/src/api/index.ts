import reqquest from "@/utils/request"


/**
 * 获取全部机器订单
 * @returns 
 */
export function getlist(): Promise<any> {
    return reqquest({
        url: "getlist",
        method: "get"
    })
}

/**
 * 刷新下一个订单
 * @returns 
 */
export function nextorder(): Promise<any> {
    return reqquest({
        url: "nextorder",
        method: "get"
    })
}

/**
 * 指定机器添加订单
 * @param mid 
 * @param seq 
 * @returns 
 */
export function addOrder(mid: number, seq: number): Promise<any> {
    return reqquest({
        url: "addorder",
        method: "get",
        params: { mid, seq }
    })
}

/**
 * 指定机器删除订单
 * @param mid 
 * @param seq 
 * @returns 
 */
export function deleOrder(mid: number, seq: number): Promise<any> {
    return reqquest({
        url: "deleorder",
        method: "get",
        params: { mid, seq }
    })
}

/**
 * 指定机器删除订单
 * @param mid 
 * @param seq 
 * @returns 
 */
export function addtail(seq: number, count: number): Promise<any> {
    return reqquest({
        url: "addtail",
        method: "get",
        params: { seq,count }
    })
}

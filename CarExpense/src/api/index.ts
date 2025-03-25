import request from "@/utils/request";




export function create(data: any) {
    return request({
        url: "/create",
        method: "post",
        data
    }) as any as Promise<any>
}
export function createTruck(data: any) {
    return request({
        url: "/create/truck",
        method: "post",
        data
    }) as any as Promise<string>
}


export function getList() {
    return request({
        url: "/getList"
    }) as any as Promise<carItem[]>
}

export function deleteItem(id: id) {
    return request({
        url: "/del",
        params: {
            id
        }
    }) as any as Promise<carItem[]>
}


export function startAudit(id: id[], img: string[]) {
    return request({
        url: "/startAudit",
        method: "post",
        data: {
            id,
            img
        }
    }) as any as Promise<string>
}

export function getAutSndList() {
    return request({
        url: "/getAutSndList"
    }) as any as Promise<autSnd[]>
}

export function getSupplier(order: string) {
    return request({
        url: "/getSupplier",
        params: {
            order
        }
    }) as any as Promise<supplier[]>
}


export function getPltPayCfg() {

    return request({
        url: "/getPltPayCfg"
    }) as any as Promise<{
        /** 铁通单价 */
        bmon: number,
        /** 卡板单价 */
        pmon: number
    }>

}


export function checkOrder(order:string) {

    return request({
        url: "/order/check",
        params: {
            order
        }
    }) as any as Promise<{
        name:string,
        custname: string
    }>

}
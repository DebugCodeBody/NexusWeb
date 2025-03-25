import request from "@/utils/request"


export function orderScan(order: string, type: string | number) {

    return request({
        url: `/nexus/wxapp/order/scan?order=${encodeURIComponent(order)}&type=${type}`,
        method: 'GET'
    })

}

export function sboOrderScan(order: string) {

    return request({
        url: `/nexus/wxapp/order/sbo/scan?order=${encodeURIComponent(order)}`,
        method: 'GET'
    })

}



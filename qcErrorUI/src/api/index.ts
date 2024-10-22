import request from "@/utils/request";


export function getErrorOrder() {
    return request({
        url: "/order"
    }) as unknown as Promise<errorOrders>
}

export function sendSubmit(data: any) {
    return request({
        url: "/record",
        method: "post",
        data
    }) as unknown as Promise<errorOrders>
}
import request from "@/utils/request";





export function searchMoid(moid: string) {

    return request({
        url: "../drawings/search/moid",
        params: {
            moid
        }
    }) as any as Promise<{
        title: string,
        url: string
    }[]>
}

export function searchOrder(orderid: string) {

    return request({
        url: "../drawings/search/order",
        params: {
            orderid
        }
    }) as any as Promise<{
        title: string,
        url: string
    }[]>

}
import request from "@/utils/request";



export function getAllOrder(type: number | string) {

    return request({
        url: "./btk/get",
        params: {
            type
        }
    })
}

export function getUn(name: string) {

    return request({
        url: "./btk/getUn",
        params: {
            name
        }
    })
}


export function orderUpdate(type: number, seq: string) {
    return request({
        url: "./btk/order",
        params: {
            type,
            seq
        }
    })
}

export function supUpdate(type: number, supid: string) {
    return request({
        url: "./btk/sup",
        params: {
            type,
            supid
        }
    })
}

export function orderExtract(order: string, data?: FormData) {
    return request({
        url: "./btk/extract",
        method: "post",
        params: {
            order
        },
        data
    })
}




export function setOut(order: string[]) {

    return request({
        url: "./btk/setout",
        method: "post",
        data: {
            order
        }
    })

}

export function cancelout(order: string[]) {

    return request({
        url: "./btk/cancelout",
        method: "post",
        data: {
            order
        }
    })

}
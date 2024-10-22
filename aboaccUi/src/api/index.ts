import request from "@/utils/request";




export function getHead(month: string | number, type: string | number) {
    return request({
        url: "./head",
        params: {
            month,
            type
        }
    }) as any
}

export function getHeadDetail(date: string | number, type: string | number) {

    return request({
        url: "./head/detail",
        params: {
            date,
            type
        }
    }) as any

}


export function getDeal(month: string | number, type: string | number) {

    return request({
        url: "./deal",
        params: {
            month,
            type
        }
    }) as any

}

export function getDealDetail(date: string | number, type: string | number) {

    return request({
        url: "./deal/detail",
        params: {
            date,
            type
        }
    }) as any

}





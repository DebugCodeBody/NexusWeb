import request from "@/utils/request";



export function getInfo() {
    return request({
        url: "./info"
    }) as any
}

export function setDelay(id: string, date: string) {
    return request({
        url: "./set/delay",
        method: "post",
        data: {
            id,
            date
        }

    }) as any
}


export function getDrawing(orderid: string) {
    return request({
        url: "../../onlineorder/drawings/search/order",
        params: {
            orderid
        }
    }) as any as Promise<string>
}

export function printPdf(moid: string, odid: string) {

    return request({
        url: "./print",
        params: {
            moid,
            odid
        }

    }) as any as Promise<{
        success: boolean,
        filename: string,
        err: string
    }>

}

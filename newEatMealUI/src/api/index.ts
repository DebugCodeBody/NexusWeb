import request from "@/utils/request";


export function getDateFood(date: string) {

    return request({
        url: "/food/list",
        params: {
            date
        }
    }) as any as Promise<{
        end: boolean,
        data: dayArray<{
            name: string,
            data: Datum[]
        }>,
        shop: dayArray<{
            name: string,
            pack: boolean,
            weight: number
        }>
    }>;

}


export function dataSubmit(data: any) {

    return request({
        url: "/data/submit",
        method: "post",
        data
    })

}


export function getTotleCost() {
    return request({
        url: "/cost"
    }) as any as Promise<any>

}


export function getWeekOrder(date: string) {
    return request({
        url: "/data/get",
        params: {
            date
        }
    })

}



export function getUtip() {
    return request({
        url: "/getUtip"
    }) as any as Promise<{
        nowWeek: {
            key: number[]
        },
        nextWeek: {
            key: number[]
        }
    }>

}
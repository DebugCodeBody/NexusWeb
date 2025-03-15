import request from "@/utils/request";


export function getUserInfo() {

    return request({
        url: "/getUserInfo"
    }) as any as Promise<{
        fcardid:string,
        license: boolean
    }>

}

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
    }) as any as Promise<any>

}

/** 取出当月的消费金额 */
export function getTotleCost() {
    return request({
        url: "/cost"
    }) as any as Promise<{
        cost: string
    }>

}

/** 取出这一周的点餐记录 */
export function getWeekOrder(date: string) {
    return request({
        url: "/data/get",
        params: {
            date
        }
    }) as any as Promise<{
        [key: string]: any
    }>

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


export function getSundayShow(now: boolean) {

    return request({
        url: "/getsunday",
        params: {
            now: now ? 1 : 0
        }
    }) as any as Promise<boolean>

}



export function getMealAmount(month: number | string) {
    return request({
        url: "/data/mealamount",
        params: {
            month
        }
    }) as any as Promise<{
        total: {
            allowance: string
            amount: string
            consume: string
        },
        list: {
            "MD": string,
            "work_date": string,
            "week": string,
            "list": {
                "name": string,
                "price": string,
                "num": string,
                "pack": {
                    "value": boolean,
                    "price": number
                }
            }[][],
            "allowance": string,
            "consume": string,
            "amount": string
        }[]
    }>
}


export function getShop(date: string){

    return request({
        url: "/getShop",
        params: {
            date
        }
    }) as any as Promise<any[]>

}
import request from "@/utils/request"



export function getDateFood(date: string) {

    return request({
        url: "/food/list",
        params: {
            date
        }
    }) as unknown as Promise<{
        data: foodData,
        shop: Array<orderItems>,
        end: boolean
    }>

}

export function dataSubmit(data: any) {

    return request({
        url: "/data/submit",
        method: "post",
        data
    })

}


export function getUtip(date: string) {
    return request({
        url: "/date/utip",
        params: {
            date
        }
    })

}

export function getWeekOrder(date: string) {
    return request({
        url: "/data/get",
        params: {
            date
        }
    })

}

export function getClass(name: string) {
    return request({
        url: "/class",
        params: {
            name
        }
    }) as any as Promise<{
        title: string,
        list: string[]
    }[]>

}


export function getTotleCost() {
    return request({
        url: "/cost"
    })

}


























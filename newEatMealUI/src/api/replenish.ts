import request from "@/utils/request";


export function check() {

    return request({
        url: "/replenish/check"
    }) as any as Promise<{
        "date": string,
        "week": string,
        "time": string,
        "list": boolean,
        "shopp": boolean,
        "next": boolean
    }>
}

export function add(data:any) {

    return request({
        url: "/replenish/add",
        method: "post",
        data
    }) as any as Promise<{
        list: any[],
        shop: any[]
    }>

}

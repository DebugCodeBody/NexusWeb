import request from "@/utils/request";


export function getHectic() {

    return request({
        url: "/hectic/get",
        method: "get"
    }) as any as Promise<any[]>

}


export function setHectic(data: any) {

    return request({
        url: "/hectic/set",
        method: "post",
        data
    })

}


export function getHecticList() {

    return request({
        url: "/hectic/list"
    }) as any as Promise<{
        name: string,
        data: {
            name: string,
            value: {
                id: string,
                start: string,
                end: string
            }[]
        }[]

    }[]>

}


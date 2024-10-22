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
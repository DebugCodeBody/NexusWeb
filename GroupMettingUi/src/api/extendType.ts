import request from "@/utils/request";


export function get() {

    return request({
        url: "/extendType/get",
        method: "get"
    }) as any as Promise<{
        id: number,
        name: string,
        user: string[]
    }[]>

}

export function add(data: any) {

    return request({
        url: "/extendType/add",
        method: "post",
        data
    }) as any as Promise<any>

}
export function edit(id: number, data: any) {

    return request({
        url: "/extendType/edit",
        method: "post",
        params: {
            id
        },
        data
    }) as any as Promise<any>

}
export function del(id: number) {

    return request({
        url: "/extendType/del",
        method: "post",
        data: {
            id: [id]
        }
    }) as any as Promise<any>

}
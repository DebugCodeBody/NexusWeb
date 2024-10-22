import request from "@/utils/request"


export function list() {
    return request({
        url: "/canteen/list"
    }) as unknown as Promise<canteenItems>
}



export function add(data: canteenItem) {
    return request({
        url: "/canteen/add",
        method: "post",
        data
    })
}

export function edit(data: canteenItem) {
    return request({
        url: "/canteen/edit",
        method: "post",
        data
    })
}


export function del(name: string) {
    return request({
        url: "/canteen/del",
        params: {
            name
        }
    })
}


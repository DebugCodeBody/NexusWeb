import request from "@/utils/request";


export function getList() {
    return request({
        url: "/polygon"
    }) as Promise<any>;
}




export function add(data: any) {
    return request({
        url: "/polygon/add",
        method: "post",
        data
    }) as Promise<any>;
}

export function edit(id: number | string, data: any) {
    return request({
        url: `/polygon/edit/${id}`,
        method: "post",
        data
    }) as Promise<any>;
}


export function del(id: number | string) {
    return request({
        url: `/polygon/del/${id}`
    }) as Promise<any>;
}





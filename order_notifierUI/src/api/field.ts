import request from "@/utils/request"



export function fieldAdd(data: any) {
    return request({
        url: `/field/add`,
        method: "post",
        data
    })
}


export function fieldDel(id: number) {
    return request({
        url: `/field/del/${id}`
    })
}

export function fieldEdit(id: number, data: any) {
    return request({
        url: `/field/edit/${id}`,
        method: "post",
        data
    })
}



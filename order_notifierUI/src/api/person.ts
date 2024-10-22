import request from "@/utils/request"



export function personAdd(data: any) {
    return request({
        url: `/person/add`,
        method: "post",
        data
    })
}


export function personDel(id: number) {
    return request({
        url: `/person/del/${id}`
    })
}

export function personEdit(id: number, data: any) {
    return request({
        url: `/person/edit/${id}`,
        method: "post",
        data
    })
}



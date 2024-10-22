import request from "@/utils/request"



export function deauserAdd(data: any) {
    return request({
        url: `/deauser/add`,
        method: "post",
        data
    })
}


export function deauserDel(id: number, name: string) {
    return request({
        url: `/deauser/del/${id}`,
        method: "post",
        data: {
            name
        }
    })
}

export function deauserEdit(id: number, origin:string,name: string) {
    return request({
        url: `/deauser/edit/${id}`,
        method: "post",
        data: {
            origin,
            name
        }
    })
}



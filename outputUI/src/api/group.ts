import request from "@/utils/request";




export function getGroup() {
    return request({
        url: "/group/get"
    }) as any as Promise<groupInfo[]>
}


export function addGroup(title: string) {
    return request({
        url: "/group/add",
        method: "post",
        data: {
            title
        }
    })
}
export function editGroup(id: number, title: string) {
    return request({
        url: "/group/add",
        method: "post",
        params: {
            id
        },
        data: {
            title
        }
    })
}
export function delGroup(id: string | number) {
    return request({
        url: "/group/del",
        params: {
            id
        }
    })
}
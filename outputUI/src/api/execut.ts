import request from "@/utils/request";




export function getGroup() {
    return request({
        url: "/user/get"
    }) as any as Promise<groupInfo[]>
}


export function addGroup(title: string) {
    return request({
        url: "/user/add",
        method: "post",
        data: {
            title
        }
    })
}
export function editGroup(id: number, title: string) {
    return request({
        url: "/user/add",
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
        url: "/user/del",
        params: {
            id
        }
    })
}

export function setWork(id: id, username: string, tight: boolean, info: string) {
    return request({
        url: "/user/setWork",
        method: "post",
        params: {
            id
        },
        data: {
            username,
            info,
            tight
        }


    })
}
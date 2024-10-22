import request from "@/utils/request"


export function groupCreate(name: string, hook: string) {
    return request({
        url: "/group/create",
        method: "post",
        data: {
            name,
            hook
        }
    })
}

export function groupGet() {


    return request({
        url: "/group/get"
    }) as unknown as Promise<Groups>
}

export function groupAdd(name: string, hook: string) {
    return request({
        url: "/group/Add",
        method: "post",
        data: {
            name,
            hook
        }
    }) as unknown as Promise<GroupInfos>
}

export function groupList() {
    return request({
        url: "/group/list",
    }) as unknown as Promise<GroupInfos>
}

export function groupDel(id: number) {
    return request({
        url: "/group/del",
        params: { id }
    }) as unknown as Promise<GroupInfos>

}

export function groupEdit(id: number, name: string, hook: string, color: string, is_withdraw: boolean, response_type: number, disabled: boolean) {
    return request({
        url: "/group/edit",
        method: "post",
        data: {
            id,
            name,
            hook,
            color,
            is_withdraw,
            response_type,
            disabled
        }
    }) as unknown as Promise<GroupInfos>

}

/** 添加负责人 */
export function userAdd(group: number, data: dUser) {
    return request({
        url: `/charge/create/${group}`,
        method: "post",
        data
    }) as unknown as Promise<GroupInfos>
}

/** 删除负责人 */
export function userDel(id: number) {
    return request({
        url: `/charge/del/${id}`
    }) as unknown as Promise<GroupInfos>
}

/** 编辑负责人 */
export function userEdit(id: number, data: dUser) {
    return request({
        url: `/charge/edit/${id}`,
        method: "post",
        data
    }) as unknown as Promise<GroupInfos>

}
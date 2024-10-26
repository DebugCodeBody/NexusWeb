import request from "@/utils/request";



export function getView(id: number | string) {
    return request({
        url: "/get",
        params: {
            id
        }
    }) as any as Promise<{
        label: number,
        data: mettItems
    }>

}


export function submitDone(order: string) {
    return request({
        url: "/done",
        params: {
            order
        }
    })
}

/** 判断当前群是否被注册 */
export function isExist(openConversationId: string) {

    return request({
        url: process.env.NODE_ENV == "development" ? "/coolapp/exist" : "../exist",
        params: {
            openConversationId
        }
    }) as any as Promise<boolean>
}

/** 获取组织人员和参与人员 */
export function getPrepare(openConversationId: string) {

    return request({
        url: "/getPrepare",
        params: {
            openConversationId
        }
    }) as any as Promise<{
        tissue: {
            name: string,
            tissue: string[],
        }[],
        actor: userItem[],
        hot: userItem[],
        type: string[],
        time: string[],

    }>
}

/** 获取参与的会议 */
export function getMysession() {

    return request({
        url: "/getMysession"
    }) as any as Promise<mettItems>


}



export function submitMeet(openConversationId: string, data: any) {

    return request({
        url: "/submit",
        params: {
            openConversationId
        },
        method: "post",
        data
    }) as any as Promise<boolean>

}

export function getList(data: any) {

    return request({
        url: "/getList",
        method: "post",
        data
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[]
    }>
}

export function getMark(data: any) {

    return request({
        url: "/getMark",
        method: "post",
        data
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[]
    }>
}

export function getAbout(data: any) {

    return request({
        url: "/getAbout",
        method: "post",
        data
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[]
    }>
}



export function getApt(data: any) {

    return request({
        url: "/getApt",
        method: "post",
        data
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[]
    }>
}

export function getStart(data: any) {

    return request({
        url: "/getStart",
        method: "post",
        data
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[],
    }>
}


export function getProdu(data: any) {

    return request({
        url: "/getProdu",
        method: "post",
        data
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[]
    }>

}

export function getScene(data: any) {

    return request({
        url: "/getScene",
        method: "post",
        data
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[]
    }>

}


export function getFollow(data: any) {

    return request({
        url: "/getFollow",
        method: "post",
        data
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[]
    }>

}



export function getEnd(data: any) {

    return request({
        url: "/getEnd",
        method: "post",
        data
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[],
    }>

}

export function getSuggest(data: any) {

    return request({
        url: "/getSuggest",
        method: "post",
        data
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[]
    }>

}



export function getMyFollow() {

    return request({
        url: "/my/getFollow"
    }) as any as Promise<{
        data: mettItem[],
        filter: string[],
        hectic: string[]
    }>

}

export function getMyList() {

    return request({
        url: "/my/getList"
    }) as any as Promise<mettItems>
}
export function getMyMark() {

    return request({
        url: "/my/getMark"
    }) as any as Promise<mettItems>
}


export function getMyApt() {

    return request({
        url: "/my/getApt"
    }) as any as Promise<mettItems>
}

export function getMyStart() {

    return request({
        url: "/my/getStart"
    }) as any as Promise<mettItems>
}

export function getMyEnd() {

    return request({
        url: "/my/getEnd",
    }) as any as Promise<mettItems>


}


export function getMyProdu() {

    return request({
        url: "/my/getProdu",
    }) as any as Promise<mettItems>


}



export function delMy(id: string | number) {
    return request({
        url: "/my/del",
        params: {
            id
        }
    }) as any as Promise<any>

}


export function startMeeting(id: number) {

    return request({
        url: "/start",
        params: {
            id
        }
    }) as any as Promise<mettItems>

}

export function endMeeting(id: number, result: string, memo: string) {

    return request({
        url: "/end",
        method: "post",
        data: {
            id,
            result,
            memo
        }
    }) as any as Promise<mettItems>

}


export function getStep(id: number) {

    return request({
        url: `/step/${id}`
    }) as any as Promise<mettItems>

}

export function addStep(data: any) {

    return request({
        url: "/step/add",
        method: "post",
        data
    }) as any as Promise<mettItems>

}


export function getAllGroup() {
    return request({
        url: "/setting/getAllGroup",
        method: "get"
    }) as any as Promise<any>

}
export function getSetting() {
    return request({
        url: "/setting/get",
        method: "get"
    }) as any as Promise<any>

}

export function setSetting(data: any) {
    return request({
        url: "/setting/set",
        method: "post",
        data
    }) as any as Promise<any>

}



export function setDefaultUser(name: string) {
    return request({
        url: "/setting/setDefaultUser",
        method: "post",
        data: {
            name
        }
    }) as any as Promise<any[]>

}


export function isSettingAdmin() {
    return request({
        url: "/setting/isadmin"
    }) as any as Promise<{
        setting: boolean,
        cancel: boolean,
        optimize: boolean
    }>

}



export function getEditorUserList(id: string | number) {
    return request({
        url: "/view/edit/user/get",
        params: {
            id
        }
    }) as any as Promise<{
        hot: userItem[],
        user: userItem[]
    }>

}

export function setEditorUserList(id: string | number, data: any) {
    return request({
        url: "/view/edit/user/set",
        method: "post",
        data: {
            id,
            ...data
        }
    }) as any as Promise<any>

}


export function delEditorUserList(id: string | number) {
    return request({
        url: "/view/edit/user/del",
        params: {
            id,

        }
    }) as any as Promise<any>

}



export function resourceAdd(id: string | number, rtime: number) {

    return request({
        url: "/view/resource/add",
        method: "post",
        data: {
            id,
            rtime
        }
    }) as any as Promise<any>

}

export function resourceDel(id: string | number) {

    return request({
        url: "/view/resource/del",
        method: "post",
        data: {
            id
        }
    }) as any as Promise<any>

}

export function getAllActorUser() {

    return request({
        url: "/getAllActorUser"
    }) as any as Promise<userItem[]>

}


export function editTrackUser(id: string | number, user: string, memo?: string, comm?: string, type?: string, result?:string) {

    return request({
        url: "/edit/trackuser",
        method: "post",
        data: {
            id,
            user,
            memo,
            comm,
            type,
            result
        }
    }) as any as Promise<string[]>

}


export function openSceneGroups(id: string | number, create = false) {

    return request({
        url: "/sceneGroups/open",
        method: "post",
        data: {
            id,
            create
        }
    }) as any as Promise<{
        exist: boolean,
        conversation: string
    }>

}



export function sceneGroupsMessage(id: string | number, conversation: string) {

    return request({
        url: "/sceneGroups/message",
        method: "post",
        data: {
            id,
            conversation
        }
    }) as any as Promise<any>

}



export function editMark(id: string | number, value: boolean) {


    return request({
        url: "/view/edit/mark",
        method: "post",
        data: {
            id,
            mark: value
        }
    }) as any as Promise<any>

}


export function getLick(id: string | number) {


    return request({
        url: `/getLink/${id}`,
    }) as any as Promise<mettItems>

}


export function createSuggest(content: string, img: string[]) {

    return request({
        url: "/submit/suggest",
        method: "post",
        data: {
            content,
            img
        }
    }) as any as Promise<any>


}


export function cacelEnd(id: number) {

    return request({
        url: "/cacelEnd",
        params: {
            id
        }
    }) as any as Promise<any>


}


export function diySearch(content: string) {

    return request({
        url: "/diySearch",
        params: {
            content
        }
    })

}


export function holidayGet(name: string[]) {
    return request({
        url: "/holiday/get"

    }) as any as Promise<string[]>
}

export function holidaySet(list: string[]) {
    return request({
        url: "/holiday/set",
        method: "post",
        data: {
            list
        }
    })
}

export function toAbout(id: number) {
    return request({
        url: "/toAbout",
        params: {
            id
        }
    })
}

export function tohandle(id: number) {

    return request({
        url: "/toHandle",
        params: {
            id
        }
    })

}


export function followAdd(id:number) {

    return request({
        url: "/follow/add",
        method: "post",

        data: {
            id
        }
    })

}
export function followDel(id:number) {

    return request({
        url: "/follow/del",
        method: "post",

        data: {
            id
        }
    })

}
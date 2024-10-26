import request from "@/utils/request";



export function getLeave(name?: string) {

    return request({
        url: "/leave/get",
        method: "post",
        data: {
            name
        }
    }) as any as Promise<{
        start_time: string,
        end_time: string,
        is_video: boolean,
        leisure: string[],
        hectic: any[]
    }>

}

export function setLeave(data: any) {
    return request({
        url: "/leave/set",
        method: "post",
        data
    })

}



export function getLeaveList() {

    return request({
        url: "/leave/list"
    }) as any as Promise<{
        name: string,
        data: {
            name: string,
            value: {
                id: string,
                start: string,
                end: string
            }[]
        }[]

    }[]>

}


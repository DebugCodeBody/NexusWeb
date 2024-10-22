import request from "@/utils/request";




export function getList() {
    return request({
        url: "/get"
    }) as any as Promise<groupItem[]>
}


export function addCount(id:string) {
    return request({
        url: "/add",
        params: {
            id
        }
    }) as any as Promise<null>
}


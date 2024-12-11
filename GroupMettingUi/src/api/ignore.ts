import request from "@/utils/request";


export function addIgnore(id: string) {

    return request({
        url: "/ignore/add",
        method: "get",
        params: {
            id
        }
    }) as any as Promise<any[]>

}
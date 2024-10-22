import request from "@/utils/request";




export function getList() {
    return request({
        url: "/get"
    }) as any as Promise<buyorderItem[]>
}


export function startAudit(id: number[], img:string[]) {

    return request({
        url: "/startAudit",
        method: "post",
        data: {
            id,
            img
        }
    }) 

}
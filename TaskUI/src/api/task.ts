import request from "@/utils/request"


export function getbarcode(barcode:string){
    return request({
        url: "/getbarcode",
        params: { barcode }
    })
}

/**
 * 提交当前动作
 * @param id 工作id
 * @param name 提交人员姓名
 * @param action 提交工作
 * @returns 
 */
export function setaction(id:string,name:string,action:string){
    return request({
        url: "/setaction",
        params: { id ,name,action}
    })
}
import request from "@/utils/request";




export function submitCheck(order: string, result: number, img: string[]) {
    return request({
        url: "/submit",
        method: "post",
        data: {
            order,
            result,
            img
        }
    })
}
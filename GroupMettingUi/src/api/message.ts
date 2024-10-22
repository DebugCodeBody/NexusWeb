import request from "@/utils/request";



export function sendMessage(id: number | string) {
    return request({
        url: "/message/send",
        params: {
            id
        }
    })

}

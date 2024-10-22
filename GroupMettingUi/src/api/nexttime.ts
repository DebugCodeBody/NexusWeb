import request from "@/utils/request";



export function setNextTime(id: number | string, time: string) {
    return request({
        url: "/nextTime/set",
        method: "post",
        data: {
            id,
            time
        }
    })

}

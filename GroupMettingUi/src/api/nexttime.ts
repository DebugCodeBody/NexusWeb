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


export function setExpectTime(id: number | string, expect: string) {
    return request({
        url: "/expect/set",
        method: "post",
        data: {
            id,
            expect
        }
    })

}

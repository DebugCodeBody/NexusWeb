import request from "@/utils/request"

export function setEventLog(page: string) {
    return request({
        url: `/eventlog/wxapp/topage`,
        params: {
            page
        }
    })
}


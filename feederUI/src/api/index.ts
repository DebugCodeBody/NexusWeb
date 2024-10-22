import request from "@/utils/request"


export function submit(moid: string) {

    return request({
        url: "/submit",
        params: {
            moid
        }
    }) as any as Promise<{
        orderid: string,
        result: string,
        success: boolean
    }>

}
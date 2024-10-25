import request from "@/utils/request";



export function setOptimize(id: number | string, value: boolean) {
    return request({
        url: "/optimize/set",
        method: "post",
        data: {
            id,
            value
        }
    })

}

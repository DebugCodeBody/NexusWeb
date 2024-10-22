import request from "@/utils/request"



export function getStep(id: string | number) {
    return request({
        url: `/step/${id}`
    }) as any as Promise<any[] >
}

export function setStep(id: number|string, stageid: number, memo: string) {
    return request({
        url: `/step/${id}`,
        method: "post",
        data: {
            stageid,
            memo
        }
    })
}


















































































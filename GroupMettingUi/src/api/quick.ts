import request from "@/utils/request";



export function setTrack(id: number | string, track: string) {
    return request({
        url: "/quick/setTrack",
        method: "post",
        data: {
            id,
            track
        }
    }) as any as Promise<any>
}

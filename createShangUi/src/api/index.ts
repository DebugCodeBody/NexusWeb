import request from "@/utils/request";



export function upload(data: FormData) {

    return request({
        url: "/file/create",
        method: "post",
        data
    }) as any as Promise<string>

}



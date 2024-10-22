import request from "@/utils/request";


export function create(data: FormData) {

    return request({
        url: "/order/create",
        method: "post",
        data
    })

}

export function del() {

}


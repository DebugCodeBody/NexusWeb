import request from "@/utils/request"

export function submit(data: FormData) {
    return request({
        url: "/submit",
        method: "post",
        data
    })

}

export function getList(search: string) {
    return request({
        url: "/product/list",
        params: {
            search
        }
    }) as unknown as Promise<goods>
}

export function productStep(id: number) {
    return request({
        url: "/product/step",
        params: {
            id
        }
    }) as unknown as Promise<steps>
}

export function moveStep(id: number, next: number, memo: string, invoice:string) {
    return request({
        url: "/product/move",
        method: "post",
        data: {
            id,
            next,
            memo,
            invoice
        }
    }) as unknown as Promise<step>
}


export function messageStep(id: number, memo: string) {
    return request({
        url: "/product/message",
        method: "post",
        data: {
            id,
            memo
        }
    }) as unknown as Promise<step>
}

export function uploadImg(data: any) {
    return request({
        url: "../media/upload/img",
        method: "post",
        data
    }) as unknown as Promise<string>
}


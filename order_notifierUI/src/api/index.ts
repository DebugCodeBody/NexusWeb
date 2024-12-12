import request from "@/utils/request"
import to from "await-to-js";



export function workRecall(id: string | number, memo: string) {
    return to(request({
        url: `work/recall/${id}`,
        method: "post",
        data: {
            memo
        }
    }) as unknown as Promise<workItems>)

}


export function workId(id: string | number) {
    return to(request({
        url: `/work/${id}`
    }) as unknown as Promise<workItems>)

}

export function workGet(group?: number | null, txt?: string | null, dept?: string | null, create?: string | null, other = false) {
    group = group || null;
    dept = dept || null;
    create = create || null;
    txt = txt || null;
    const otherUser = other ? 1 : 0;


    return to(request({
        url: "/work/get",
        params: {
            group,
            txt,
            dept,
            create,
            other: otherUser
        }
    }) as unknown as Promise<{
        [key: string]: workItems
    }>)

}

export function workCreate(data: Item) {
    return to(request({
        url: "/work/create",
        method: "post",
        data
    }))
}

export function workEditGet(id: string|number) {
    return to(request({
        url: `/work/edit/${id}`,
    }))
}

export function workEdit(id: number, data: Item) {
    return to(request({
        url: `/work/edit/${id}`,
        method: "post",
        data
    }))
}

export function workDone(data: workItem, memo: string) {
    return to(request({
        url: `/work/done/${data.id}`,
        method: "post",
        data: {
            memo
        }
    }))


}


export function getOrder(moid: string) {
    return to(request({
        url: "../urged/getorderid",
        params: {
            moid
        }
    }))
}



export function uploadImg(data: any) {
    return request({
        url: "../media/upload/img",
        method: "post",
        data
    }) as unknown as Promise<string>

}



export function getGropuForm(id: string | number) {
    return request({
        url: `/form/${id}`,
    }) as Promise<any>
}

export function workReacll(id: number, memo: string) {

    return to(request({
        url: `/work/recall/${id}`,
        method: "post",
        data: {
            memo
        }
    }) as unknown as Promise<{
        [key: string]: workItems
    }>)



}



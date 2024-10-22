import request from "@/utils/request"



export function getSignature(url: string) {
    return request({
        url: "/signature",
        params: {
            url
        }
    }) as Promise<any>
}

export function registered(title: string, chatId: string, openConversationId: string) {

    return request({
        url: "/registered",
        params: {
            title,
            chatId,
            openConversationId
        }
    })
}


export function isExist(openConversationId: string) {

    return request({
        url: "/exist",
        params: {
            openConversationId
        }
    }) as any as Promise<boolean>
}


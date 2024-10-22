import request from "@/utils/request";



export function setTagContent(id: number | string, tag_content: string) {
    return request({
        url: "/tag/set",

        method: "post",
        data: {
            id,
            tag_content
        }
    })

}

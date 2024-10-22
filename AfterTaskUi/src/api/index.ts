import request from "@/utils/request"


export function getTaskList() {
    return request({
        url: "/task/list"
    }) as any as Promise<singItems>;

}

export function taskCreate(id: number, order: string, title: string, priority: number, endtime: string, danger: boolean) {
    return request({
        url: "/task/create",
        method: "post",
        data: {
            id,
            order,
            title,
            priority,
            endtime,
            danger
        }
    }) as any as Promise<TaskCard>;
}

export function taskEdit(id: number, order: string, title: string, priority: number, endtime: string, danger: boolean) {
    return request({
        url: "/task/edit",
        method: "post",
        data: {
            id,
            order,
            title,
            priority,
            endtime,
            danger
        }
    }) as any as Promise<TaskCard>;
}


export function setMessage(id: number, memo: string) {
    return request({
        url: "/task/message",
        method: "post",
        data: {
            id,
            memo
        }
    }) as any as Promise<step>;

}


export function getStep(id: number) {
    return request({
        url: "/step/list",
        params: {
            id
        }
    }) as any as Promise<steps>;
}


export function moveTask(dragged: moveDra, related: moveDra, memo: string) {
    return request({
        url: "/task/move",
        method: "post",
        data: {
            dragged,
            related,
            memo
        }
    }) as any as Promise<steps>;

}

export function crtList() {
    return request({
        url: "/task/crt"
    }) as any as Promise<Array<string>>;

}


export function taskSearch(crt: Array<string>, title: string | undefined) {
    return request({
        url: "/task/search",
        method: "post",
        data: {
            crt,
            title
        }
    }) as any as Promise<singItems>;

}
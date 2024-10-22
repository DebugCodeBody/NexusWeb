import request from "@/utils/request";


/**
 * 
 * @param {*} name 申报人员
 * @param {*} mid 设备ID
 * @param {*} tid 错误ID
 * @param {*} machinename 设备名字 
 * @param {*} typename 错误类型
 * @param {*} memo 问题描述
 * @returns 
 */
export function addProblem(name: string, mid: string, tid: string | number, machinename: string, typename: string, memo: string) {

    return request({
        url: "addProblem",
        method: "post",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: [function (data) {
            let ret = ''
            for (const et in data) {
                ret += et + '=' + encodeURIComponent(data[et]) + '&'
            }

            return ret.slice(0, ret.length - 1);
        }],

        data: { name, mid, typename, memo, tid, machinename }
    });

}




/**
 * 获取指定机器名字和故障列表
 * @param {*} mid 
 * @returns 
 */
export function getDescribe(mid: string) {
    return request({
        url: "getDescribe",
        params: { mid }
    }) as any as Promise<{
        name: string,
        tid: number,
        typename: string[]
    }>;
}



/** 获取跳转页面列表 */
export function getToUrls(name: string) {
    return request({
        url: "/tourl/list",
        params: {
            name
        }
    }) as any as Promise<{
        data: UrlItem[],
        order: boolean
    }>;
}


/** 给某个链接次数+1 */
export function addToUrlCount(id: string | number, name: string | number) {
    return request({
        url: "/tourl/add",
        params: {
            id,
            name
        }
    });
}

/** 获取某一个申请的描述 */
export function getView(id: string | number) {

    return request({
        url: "/get",
        params: {
            id
        }
    }) as any as Promise<{
        id: number,
        memo: string,
        typename: string,
        createdate: string,
        createname: string,
    }>;

}


export function submitRecover(id: string | number, type: number, memo: string) {

    return request({
        url: "/recover",
        method: "post",
        data: {
            id,
            type,
            memo
        }
    });


}




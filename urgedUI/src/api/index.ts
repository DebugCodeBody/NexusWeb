import request from "@/utils/request"


/**
 * 工单单号搜索
 * @param wd 
 * @returns 
 */
export function suggest(wd: string): Promise<remoteSearchs> {
    return request({
        url: "/suggest",
        params: {
            wd
        }
    }) as unknown as Promise<remoteSearchs>

}


/**
 * 通过moid获取到orderid
 * @param moid 
 * @returns 
 */
export function moidAndOrderid(moid: string): Promise<string> {
    return request({
        url: "/getorderid",
        params: {
            moid
        }
    }) as unknown as Promise<string>

}

/**
 * 申请催单提交
 * @param username 提交人
 * @param orderid 输入的订单号
 * @param barcode 扫码的工单号
 * @param branch 负责部门
 * @param describe 详细描述
 * @returns 
 */
export function submit(username: string, orderid: string, barcode: string, branch: string, describe: string) {
    return request({
        url: "/submit",
        method: "post",
        data: {
            username,
            orderid,
            barcode,
            branch,
            describe
        }
    })
}

/**
 * 获取全部部门
 * @returns 
 */
export function getBranch(): Promise<branchs> {
    return request({
        url: "/getbranch"
    }) as unknown as Promise<branchs>
}


export function queryOrderDetailed(order: string): Promise<orderDetailed> {
    return request({
        url: "/order/detailed",
        params: {
            order
        }
    }) as unknown as Promise<orderDetailed>
}


export function getPreData() {
    return request({
        url: "/problem/list"
    }) as unknown as Promise<PreData>
}

export function moveBranch(expid: number, deptname: string, describe: string) {
    return request({
        url: "/problem/move",
        method: "post",
        data: {
            deptname,
            expid,
            describe
        }
    })
}

export function doneProblem(expid: number, describe: string) {
    return request({
        url: "/problem/done",
        method: "post",
        data: {
            expid,
            describe
        }
    })
}


/**
 * 获取工单任务流程
 * @param expid 
 * @returns 
 */
export function problemStep(expid: number) {
    return request({
        url: "/problem/step",
        params: {
            expid
        }
    }) as unknown as Promise<steps>
}

/**
 * 留言
 * @param expid 
 * @param describe 
 * @returns 
 */
export function problemMessage(expid: number, describe: string) {
    return request({
        url: "/problem/describe",
        method: "post",
        data: {
            expid,
            describe
        }
    }) as unknown as Promise<step>
}


export function orderSearch(order: string) {
    return request({
        url: "/problem/search",
        params: {
            order
        }
    })

}






















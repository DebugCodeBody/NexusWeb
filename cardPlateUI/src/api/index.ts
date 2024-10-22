import request from "@/utils/request";




export function getOrderInfo(order: string) {

    return request({
        url: "/info",
        params: {
            order
        }
    }) as any as Promise<{
        /** 订单号 */
        orderid: string;
        /** 卡板 */
        pallet: number;
        /** 铁桶 */
        bucket: number;
        /** 是否锁定 */
        isback: boolean;
        /** 客户 */
        custname: string;
        /** 客户列表 */
        cust: {
            id: number | string,
            name: string,
            process: string,
            current: boolean
        }[]
    }>

}

export function submit(order: string, pallet: number, bucket: number) {

    return request({
        url: "/submit",
        params: {
            order,
            pallet,
            bucket
        }
    }) as any as Promise<{
        /** 订单号 */
        orderid: string;
        /** 卡板 */
        pallet: number;
        /** 铁桶 */
        bucket: number;
        /** 是否锁定 */
        isback: boolean;
    }>

}


export function submitLoan(order: string, pallet: number, bucket: number, action: number) {

    return request({
        url: "/loan",
        params: {
            order,
            pallet,
            bucket,
            action
        }
    }) as any as Promise<void>;

}

export function submitReturn(order: string, pallet: number, bucket: number, supid: string|number) {

    return request({
        url: "/return",
        params: {
            order,
            pallet,
            bucket,
            supid
        }
    }) as any as Promise<void>;
}


export function getStep() {
    return request({
        url: "/step",
        method: "get"
    }) as any as Promise<{
        backid: number;
        createdate: string;
        username: string;
        pallet: number;
        bucket: number;
        done: string;
        ermsg: string;
    }[]>
}

export function delStep(id: number) {
    return request({
        url: `/step/del/${id}`,
        params: {
            id
        }
    })
}
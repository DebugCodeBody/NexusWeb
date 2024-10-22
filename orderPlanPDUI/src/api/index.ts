import request from "@/utils/request";

export function getAllDep() {
    return request({
        url: "/dept"
    }) as unknown as Promise<Depts>
}

export function getOrder(deptid: number) {
    return request({
        url: "/order/",
        params: {
            deptid
        }
    }) as unknown as Promise<Orders>
}

export function getMachine(deptid: number) {
    return request({
        url: "/order/machine",
        params: {
            deptid
        }
    }) as unknown as Promise<Machs>
}



/**
 * 
 * @param mcid 机器ID
 * @param moid 订单ID
 * @returns 
 */
export function addOrder(mcid: number, moid: number) {
    return request({
        url: "/order/add",
        params: {
            mcid,
            moid
        }
    }) as unknown as Promise<Machs>
}
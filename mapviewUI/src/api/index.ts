import request from "@/utils/request";


export function getKey(type: string, origin = "") {
    return request({
        url: "/getkey",
        params: {
            type,
            origin
        }
    }) as Promise<any>;
}

export function getCustName(custid: number | string) {
    return request({
        url: "/getcustname",
        params: {
            custid
        }
    }) as any as Promise<{
        name: string
    }>;

}



export function editCustInfo(data: any) {
    return request({
        url: "/editcust",
        method: "post",
        data
    }) as Promise<any>;
}


export function editUserInfo(data: any) {
    return request({
        url: "/edituser",
        method: "post",
        data
    }) as Promise<any>;
}

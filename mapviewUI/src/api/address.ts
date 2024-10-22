import request from "@/utils/request";

export function getAddressAll() {
    return request({
        url: "/address"
    }) as any;
}

export function createAddress(name: string, detailed: string, location: any) {
    return request({
        url: "/address/create",
        method: "post",
        data: {
            name,
            detailed,
            location
        }
    });
}

export function updateAddress(id: string, name: string, detailed: string, location: any) {
    return request({
        url: `/address/update/${id}`,
        method: "post",
        data: {
            name,
            detailed,
            location
        }
    });
}

export function delectAddress(id: string) {
    return request({
        url: `/address/delect/${id}`
    });
}


export function distance(origin: number, destinations: string, number?: number) {
    return request({
        url: `/address/distance`,
        params: {
            origin,
            destinations,
            number
        }
    }) as any;
}

export function search(origin: string) {
    return request({
        url: `/address/search`,
        params: {
            origin
        }
    }) as any;

}
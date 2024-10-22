import request from "@/utils/request";




export function scan(barcode: string, wcname: string) {

    return request({
        url: "/scan",
        params: {
            barcode,
            wcname
        }
    }) as any as Promise<apiScan>


}


export function Submit(barcode: string, data: any) {


    return request({
        url: "/submit",
        method: "post",
        params: {
            barcode
        },
        data
    }) as any as Promise<{
        next: ""
    }>

}
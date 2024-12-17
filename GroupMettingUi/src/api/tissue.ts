import request from "@/utils/request";



export function tissueDrawDown(id:any) {

    return request({
        url: "/tissue/drawdown",
        params: {
            id
        }
    }) as any as Promise<boolean>

}




export function tissueAbandon(id:any) {

    
    return request({
        url: "/tissue/abandon",
        params: {
            id
        }
    }) as any as Promise<boolean>


}




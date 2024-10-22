import moment from "moment";

/**
 * 钉钉提供的二维码，条形码扫描
 * 成功返回扫描结果
 * @returns 扫描结果
 */
export function scanning(): Promise<string> {

    return dd.biz.util.scan({
        type: "all"
    }).then(({ text }: scanResult) => {
        return text;
    }).catch(() => {
        return "";
    })

}


/**
 * 防抖封装
 * @param call 回调函数 
 * @param delay 间隔时间
 * @returns 
 */
export function debounce(call: (...args: any[]) => any, delay: number) {
    let timer: number;

    return function (this: any, ...args: any[]) {
        clearTimeout(timer);

        timer = window.setTimeout(() => {
            call.apply(this, args);
        }, delay)
    }
}


export function getTitle(item: workStep, index: number) {
    return ({
        "1": "创建任务",
        "2": "正在处理",
        "3": "结案",
        "99": "留言",
        "100": "编辑"
    })[item.stageid]
}



export function parseTime(val: string) {
    return moment(val).format('YYYY-MM-DD HH:mm')
}








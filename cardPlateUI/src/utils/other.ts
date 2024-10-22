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


export function strToInt(str: string) {
    const num = parseInt(str);
    if (isNaN(num)) {
        return false;
    }
    return num > 0;
}

export function getNum(str: string) {
    const num = parseInt(str);

    return isNaN(num) ? 0 : num;
}

export function parseTime(dateStr: string) {
    const date = new Date(dateStr);
    const month = `0${date.getMonth() + 1}`.slice(-2); // 月份是从0开始的
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minute = `0${date.getMinutes()}`.slice(-2);


    const formattedDate = month + "-" + day + " " + hours + ":" + minute;
    return formattedDate;
}
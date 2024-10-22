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




export function parseTime(txt: string) {
    const retTime: Time = {
        hours: 0,
        minutes: 0
    }

    const split = txt.split(".")
    if (split.length == 2) {
        split[1] = (parseFloat(split[1]) * 60 / 100).toFixed().toString();

        retTime.hours = parseInt(split[0]);
        retTime.minutes = parseInt((parseFloat(split[1]) * 60 / 100).toFixed() as any);

    } else {
        if (split[0]) {
            retTime.hours = parseInt(split[0]);
        }
    }

    return retTime;
}


export function parseOrder(item: Orders[]) {

    if (!Array.isArray(item)) {
        item = [item];
    }


    item.forEach((elem) => {
        elem.forEach((a) => {
            a.workhour = parseTime(a.workhour as any)
        })
    })

}


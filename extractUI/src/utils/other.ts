import dayjs from "dayjs";

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



export function localContainer(name: string, defaultVal?: any, getParse?: boolean) {
    return {
        get() {
            try {
                const getVal = localStorage.getItem(name);
                if (getVal) {
                    return getParse ? JSON.parse(getVal) : getVal;
                } else {
                    return defaultVal
                }
            } catch {
                return defaultVal
            }

        },
        set(value: any) {
            return localStorage.setItem(name, value.toString());
        },
        del() {
            return localStorage.removeItem(name);
        }
    }

}



/**
 * 按照天数来判断当前日期是否大于给定的日期，
 * @param str 
 * @returns 
 */
export function gtNowDate(str: string) {

    const deliTime = dayjs(`${dayjs(str).format("YYYY-MM-DD")} 00:00:00`);
    const nowTime = dayjs(`${dayjs().format("YYYY-MM-DD")} 00:00:00`);

    
    return nowTime.diff(deliTime, "day") > 0;

}




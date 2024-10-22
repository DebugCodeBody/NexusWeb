import Cookies from "js-cookie";


export function packagStorage(key: string) {
    return {
        get() {
            return localStorage.getItem(key);
        },
        set(val: string | number) {
            return localStorage.setItem(key, val.toString());
        }
    }
}


export function isImgUrl(value: string) {
    return /\/\/.*(\.png|\.jpg|\.jpeg|\.gif)$/.test(value);
}

export function isHttp(value: string) {
    return /^http:/.test(value)

}

export function isHttps(value: string) {
    return /^https:/.test(value)
}

/** 防抖 */
export function debounce(fun: (...args: any[]) => any, time: number) {
    let timeInt = -1;

    return function () {
        if (timeInt != -1) {
            clearTimeout(timeInt);
        }

        timeInt = window.setTimeout((...arg: any[]) => {
            fun.apply(fun, arg);
            timeInt = -1;
        }, time);

    }

}
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



export function copyText(text: string) {
    // 创建 input 元素
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = `0`;
    input.value = text;
    document.body.appendChild(input);
    input.select();

    // 复制文本到剪贴板
    document.execCommand('copy');

    // 移除 input 元素
    document.body.removeChild(input);
}







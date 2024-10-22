import compressor from "compressorjs";


export async function zipImg(file: File): Promise<Blob> {

    let quality: number;
    let { width, height } = await getImageSize(window.URL.createObjectURL(file))

    if (file.size <= 1024 * 250) {
        quality = 0.9
    } else {

        quality = 0.6
        if (width >= 3000 || height >= 4000) {

            width = width / 2;
            height = height / 2;
        }
    }

    return new Promise<Blob>((resolve, reject) => {

        new compressor(file, {
            quality,
            width,
            height,
            success: (result) => {
                resolve(result);
            }
        });

    })

}


export function getImageSize(url: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = url
        if (img.complete) {
            resolve({ width: img.width, height: img.height })
        } else {
            img.onload = () => {
                resolve({ width: img.width, height: img.height })
            }
        }
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



/**
 * 钉钉提供的二维码，条形码扫描
 * 成功返回扫描结果
 * @returns 扫描结果
 */
export function scanning(): Promise<string> {

    return window.dd.biz.util.scan({
        type: "all"
    }).then(({ text }: scanResult) => {
        return text;
    })

}





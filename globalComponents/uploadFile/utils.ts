import compressor from "compressorjs";

export async function zipImg(file: File): Promise<Blob> {

    let quality: number;
    let { width, height } = await getImageSize(window.URL.createObjectURL(file))

    if (file.size <= 1024 * 250) {
        quality = 0.9;
    } else {

        quality = 0.6;

        // if (width >= 3000 || height >= 4000) {

        //     width = width / 2;
        //     height = height / 2;

        // }

    }

    return new Promise<Blob>((resolve, reject) => {

        new compressor(file, {
            quality,
            width,
            height,
            success: (result: any) => {
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
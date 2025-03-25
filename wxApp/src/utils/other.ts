export function scanCode() {
    return new Promise<string>((resolve, reject) => {
        wx.scanCode({
            success(data) {
                resolve(data.result);
            },
            fail() {
                reject();
            }
        });
    })
}


export function showLoading(title: string, mask = true) {
    uni.showLoading({
        title,
        mask
    });
}

export function hidenLoading() {
    uni.hideLoading()
}


export function loadIngCall(title: string, callback: Function) {

    showLoading(title);
    callback(hidenLoading);

}




export function showErrorToast(title: string, duration = 1500) {
    uni.showToast({
        title,
        icon: 'error',
        duration
    });
}



export function showToast(title: string, duration = 1500) {
    uni.showToast({
        title,
        duration
    });
}

export function showModal(content: string, options: UniNamespace.ShowModalOptions = {}) {
    return new Promise<void>((resolve, reject) => {
        uni.showModal(Object.assign({
            success(res: any) {
                if (res.confirm) {
                    resolve()
                } else {
                    reject()
                }
            }
        }, options, {
            content
        }))

    })

}
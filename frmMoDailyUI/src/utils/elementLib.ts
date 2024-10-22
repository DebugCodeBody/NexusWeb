
// // @ts-ignore
// import Notification from 'element-ui/lib/notification';
// // @ts-ignore
// import Message from 'element-ui/lib/message';
// // @ts-ignore
// import MessageBox from 'element-ui/lib/message-box';

import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'



// const defaultOffset = 40;
// const defaultDuration = 3000;



// export function NotificationSuccess(message: string, title = "成功") {

//     Notification({
//         title,
//         message,
//         type: 'success',
//         offset: defaultOffset,
//         duration: defaultDuration
//     })
// }

// export function NotificationWarning(message: string, title = "警告") {

//     Notification({
//         title,
//         message,
//         type: 'warning',
//         offset: defaultOffset,
//         duration: defaultDuration
//     })
// }

// export function NotificationError(message: string, title = "错误") {

//     Notification({
//         title,
//         message,
//         type: 'error',
//         offset: defaultOffset,
//         duration: defaultDuration
//     })
// }

// export function NotificationInfo(message: string, title = "消息") {

//     Notification({
//         title,
//         message,
//         type: 'info',
//         offset: defaultOffset,
//         duration: defaultDuration
//     })
// }


export function messageSuccess(message: string,) {
    ElMessage({
        message,
        type: 'success'
    })
}

export function messageWarning(message: string,) {
    ElMessage({
        message,
        type: 'warning'
    })
}

export function messageInfo(message: string,) {
    ElMessage({
        message,
        type: 'info'
    })
}

export function messageError(message: string,) {
    ElMessage({
        message,
        type: 'error'
    })
}


export function MessageBoxWarning(message: string, title = "警告", center = true) {

    return ElMessageBox.confirm(
        message,
        title,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center
        }
    )

}

export function MessageBoxError(message: string, title = "错误", center = true) {

    return ElMessageBox.confirm(
        message,
        title,
        {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'error',
            center
        }
    )

}


export function loadService<T>(callback: T, text = "正在加载"): T {

    return function (...args: any[]) {

        const loading = ElLoading.service({
            text,
            lock: true,
            background: 'rgba(0, 0, 0, 0.7)',
        })


        const callReturn = (callback as any).apply(callback, args);

        if (callReturn instanceof Promise) {
            return callReturn.finally(loading.close);
        } else {
            loading.close();
        }


    } as any as T


}


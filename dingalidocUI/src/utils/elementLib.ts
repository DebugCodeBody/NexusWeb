
// // @ts-ignore
// import Notification from 'element-ui/lib/notification';
// // @ts-ignore
// import Message from 'element-ui/lib/message';
// // @ts-ignore
// import MessageBox from 'element-ui/lib/message-box';

import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { MessageHandler } from 'element-plus'




const Message = ElMessage;


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



function wrapToast<T = any>(callback: any, type: string, defaultTitle = "") {

    const defaultOptions = {
        title: defaultTitle
    }

    return (message: string, options?: string | Record<any, any>): T => {

        let setOptions: any;

        if (typeof options == "string") {
            setOptions = {};
            setOptions.title = options;
        } else {
            setOptions = options;
        }

        return callback(Object.assign({}, defaultOptions, setOptions, {
            type,
            message
        }));

    }

}



// export const NotificationSuccess = wrapToast<ReturnType<typeof Notification>>(Notification, "success", "成功");
// export const NotificationWarning = wrapToast(Notification, "warning", "警告");
// export const NotificationError = wrapToast(Notification, "error", "错误");
// export const NotificationInfo = wrapToast(Notification, "info", "消息");



export const messageInfo = wrapToast<MessageHandler>(Message, "info");
export const messageError = wrapToast<MessageHandler>(Message, "error");
export const messageSuccess = wrapToast<MessageHandler>(Message, "success");
export const messageWarning = wrapToast<MessageHandler>(Message, "warning");



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


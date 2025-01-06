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



export function copyText(text: string) {
    // 创建 input 元素
    const input = document.createElement('textarea');
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




/** 通过给定的时间算出时间戳 */
export function getRtime(day: number, ptime: number) {
    const nowTime = new Date();

    nowTime.setDate(nowTime.getDate() + day);

    const ptimeStr = ["09:00", "13:30", "18:00"][ptime].split(":");

    nowTime.setHours((ptimeStr[0] as any) - 0);

    nowTime.setMinutes((ptimeStr[1] as any) - 0);
    nowTime.setSeconds(0);
    nowTime.setMilliseconds(0);

    return nowTime.getTime();

}

export function getMettItemDetail(item: mettItem, shareUrl = false) {

    const textArr = [];

    textArr.push(`${item.title} ${item.create_date}`);
    textArr.push(`预约用户：${item.create_user}`);
    textArr.push(`参与人员：${item.actor_user.join(" ")}`);
    if (item.not_neceuser.length) {
        textArr.push(`有空参加：${item.not_neceuser.join(" ")}`);
    }
    textArr.push(`会议类型：${item.type}`);

    if (item.start_time || item.is_resource) {
        textArr.push(`开会时间：${item.is_resource ? dayjs(item.rtime).format("MM-DD HH:mm") : item.start_time}`);
    }

    textArr.push(`开会内容：${item.content}`);
    if (item.log && item.log.length > 0) {

        textArr.push(`留言`);

        item.log.forEach((elem) => {
            textArr.push(`${elem.createdate} ${elem.fname} ${elem.memo}`);
        });

    }


    if (shareUrl) {

        const href = `${location.origin}/ding/coolapp/meeting/share/${item.id}`;

        textArr.push(`${item.content}：dingtalk://dingtalkclient/action/openapp?corpid=dingf2f1e9ca1da23dff&container_type=work_platform&redirect_url=${encodeURIComponent(href)}&app_id=0_2726873885`);

    }

    return textArr.join("\r\n");

}


export function copyItemValue(item: mettItem, shareUrl = false) {


    const copyContent = getMettItemDetail(item,shareUrl);


    copyText(copyContent);

}

export function pySearch(array: userItem[], value: string) {
    return array.filter((elem) => (!value || elem.py.indexOf(value) > -1 || elem.name.indexOf(value) > -1))
}

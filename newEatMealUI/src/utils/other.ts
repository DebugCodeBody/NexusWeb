import { Dialog } from 'vant';

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
export function debounce(call: (...args: any[]) => any, delay = 0) {
    let timer: number;

    return function (this: any, ...args: any[]) {
        clearTimeout(timer);

        timer = window.setTimeout(() => {
            call.apply(this, args);
        }, delay)
    }
}



export function addNumReminder() {
    return Dialog.confirm({
        message: "是否增加数量"
    });
}


/**
 * 取出被选中的列表
 * @param atts 
 */
export function getSelectAtt(atts: attribute[]) {

    return atts.map((elem) => {
        const retAttr = elem.details.find((attrElem) => attrElem.selected);
        return (retAttr && retAttr.show && retAttr.name) || ""

    }).filter(Boolean);

}

export function getSelectAttributeObject(atts: attribute[]) {
    return atts.map((elem) => {
        const tempSelect = elem.details.find((attr) => attr.selected)!;
        return {
            name: elem.name,
            details: [{ ...tempSelect }]
        }
    })

}




export function getShowName(name: string, atts: attribute[], spatts: attribute[]) {

    const attrArr: string[] = [];
    attrArr.push(...getSelectAtt(spatts));
    attrArr.push(...getSelectAtt(atts));

    let attrName = "";
    if (attrArr.length > 0) {
        attrName = `(${attrArr.join("/")})`
    }

    return `${name}${attrName}`;
}


export function getDefautlDayArray() {
    return [[], [], [], []] as dateFoodCard 
}


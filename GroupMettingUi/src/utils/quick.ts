import { getList, getFollow, getProdu, openSceneGroups } from "@/api"
import { getUserName } from "@/store/user"
import { openGroup } from "@/utils/ddgroup";
import { isGetNext } from "@/api/quick"

import to from "await-to-js"



function sleep(value: number) {

    return new Promise((resolve) => {

        setTimeout(() => {
            resolve();
        }, value || 0)

    })

}






/** 在产 */
async function produGet() {

    const sendData = { "all": true, "search": [], "filter": [], "track": [], "comm": [], "create": [], "value": "", "result": [], "isSync": true, "isFollow": false, "isTenDay": false, "filterLong": false, "noGroup": true, "haveGroup": true, "outTime": true, "isLeave": false, "isHectic": false };

    const { data , total } = await getProdu(sendData) as any;

    (data as any).total = total

    return data;

}

/** 待开 */
async function listGet() {

    const sendData = { "all": true, "search": [], "filter": [], "track": [], "comm": [], "create": [], "value": "", "result": [], "isSync": true, "isFollow": false, "isTenDay": false, "filterLong": false, "noGroup": true, "haveGroup": true, "outTime": false, "isLeave": false, "isHectic": false };


    const { data, total } = await getList(sendData) as any;

    (data as any).total = total

    return data;


}

/** 待处理 */
async function followGet() {

    const name = getUserName();

    const sendData = {
        "all": false,
        "search": [],
        "filter": [],
        "track": [name],
        "comm": [],
        "create": [],
        "value": "",
        "result": [],
        "isSync": true,
        "isFollow": false,
        "isTenDay": false,
        "filterLong": false,
        "noGroup": true,
        "haveGroup": true,
        "outTime": false,
        "isLeave": false,
        "isHectic": false
    }


    const { data  , total } = await getFollow(sendData) as any;

    (data as any).total = total
    
    return data;




}

const getArr = [
    {
        name: "在产类",
        handle: produGet,
        data: [] as any[],
        get() {

            const name = getUserName();

            const retVal = this.data.find((item) => {

                return item.tissue_user == "" && item.tissue_user == name

            })

            return retVal;


        }


    }, {
        name: "待开",
        handle: listGet,
        data: [] as any[],
        get() {

            return this.data[0]



        }


    }, {
        name: "待处理",
        handle: followGet,
        data: [] as any[],
        get() {

            const { data } = this;


            if (data.length == 0) {

                return;

            } else {


                let fangdai: any;


                const retItem = data.find((item) => {

                    if (item.type == "畅聊类") {

                        return true;

                    } else if (item.type == "防呆类") {

                        if (!fangdai) {
                            fangdai = item;
                        }

                    }

                    return false;

                })

                return retItem || fangdai;

            }


        }

    }];



async function toNextHandleFun() {



    const next = await isGetNext();
    if (!next) {
        closeNavigation();
        return;
    }


    let isOpen = false;

    for (let index = 0; index < getArr.length; index++) {

        const element = getArr[index];


        const item = await element.get();

        if (!item) {
            continue;
        }

        isOpen = true;

        try {

            const { conversation } = await openSceneGroups(item.id);

            await openGroup(conversation)

        } catch (err: any) {

            let message = err;

            if (err instanceof Error) {
                message = err.message
            } else if (typeof err == "object") {

                message = JSON.stringify(err);

                if (message == "{}") {
                    message = ""
                }

            }


            if (message) {
                message += `\r\n${element.name}`
                alert(`打开群失败：${message}`);
                break;
            }


        }

        if (isOpen) {
            break;
        }

    }

    if (!isOpen) {
        alert("已经完成全部任务！");
    }


}


export async function toNextHandle() {

    try {
        await toNextHandleFun()
    } catch {


        alert("获取下一个任务失败")

    }

}


export function closeNavigation() {

    // 不需要关闭页面了，改成跳转到待处理

    try {
        dd.biz.navigation.close({
            onFail(err: any) {

                alert(`关闭页面失败：${JSON.stringify(err)}`);

            }
        });
    } catch {

    }
}

export function toHandle() {

    location.href = `${location.origin}${location.pathname}?path=list&label=6&ismy=1`;

}


export async function getNextCount() {
    debugger;

    const allRun = getArr.map((item) => {

        const retVal = to(item.handle()) as any;

        return retVal.then((result: any) => {

            result.name = item.name

            return result

        });

    })


    const allResult = await Promise.all(allRun);


    const result = allResult.map((item, index) => {


        const [err, data] = item;

        getArr[index].data = err ? [] : data;

        return {
            name: item.name,
            count: (getArr[index].data as any).total
        }

    })

    return result;









}
import { getList, getFollow, getProdu, openSceneGroups } from "@/api"
import { getUserName } from "@/store/user"
import { openGroup } from "@/utils/ddgroup";
import { isGetNext } from "@/api"



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

    const { data } = await getProdu(sendData);

    return data[0];

}

/** 待开 */
async function listGet() {

    const sendData = { "all": true, "search": [], "filter": [], "track": [], "comm": [], "create": [], "value": "", "result": [], "isSync": true, "isFollow": false, "isTenDay": false, "filterLong": false, "noGroup": true, "haveGroup": true, "outTime": false, "isLeave": false, "isHectic": false };


    const { data } = await getList(sendData);

    return data[0];


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


    const { data } = await getFollow(sendData);

    if (data.length == 0) {

        return;

    } else {


        let fangdai: any;


        const retItem = data.find((item) => {

            if (item.type == "畅聊类") {

                return true;

            } else if (item.type == "防呆类") {

                if (!fangdai) {
                    fangdai  = item;
                }

            }

            return false;

        })

        return retItem || fangdai;

    }




}

async function toNextHandleFun() {



    const next = await isGetNext();
    if (!next) {
        closeNavigation();
        return;
    }

    const getArr = [produGet, listGet, followGet];

    let isOpen = false;

    for (let index = 0; index < getArr.length; index++) {

        const element = getArr[index];


        const item = await element();

        if (!item) {
            continue;
        }

        isOpen = true;

        try {

            const { conversation } = await openSceneGroups(item.id);

            await openGroup(conversation)

        } catch (err) {
            alert(`打开群失败：${JSON.stringify(err)}`);
            break;
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
    try {
        dd.biz.navigation.close({
            onFail(err: any) {

                alert(`关闭页面失败：${JSON.stringify(err)}`);

            }
        });
    } catch {

    }
}


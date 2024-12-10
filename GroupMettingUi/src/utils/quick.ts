import { getList, getFollow, openSceneGroups } from "@/api"
import { getUserName } from "@/store/user"
import { openGroup } from "@/utils/ddgroup";



async function listGet() {

    const sendData = { "all": true, "search": [], "filter": [], "track": [], "comm": [], "create": [], "value": "", "result": [], "isSync": true, "isFollow": false, "isTenDay": false, "filterLong": false, "noGroup": true, "haveGroup": true, "outTime": false, "isLeave": false, "isHectic": false };


    const { data } = await getList(sendData);

    return data;


}


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



    return data;

}

export async function toNextHandle() {



    const getArr = [listGet, followGet];

    let isOpen = false;

    for (let index = 0; index < getArr.length; index++) {
        const element = getArr[index];


        const data = await element();

        if (data.length == 0) {
            continue;
        }

        isOpen = true;

        const { conversation } = await openSceneGroups(data[0].id);

        try {
            await openGroup(conversation)
        } catch (err) {
            alert(`打开群失败：${JSON.stringify(err)}`);
            isOpen = false;
            break;
        }

        if (isOpen) {
            break;
        }

    }

    if (!isOpen) {
        dd.biz.navigation.close();
    }


}



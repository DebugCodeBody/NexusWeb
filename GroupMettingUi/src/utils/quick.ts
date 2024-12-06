import { getFollow, openSceneGroups } from "@/api"
import { getUserName } from "@/store/user"
import { openGroup } from "@/utils/ddgroup";


export async function toNextHandle() {


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
        dd.biz.navigation.close();
        return false;
    }

    const { conversation } = await openSceneGroups(data[0].id);

    try {
        await openGroup(conversation)
    } catch (err) {
        alert(`打开群失败：${JSON.stringify(err)}`);
    }


}



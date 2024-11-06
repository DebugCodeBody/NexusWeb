
import { getAllActorUser } from "@/api"


const exportData = {
    item: undefined,
    userData: reactive([] as userItem[])
}


async function init() {


    const username = await getAllActorUser();


    exportData.userData.push(...username);



}


init();

export default exportData

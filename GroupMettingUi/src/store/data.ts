
import { getAllActorUser } from "@/api"


const exportData = {
    item: undefined,
    userData: reactive([] as userItem[]),
    init

}


async function init() {


    const username = await getAllActorUser();


    exportData.userData.push(...username);



}



export default exportData

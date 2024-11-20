
import { getAllActorUser } from "@/api"


const exportData = {
    item: undefined,
    userData: reactive([] as userItem[]),

    nameCountMap: reactive({

    } as {
        [key: string]: number
    }),


    statistic(data: mettItem[]) {


        Object.keys(this.nameCountMap).forEach((key) => {

            delete this.nameCountMap[key];

        })


        const nameCountMap = this.nameCountMap;


        data.forEach((item) => {

            item.actor_user.forEach((elem) => {


                const count = nameCountMap[elem] || 0


                nameCountMap[elem] = count + 1;

            })

        })


    },

    init,


}


async function init() {


    const username = await getAllActorUser();


    exportData.userData.push(...username);



}



export default exportData

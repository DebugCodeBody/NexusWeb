
import { get } from "@/api/createGroup"

type groupInfo = {
    id: number,
    name: string,
    user: string[]
}

export const data = reactive({

    list: [] as groupInfo[],

    selectItem: undefined as groupInfo | undefined,

    action: "",

    actorArr: [] as userItem[],

    notUserList: [] as userItem[],


})




export async function getDate() {

    const result = await get();

    data.list.length = 0;
    data.list.push(...result);




}

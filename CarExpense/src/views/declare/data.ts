import { getList, deleteItem } from "@/api"



const column:any[] = [
    {
        label: "序号",
        type: "index",
        width: 60,
        align: "center"

    },

    // {
    //     label: "类型",
    //     prop: "type",
    //     width: 80
    // },
    // {
    //     label: "卡板",
    //     prop: "pcnt",
    //     width: 60,
    //     align: "center"
    // },
    // {
    //     label: "铁桶",
    //     prop: "bcnt",
    //     width: 60,
    //     align: "center"
    // },

    {
        label: "金额",
        prop: "amount",
        width: 60
    }
]


const api = {
    async index() {

        const data = await getList();

        return {
            list: data,
            totalCount: data.length
        }

    },

    async delete(item: carItem) {


        return deleteItem(item.id) as any;


    }
}

const listData = ref<any[]>([]);


export {
    api,
    column,
    listData
}
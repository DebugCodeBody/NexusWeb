
import { getOrder } from "@/api";

import { boxTableControl } from "H:/private/newTool/UI/src/components/boxTable/utils/boxTable";

const tabManage = new boxTableControl({

    column: [
        {
            label: "工单号",
            align: 'center',
            prop: "ordid",
            width: 100
        },
        {
            label: "材料",
            align: 'center',
            prop: "matname"
        },
        {
            label: "数量",
            align: 'center',
            prop: "count",
            width: 80
        },
        {
            label: "规格",
            align: 'center',
            prop: "spec",
            width: 120
        },
        {
            label: "seq",
            align: 'center',
            prop: "seq",
            width: 100
        }
    ]


}, {}, {}, {
    async index(){

        const list = await getOrder();

        return Promise.resolve({
            list,
            totalCount: list.length 
        });
        
    }
});




export default tabManage;
import { getFile } from "@/api/update"



class DataManage {


    dataList = reactive<pdfItem[]>([]);
    

    select = reactive({
        item: undefined as pdfItem | undefined
    });


    async getFile(order: string, hash: string) {

        const result = await getFile(order, hash);

        this.dataList.length = 0;
        this.dataList.push(...result);


    }

    async setSelectItem(item?: pdfItem) {
        this.select.item = item as any;
    }


}



export default new DataManage();





import { defineStore } from "pinia"
import { getTaskList, taskSearch } from "@/api"
import { selectStore } from "@/store/select"



interface newTask {
    sing: singItem,
    priority: number,
    title: string
}

interface cre {
    name: string,
    check: boolean
}

type cres = Array<cre>;

interface STATE {
    /**
     * 所有的数据
     */
    data: singItems,

    /**
     * 新增任务
     */
    addTask: newTask,

    /**
     * 新增窗口是否打开
     */
    addOpen: boolean,

    crt: cres,

    searchText: string,

    /**
     * 列ID绑定数据
     */
    idTable: Record<string | number, singItem>,

    edit: boolean

}

const state: STATE = {
    data: [],

    addTask: {} as newTask,

    addOpen: false,

    crt: [],

    searchText: String.Empty,

    idTable: {},

    edit: false

}


export const dataStore = defineStore('data', {
    state() {
        return state
    },
    actions: {
        async getData() {

            const result = await getTaskList()
            this.setData(result);

        },
        /**
         * 搜索内容，后续会频繁使用
         */
        async onSearch() {
            const seleNama = this.crt.filter((elem) => elem.check).map((elem) => elem.name);
            const result = await taskSearch(seleNama, this.searchText || undefined);

            this.setData(result);
        },
        setData(data: singItems) {
            this.data = data;

            data.forEach((elem) => {
                this.idTable[elem.id] = elem;
            })

        },

        /**
         * 获取移动到指定列是否需要弹窗提示
         * @param id 
         * @returns 
         */
        getMovePop(id: number): boolean {
            return this.idTable[id].ncomment
        },
        getBranchName(id: number) {
            return this.idTable[id].name
        },
        editItem(item: TaskCard) {


            const select = selectStore();

            const sing = this.data.find((elem) => {
                return elem.id == item.stageid
            })!;


            select.item = item;
            this.addTask.sing = sing;
            this.addOpen = true;
            this.edit = true;
            



        }

    }

})
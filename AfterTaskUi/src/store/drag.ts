import { defineStore } from "pinia"
import { moveTask } from "@/api"
import { ElMessage } from 'element-plus'
import { dataStore } from "@/store/data"




interface STATE {
    /**
     * 需要移动的目标
     */
    dragged: singItem | undefined,
    /**
     * 移动到的目标
     */
    related: singItem | undefined,

    /**
     * 移动库的事件
     */
    event: any,

    /**
     * 是否弹窗
     */
    selected: boolean,



    moveDragged: moveDra,

    moveRelated: moveDra,

    /**
     * 留言消息
     */
    memo: string

}



const state: STATE = {
    dragged: undefined,
    related: undefined,

    event: {},

    selected: false,

    moveDragged: {} as moveDra,

    moveRelated: {} as moveDra,

    memo: ""

}




export const dragStore = defineStore('drag', {
    state() {
        return state
    },
    actions: {
        done() {
            const data = dataStore();

            if (data.getMovePop(this.moveRelated.stageid) && this.moveDragged.stageid != this.moveRelated.stageid) {
                this.selected = true;
            } else {
                this.submit();
            }

        },
        async submit() {
            const data = dataStore();

            try {
                await moveTask(this.moveDragged, this.moveRelated, this.memo);
            } catch (error: any) {
                ElMessage.error(error.message || "位置移动失败，请重试！")
            } finally {

                this.selected = false;
                this.memo = String.Empty;

                await data.onSearch();
            }
        },
        getBranchName(id: number) {
            return dataStore().getBranchName(id);
        }

    }
})
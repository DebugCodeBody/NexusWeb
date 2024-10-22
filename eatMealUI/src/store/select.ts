import { defineStore } from "pinia";

interface STATE {
    /**
     * 选中的菜
     */
    item: foodItem,

    /**
     * 选择规格弹窗是否出来
     */
    seleAttr: boolean,

    /**
     * 删除弹窗是否出来
     */
    deleAttr: boolean

}


const state: STATE = {

    item: {} as foodItem,


    seleAttr: false,

    deleAttr: false

}


export const selectStore = defineStore("select", {
    state() {
        return state
    },
    getters: {
    },
    actions: {

        /**
         * 获取指定商品的合并属性
         * @param item 
         * @returns 
         */
        getAttribute(item: Food) {

            const { selectWeight, selectTaste } = item;

            const arr = [];

            if (item.weight && selectWeight != null && selectWeight != -1) {
                arr.push(item.weight[selectWeight])
            }

            if (item.taste && selectTaste != null && selectTaste != -1) {
                arr.push(item.taste[selectTaste])
            }

            return arr.join("/")

        }

    }


})
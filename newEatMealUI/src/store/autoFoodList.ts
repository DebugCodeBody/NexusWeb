import { defineStore } from "pinia";

/**
 * 取出被选中的列表
 * @param atts 
 */
function getSelectAtt(atts: attribute[]) {

    return atts.map((elem) => {

        const retAttr = elem.details.find((attrElem) => attrElem.selected);
        return (retAttr && retAttr.name) || ""

    }).filter(Boolean);

}


interface State {

    date: {
        [key: string]: typeFood
    },

    /** 当前选中的某一个菜 */
    select: reFood;
    propertySelector: boolean;
}


const state: State = {

    date: {} as any,
    propertySelector: false,
    select: {} as reFood
}

export default defineStore("foodList", {
    state() {
        return state
    },
    getters: {
    },
    actions: {
        /** 获取某一天的菜单列表 */
        getDateFood(YMD: string) {

            return this.date[YMD];

        },
        setSelect(value: reFood) {
            this.select = value;
            this.propertySelector = true;
        },
        /** 设置属性选择弹窗是否显示 */
        setSelectProperty(value: boolean) {
            this.propertySelector = value;
        }
    }
})
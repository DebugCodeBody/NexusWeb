import { defineStore } from "pinia";
import { getNextWeekDate, getNowTime, getWeekDate } from "@/utils/time"


interface STATE {

    /**
     * 时间段字符串
     */
    time: Array<string>,

    /**
     * 选中的日期索引
     */
    selectDate: number,

    /**
     * 是否下一周
     */
    next: boolean,

    /**
     * 当前周
     */
    nowWeek: storeDates,

    /**
     * 下一周
     */
    nextWeek: storeDates,


}




const state: STATE = {

    nextWeek: getNextWeekDate().slice(0, -1),
    nowWeek: getWeekDate().slice(0, -1),

    time: ["早餐", "中餐", "晚餐", "夜宵"],

    selectDate: 0,

    next: false


}

const nowTime = getNowTime();
if (nowTime.day == 0) {

    // 如果今天是周日，那就直接跳到下周
    state.next = true;

    state.selectDate = 0;

} else {

    state.selectDate = state.nowWeek.findIndex((elem) => {
        return elem.str === nowTime.str;
    });

}

export const timeStore = defineStore("time", {
    state() {
        return state;
    },

    actions: {

        /**
         * 设置选中日期索引
         * @param index 
         */
        setDate(index: number) {
            this.selectDate = index;

        },

        /**
         * 设置选中日期的时间段索引
         * @param index 
         */
        setKeepTime(index: number) {
            this.activeDate.keepTime = index;
        },

        /**
         * 设置指定日期结束状态
         * @param date 
         * @param val 
         */
        setDateEnd(date: string, val: boolean) {
            this.date.some((elem) => {
                if (elem.str == date) {
                    elem.end = val;
                    return true;
                }
            })
        },

        /**
         * 获取指定日期结束状态
         * @param date 
         * @param val 
         */
        getDateEnd(date: string) {
            const ret = this.date.find((elem) => {
                if (elem.str == date) {
                    return true;
                }
            })

            return ret ? ret.end : true;
        }
    },
    getters: {
        date(): storeDates {
            return this.next ? this.nextWeek : this.nowWeek;
        },

        /**
         * 取出选中的日期对象
         * @returns 
         */
        activeDate(): storeDate {
            return this.date[this.selectDate]
        },

        /**
         * 取出选中的日期时间
         * @returns 
         */
        activeDateStr(): string {
            return this.activeDate.str
        },

        /**
         * 取出选中日期时间的时间段
         * @returns 
         */
        activeDateTime(): number {
            return this.activeDate.keepTime
        },

    }
})
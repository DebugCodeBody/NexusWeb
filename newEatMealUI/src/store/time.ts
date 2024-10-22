import { defineStore } from "pinia";
import getSearch from "@/utils/urlSearch"
import { utipStore } from "@/store"


import dayjs, { Dayjs } from "dayjs";
import zhCnLocale from 'dayjs/locale/zh-cn';




/** 设置每一周第一天为周一 */
dayjs.locale('zh-cn', Object.assign(zhCnLocale, {
    weekStart: 1
}));




class order {

    /** 当前一周的时间列表 */
    time: Time[] = [];

    /** 购物车列表 */
    shopp: any[] = [];

    lastTime: Time = {} as Time;
    nowTime: Time = {} as Time;
    selectYMD = "";

    constructor(date: Dayjs) {

        for (let i = 0; i < 6; i++) {
            const thisDay = date.add(i, 'day');
            this.time.push({
                day: thisDay,
                YMD: thisDay.format('YYYY-MM-DD'),
                MD: thisDay.format('MM.DD'),
                week: thisDay.format('ddd'),
                select: false,
                dot: false,
                disabled: false
            });
        }

        this.activateTime(this.time[0]);

    }

    activateTime(time: Time) {
        this.lastTime = this.nowTime;
        this.nowTime = time;

        this.lastTime.select = false;
        this.nowTime.select = true;

        this.selectYMD = this.nowTime.YMD;

    }


}


const nowDate = dayjs(getSearch("day") || undefined).startOf('day');
const isSunday = nowDate.day() === 0;
if (isSunday) {
    nowDate.add(1, "day",);
}

const noewWeekDate = nowDate.startOf('week');
const nextWeekDate = noewWeekDate.add(1, 'week');

const nowOrder = new order(noewWeekDate);
const nextOrder = new order(nextWeekDate);

if (!isSunday) {

    const nowTMD = nowDate.format("YYYY-MM-DD");

    nowOrder.time.forEach((elem) => {
        if (elem.YMD === nowTMD) {
            nowOrder.activateTime(elem);
        }

        elem.disabled = elem.day.diff(nowDate, "day") <= 0;
        elem.dot = !elem.disabled;
    });
}


/** 切换日期的时候默认选中的时间段 */
const defaultMealTime = MealTime.lunch;

const state = {
    /** 当天是否为周日 */
    isSunday,
    /** 本周的对象 */
    nowOrder,
    /** 下周的对象 */
    nextOrder,
    /** 当前选中的是否为本周 */
    isNow: true,

    /** 选中的时间段 */
    selectMealTime: defaultMealTime,


    MealTimeArr: [
        {
            key: "早餐",
            dot: false,
            value: MealTime.breakfast
        },
        {
            key: "中餐",
            dot: false,
            value: MealTime.lunch
        },
        {
            key: "晚餐",
            dot: false,
            value: MealTime.dinner
        },
        {
            key: "夜宵",
            dot: false,
            value: MealTime.supper
        }

    ]

}


type stateStore = typeof state;

const timeStore = defineStore("time", {

    state() {
        return state
    },
    getters: {


        allTime(): {
            [key: string]: Time
        } {

            const retObj: any = {};
            [...this.nowOrder.time, ...this.nextOrder.time].forEach((elem) => {
                retObj[elem.YMD] = elem
            })

            return retObj
        },

        /** 获取当前选中的周日期对象 */
        order(state: stateStore): order {
            return state.isNow ? state.nowOrder : state.nextOrder;
        },

        /** 获取当前选中的日期数据一周的日期数据 */
        getActivaWeekTime(): Times {
            return this.order.time;
        },

        /** 获取当前选中的一天 */
        getActiveWeekDay(): Time {
            return this.order.nowTime
        },
        /** 获取当前选中的日期 */
        getActiveWeekDateYMD(): string {
            return this.order.selectYMD
        }

    },
    actions: {

        /** 选中是否为本周 */
        setSelectWeek(now: boolean) {

            this.isNow = now;

            this.setMealTime(defaultMealTime);
        },

        /** 选中时间 */
        setSelectTime(time: Time) {

            this.order.activateTime(time);
            this.setMealTime(defaultMealTime);

        },

        /** 选中时间段 */
        setMealTime(value: MealTime) {
            this.selectMealTime = value;
        },

        strGetArrarTime(str: string | string[]) {
            if (!Array.isArray(str)) {
                str = [str]
            }

            return str.map((elem) => {

                for (let index = 0; index < this.nowOrder.time.length; index++) {
                    const element = this.nowOrder.time[index];
                    if (element.YMD === elem) {
                        return element
                    }
                }

            }) as Time[]



        }
    }

})



export default timeStore;




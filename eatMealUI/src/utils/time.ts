import moment from "moment";
moment.locale('zh-cn', {
    weekdays: '周日_周一_周二_周三_周四_周五_周六'.split('_')
})

window.moment = moment;

/**
 * 取出这一周的所有时间
 * @returns 
 */
export function getWeekTime(): Array<string> {

    const retTime = [];
    const time = moment();

    const weekOfday = time.format("d");

    time.subtract(weekOfday == "0" ? 7 : weekOfday, "day");

    for (let i = 0; i < 7; i++) {
        retTime.push(time.add(1, "days").format("MM.DD"));
    }

    return retTime;
}

/**
 * 获取下一周时间
 * @returns 
 */
export function getNextWeekTime(): Array<string> {

    const retTime = [];

    const time = moment(getWeekTime()[6]);

    for (let i = 0; i < 7; i++) {
        retTime.push(time.add(1, "days").format("MM.DD"));
    }

    return retTime;
}

export function getWeekDate() {

    const retTime = [];
    const time = moment();

    const weekOfday = time.format("d");

    time.subtract(weekOfday == "0" ? 7 : weekOfday, "day");

    for (let i = 0; i < 7; i++) {
        time.add(1, "days");

        retTime.push({
            date: time.format("YYYY-MM-DD"),
            str: time.format("MM.DD"),
            weekday: time.format("dddd"),
            keepTime: 1,
            end: false
        });
    }

    return retTime;

}

export function getNextWeekDate() {
    const retTime = [];
    const time = moment().add(1, 'week').startOf('isoWeek');

    const weekOfday = time.format("d");

    time.subtract(weekOfday == "0" ? 7 : weekOfday, "day");

    for (let i = 0; i < 7; i++) {
        time.add(1, "days");

        retTime.push({
            date: time.format("YYYY-MM-DD"),
            str: time.format("MM.DD"),
            weekday: time.format("dddd"),
            keepTime: 1,
            end: false
        });
    }

    return retTime;

}



/**
 * 获取今天的日期
 */
export function getNowTime() {
    const noeTime = moment();

    return {
        str: noeTime.format("MM.DD"),
        day: noeTime.weekday()

    }
}


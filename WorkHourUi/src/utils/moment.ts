import moment, { Moment } from "moment";

moment.locale('zh-cn', {
    weekdays: '周日_周一_周二_周三_周四_周五_周六'.split('_')
})

window.moment = moment;


/**
 * 所有某月有几个周。每个周的开始时间个结束时间
 * 
 * 这里是周一算第一天，周日算最后一天
 * @returns 
 */
export function getAllWeek(date: string | moment.Moment) {




    const nowDay = moment();
    const startDay = moment(date);
    const endDay = moment(startDay).endOf('month');
    let Days = startDay.daysInMonth();







    const weekArr = [];
    let lastDay = startDay;


    while (Days > 0) {

        const start = moment(lastDay);


        let end:Moment;

        /** 
         * 如果开始日期是周日的话
         * 
         */
        if (start.day() == 0) {

            end = start.clone();
        }else{
            end = moment(lastDay).endOf("week");
        }




        /** 如果是周六的话，那就加1 */
        if (end.day() == 6) {
            end = end.add(1, "day");
        }

        /** 如果结束时间大于月尾时间 */
        if (end.isAfter(endDay)) {
            end = endDay;
        }

        const diffDay = end.diff(start, "day") + 1;


        weekArr.push({
            start: moment(start),
            end: moment(end),
            day: diffDay,
        })


        lastDay = end.add(1, "day");
        Days -= diffDay;


    }






    // while (Days > 0) {
    //     if (lastDay.diff(nowDay, "days") >= 0) {
    //         /**
    //          * 这里直接返回去，就不用计算剩余时间
    //          * 不然的话逻辑写一大堆
    //          */
    //         return weekArr
    //     }

    //     let week: Moment;
    //     let weekDay = 0;

    //     /** 如果当天是周日的话 */
    //     if (parseInt(lastDay.format('d')) == 0) {
    //         week = lastDay;
    //         weekDay = 1;
    //     } else {
    //         week = moment(lastDay).weekday(7);
    //         weekDay = week.diff(lastDay, "days") + 1;
    //     }

    //     weekArr.push({
    //         start: moment(lastDay),
    //         end: moment(week),
    //         day: weekDay,
    //     })

    //     lastDay = moment(week).add(1, "days");
    //     Days -= weekDay;

    // }



    return weekArr

}

/**
 * 获取上一个月的所有周
 * @returns 
 */
export function getLastMonthAllWeek() {
    return getAllWeek(moment().subtract(1, 'months').startOf('month'))
}

/**
 * 获取指定日期是周几
 * @param date 
 * @returns 
 */
export function getWeekText(date: string) {

    const splitDate = parseInt(date.split("-")[0]);
    const timeDay = moment().format("MM");

    if (splitDate == 12 && parseInt(timeDay) == 1) {
        return moment(`2022-${date}`).format("dddd")

    }



    return moment(`${moment().format("YYYY")}-${date}`).format("dddd")

}

export function getMonthAllWeek(month: number) {
    return getAllWeek(moment().month(month).startOf('month'))

}
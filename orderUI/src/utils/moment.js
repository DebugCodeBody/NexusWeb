import moment from "moment";
import timeMap from "@/minxins/timeMap";

window.moment = moment;

let cacheDate;
let toDate;

/**
 * 获取当前这一周的时间
 * @returns
 */
export function getWeeksDays() {
  if (cacheDate) {
    return cacheDate;
  }

  cacheDate = [];

  let time = moment();

  let weekOfday = parseInt(time.format("d"));
  time.subtract(weekOfday == 0 ? 7 : weekOfday, "day");

  for (let i = 0; i < 7; i++) {
    cacheDate.push({
      name: time.add(1, "days").format("MM.DD"),
      time: time.unix(),
      focus: time.format("d") == weekOfday,
      date: time.format("YYYY-MM-DD")
    });
  }

  return cacheDate;
}

/**
 * 获取下一周的时间
 * @returns
 */
export function getToWeekDays() {
  if (toDate) {
    return toDate;
  }

  const past = getWeeksDays();

  toDate = [];
  const weekTime = moment(past[past.length - 1].date);

  for (let i = 0; i < 7; i++) {
    toDate.push({
      name: weekTime.add(1, "days").format("MM.DD"),
      time: weekTime.unix(),
      focus: false,
      date: weekTime.format("YYYY-MM-DD")
    });
  }

  return toDate;
}

/**
 * 当前这一周和下周的时间
 */
export function FullTime(state) {
  const TimeMap = timeMap.data().timeMap;
  [].concat(getWeeksDays(), getToWeekDays()).forEach(elem => {
    const time = {};
    TimeMap.forEach(elem => {
      time[elem.key] = [];
    });

    state[elem.date] = {
      time,
      packageLength: 0,
      totleLength: 0,
      totleMoney: 0,
      edit:false
      
    };
    if (elem.focus) {
      state.to = state[elem.date];
    }
  });

  return state;

}


[{ id: 0, shopp: {}, num: 0, packag: false }];

import { getWeeksDays, getToWeekDays, FullTime } from "@/utils/moment";
import timeMap from "@/minxins/timeMap";
import bigjs from "big.js";

const state = FullTime({
  to: {},
  show: false
});



function findShopp(item, id) {
  return item.findIndex(elem => {
    return elem.id == id;
  });
}

/**
 * 切换某款商品某个时间点是否锁住
 * @param {*} item 
 * @param {*} time 
 * @param {*} statu 
 */
function lockTimeShopp(item, time, statu) {
  item[time].lock = statu;

}


const mutations = {
  // 添加一个商品，如果有的话则无法添加
  ADD_FOOD(state, { time, shopp }) {

    lockTimeShopp(shopp, time, true);

    time = state.to.time[time];

    const index = findShopp(time, shopp.id);
    if (index == -1) {
      state.to.totleLength += 1;
      time.push({
        id: shopp.id,
        shopp,
        num: 1,
        packag: false
      });

      state.to.totleMoney = bigjs(state.to.totleMoney).add(shopp.fprice).toNumber();
    }

  },

  // 给某件商品增减数量，增减总价格
  // 如果减少到0的话，那就把这个商品删除掉
  OPERATION_WEIGHT(state, { time, shopp, num }) {
    const operation = time;
    time = state.to.time[time];

    const index = findShopp(time, shopp.id);
    if (index > -1) {
      time[index].num += num;

      const OPERATION = (num > 0 ? "add" : "sub")
      state.to.totleMoney = bigjs(state.to.totleMoney)[OPERATION](shopp.fprice).toNumber();

      if (time[index].num <= 0) {
        state.to.totleLength -= 1;
        if (time[index].packag) {
          state.to.packageLength -= 1;
        }
        time.splice(index, 1);

        lockTimeShopp(shopp, operation, false);
        if (state.to.totleLength <= 0) {
          
          state.show = false;
          this.state.foodlist.foodshow = false;
        }
      }

    }

  },
  // 打包数量加一或者减一
  CALCULATE_PACKAGE(state, num) {
    state.to.packageLength += num ? 1 : -1;
  },
  // 全部打包或者取消全部打包
  SWITCH_PACKAG(state, packag) {

    const to = state.to;

    for (const [key, value] of Object.entries(to.time)) {
      value.forEach(elem => {
        elem.packag = packag;
      });
    }

    to.packageLength = packag ? to.totleLength : 0;
  },

  SWITCH_SHOW(state) {
    state.show = !state.show;
  },
  OPEN_SHOW(state) {
    state.show = true;
  },
  CLOSE_SHOW(state) {
    state.show = false;
  },

  // 清空购物车
  DELETE_ALL(state) {
    const to = state.to;

    for (const [key, value] of Object.entries(to.time)) {
      to.time[key].forEach((elem) => {

        lockTimeShopp(elem.shopp, "lunch", false);
        lockTimeShopp(elem.shopp, "night", false);
        lockTimeShopp(elem.shopp, "midnight", false);
        lockTimeShopp(elem.shopp, "break", false);


      })
      to.time[key] = [];
    }

    to.packageLength = to.totleLength = to.totleMoney = 0;

  },
  // 切换日期购物车
  SWITCH_DATE(state, date) {
    state.to = state[date] || {};
  },

  ADD_HISTORY(state, { date, old, item }) {
    // old : 时间，数量，打包状态

    lockTimeShopp(item, old.time, true);

    state[date].time[old.time].push({
      id: item.id,
      shopp: item,
      num: old.fqty,
      packag: old.fprice_pack
    })


    state[date].totleMoney = bigjs(state[date].totleMoney).add(bigjs(item.fprice).times(old.fqty))

    state[date].totleLength += 1;

    if (old.fprice_pack) { state[date].packageLength += 1 };




  },
  EMPTY_THEDAY(state) {




    timeMap.data().timeMap.map((elem) => {
      state.to.time[elem.key].length = 0;
    })


    state.to.packageLength = 0;
    state.to.totleLength = 0;
    state.to.totleMoney = 0;
    state.to.edit = true;

  },
  CLONE_TO(state, value) {

    timeMap.data().timeMap.map((elem) => {
      state.to.time[elem.key].length = 0;

      [].push.apply(state.to.time[elem.key], value.time[elem.key])

    })

    state.to.packageLength = value.packageLength;
    state.to.totleLength = value.totleLength;
    state.to.totleMoney = value.totleMoney;
    state.to.edit = value.edit;

  }
};

export default {
  namespaced: true,
  state,
  mutations
};

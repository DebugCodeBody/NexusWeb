[{ id: 0, shopp: {}, num: 0, packag: false }];

import { getWeeksDays, getToWeekDays, FullTime } from "@/utils/moment";
import timeMap from "@/minxins/timeMap";
import bigjs from "big.js";

const state = FullTime({
  to: {},
  show: false
});


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
  // 切换日期购物车
  SWITCH_DATE(state, date) {
    state.to = state[date] || {};
  },
  SWITCH_SHOW(state,value){
    state.show = value;
  },
  OPEN_SHOW(state){
    state.show = true;
  },
  CLOSE_SHOW(state){
    state.show = false;
  },

  // 添加历史
  ADD_HISTORY(state, { date, old, item }) {
    // old : 时间，数量，打包状态
    
    lockTimeShopp(item, old.time, true);

    state[date].time[old.time].push({
      id: item.id,
      shopp: item,
      num: old.fqty,
      packag: old.fprice_pack
    });

    state[date].totleMoney = bigjs(state[date].totleMoney).add(
      bigjs(item.fprice).times(old.fqty)
    );


    state[date].totleLength += 1;
    if (old.fprice_pack) {
      state[date].packageLength += 1;
    }

  },
  // 切换编辑模式，把当前选中日子的订单全部清掉
  EMPTY_THEDAY(state){

    timeMap.data().timeMap.map((elem)=>{
      state.to.time[elem.key].length = 0;
    })

    
    state.to.packageLength = 0;
    state.to.totleLength = 0;
    state.to.totleMoney = 0;
    state.to.edit = true;
    
  },
  CLONE_TO(state,value){
    timeMap.data().timeMap.map((elem)=>{
      state.to.time[elem.key].length = 0;

      [].push.apply(state.to.time[elem.key],value.time[elem.key])

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

import { mapGetters, mapState } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      nowTime: moment(),
      nametoKey:{
        "早餐": "break" ,
        "中餐": "lunch" ,
        "晚餐": "night" ,
        "夜宵": "midnight" 
      },
      timeMap: [
        { name: "早餐", key: "break" },
        { name: "中餐", key: "lunch" },
        { name: "晚餐", key: "night" },
        { name: "夜宵", key: "midnight" }
      ]
    };
  },
  computed:{
    ...mapState({
      selectedDate: state => state.foodlist.showDate,
    }),
    overdueTime() {
      // 判断一下当前时间是不是可以提交点餐
      // 一般来说，当天只能点明天的餐，前面的餐都不允许点

      return moment(this.selectedDate).diff(this.nowTime.format("YYYY-MM-DD"), "day")  <= 0; 
    },
  }
};

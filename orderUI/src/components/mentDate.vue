<template>
  <ul class="date-list" ref="date-list">
    <li v-if="future" @click="determineCart(topast)">
      <div class="week">上周</div>
      <div class="date">{{futureText}}</div>
    </li>
    <li
      ref="dateItem"
      v-for="item in dataList"
      :key="item.name"
      @click="determineCart(swutchDate,item)"
      :class="{ activation: item.focus }"
    >
      <div class="week">周 {{ item.week }}</div>
      <div class="date">{{ item.name }}</div>
    </li>
    <li v-if="!future" @click="determineCart(tofuture)">
      <div class="week">下周</div>
      <div class="date">{{futureText}}</div>
    </li>
  </ul>
</template>

<script>
import { mapState } from "vuex";

import { getWeeksDays, getToWeekDays } from "@/utils/moment";
import { FoodProcess, processHistory } from "@/utils/processFood";
import { getorderlist, getdatefood } from "@/api";

const showTitle = ["一", "二", "三", "四", "五", "六", "日"];

export default {
  name: "mentDate",
  components: {},
  props: {},
  beforeCreate() {},
  created() {
    this.topast();
  },
  beforeMount() {},
  data() {
    return {
      future: false,
      focusDate: {},
      dataList: [],
      futureText: ""
    };
  },
  watch: {},
  computed: {
    ...mapState({
      cartLength: state => state.cart.to.totleLength
    })
  },
  methods: {
    determineCart(call,item){
        if (this.cartLength > 0) {
        
        this.$dialog.alert({
          title: "提示",
          message: "请提交或者清空购物车再切换时间"
        })

      }else{
        call(item);
      }

    },
    click(item) {
      if (this.cartLength > 0) {
        
        this.$dialog.alert({
          title: "提示",
          message: "请提交或者清空购物车再切换时间"
        })

      }else{
        this.swutchDate(item);
      }

    },
    swutchDate(item){
      // 切换时间
      
      if (this.focusDate == item) {
        return;
      }
      if (this.focusDate) {
        this.focusDate.focus = false;
      }

      item.focus = true;
      this.focusDate = item;

      const { date } = item;

      this.$store.commit("foodlist/SWITCH_SUBMITLOCK", true);
      this.loading = this.$toast.loading({
        duration: 0,
        message: "加载中..."
      });

      
      // commit 是没有返回值的呀
      const result = this.$store.state.foodlist.data[date];
      if (result) {
        this.endLoading(date);
      } else {
        this.endLoading(date);

        getorderlist(date).then(data => {

            this.$store.commit("foodlist/ADD_LIST", {
              date,
              data: FoodProcess(data.list),
              end: data.end
            });

            // if(data.end){
              
            //   this.$toast.fail("当天点餐已经结束",{
            //     duration: 1000
            //   });

            // }


            this.addHistory(data.list, date);
          })
          .catch(error => {
            this.$toast.loading({
              type: "fail",
              message: (error &2& error.msg) || "获取失败，请稍后重试！",
              duration: 1500
            });

            console.error("获取菜单失败", error);
          });
      }

    },
    endLoading(date) {
      // 结束加载动画
      // 切换时间
      // 解锁界面

      this.loading.clear();
      this.loading = null;

      this.$store.commit("foodlist/SWITCH_DATE", date);
      this.$store.commit("cart/SWITCH_DATE", date);
      this.$store.commit("order/SWITCH_DATE", date);
      this.$store.commit("foodlist/SWITCH_SUBMITLOCK", false);
    },
    addHistory(list, date) {
      getdatefood(this.$store.getters.userEmpid, date).then(history => {
        history = processHistory(history);

        history.forEach(elem => {
          list.findIndex(item => {
            if (item.fid == elem.fid && item.fnamespice == elem.fnamespice &&  item.ftype != "夜宵") {
              this.$store.commit("order/ADD_HISTORY", {
                date,
                old: elem,
                item
              });
              return true;
            }
          });
        });
      });
    },

    /**
     * 
     * @param {*} WeeksDays 需要显示的日子 
     * @param {*} hiddenDays 需要隐藏的日子
     */
    switchWeek(WeeksDays) {
      // 在点击上下周的时候，需要把当前选中的时间给保存起来
      // 然后切换到指定周的时候，需要把上一次选中时间给高亮和保证显示

     
      // 把时间用周一，周二来格式化，其实这个在时间库上面实现更好
      this.dataList = showTitle.map((elem, index) => {
        return Object.assign(WeeksDays[index], {
          week: elem
        });
      });


      let index = this.dataList.findIndex(elem => {
        return elem.focus;
      });


     

      index = index >= 0 ? index : 0;
      this.focusDate = {};
      this.swutchDate(this.dataList[index]);

      this.$nextTick(() => {
        // 找到点击的位置，滚到那个位置
        const listWrap = this.$refs["date-list"];

        const dataItem = this.$refs["dateItem"][index];

        let offsetLeft;
        if (index == 0) {
          offsetLeft = 0;
        } else if (index == 6) {
          offsetLeft = listWrap.clientWidth;
        } else {
          offsetLeft = dataItem.offsetLeft;
        }
        listWrap.scrollTo({
          left: offsetLeft,
          behavior: "smooth"
        });

      });


    },
    /**
     * 把 上一周或者一下周选中的时间显示出来，把 ~~~ 替换掉
     * @param {*} hiddenDays 
     */
    findfutureText(hiddenDays){
      let index = hiddenDays.findIndex((elem)=>{
        return elem.focus
      })



      index = index == -1 ? 0 : index;
      this.futureText =  hiddenDays[index].name;



    },
    topast() {
      // 点击上一周
      this.future = false;
      this.switchWeek(getWeeksDays());
      this.findfutureText(getToWeekDays());
    },
    tofuture() {
      // 点击下一周
      this.future = true;
      this.switchWeek(getToWeekDays());
      this.findfutureText(getWeeksDays());

    }
  },
  mounted() {
    const dataList = this.$refs["date-list"];
    const focusDate = this.$refs["date-list"].querySelector("li.activation");
    if (dataList && focusDate) {
      if (focusDate.offsetLeft + focusDate.clientWidth > dataList.clientWidth) {
        dataList.scrollLeft = focusDate.offsetLeft + focusDate.clientWidth;
      }
    }
  },
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss">
.date-list {
  overflow: auto;
  display: block;
  white-space: nowrap;
  background-color: white;

  li {
    text-align: center;

    display: inline-block;
    padding: 10px 20px;

    .week {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 2px;
    }

    .date {
      font-size: 12px;
      padding-bottom: 5px;
    }
    &.activation .date::after {
      content: "";
      margin-top: 3px;
      display: block;
      height: 4px;
      background-color: rgb(64, 158, 255);

      border-radius: 10px;
    }
  }
}
</style>

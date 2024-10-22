<template>
  <div class="menu_wrappe">
    <div style="display: flex;width: 100%; flex:1;">
      <!-- 左边显示的项目 -->
      <div class="title-list-wrap">
        <ul class="title-list">
          <template  v-for="(item, index) in shoppList"
            >
          <li
            :key="index"
            :ref="item"
            :class="{
              top: index == activation - 1,
              activation: index == activation
            }"
            @click="titleClick(index, item)"
          >
            {{ item }}
          </li>
          </template>
          <li></li>
        </ul>
      </div>

      <menuList
        :data="showData"
        ref="menu-list-wrap"
        :disabled="overdueTime || end"
        :edit="editModule"
      />
    </div>

    <div class="submit-wrap" :class="{ 'no-naviga': noNavigation  }">
      <van-badge
        :content="cartLength"
        :class="{ 'badge-show': cartLength > 0 }"
      >
        <van-button
          title="购物车"

          v-show="editModule && !(overdueTime || showData.length == 0)"
          type="primary"
          size="normal"
          color="#409EFF"
          icon="shopping-cart-o"
          style="min-width:auto"
          @click="cartClick"
        ></van-button>
      </van-badge>

      <div class="submit">
        <price v-model="price" size="20" />

        <van-badge
          title="已点清单"
          :content="orderLength"
          :class="{ 'badge-show': orderLength > 0 }"
          v-if="orderLength > 0"
        >
          <van-button
            type="primary"
            size="normal"
            color="#409EFF"
            icon="orders-o"
            style="min-width:auto"
            @click="orderClick"
          ></van-button>
        </van-badge>

        <van-button
          v-if="editModule && !(overdueTime || showData.length == 0)"
          :loading="submit"
          loading-text="正在提交"
          type="primary"
          size="normal"
          color="#409EFF"
          :disabled="overdueTime || showData.length == 0 "
          @click="submitClick"
          >提交</van-button
        >
      </div>
    </div>
    <van-dialog
      v-model="dialogShow"
      show-cancel-button

      :message="(rice.length == 0 && food.length == 0 ) ? '确认提交？' : '' "
      :title="(rice.length > 0 || food.length > 0 )  ? '确认提交？' : '' "

      @confirm="sendSubmit"
    >
      
      <div
        style="text-align: center; font-size: 12px; color: red; margin:10px 0;"
        v-for="name in rice"
        :key="name"
      >
        <span>{{ name }}主食没有点，请确认</span>
      </div>
      
      <div
        style="text-align: center; font-size: 12px; color: red; margin:10px 0;"
        v-for="name in food"
        :key="name"
      >
        <span>{{ name }}菜品没有点，请确认</span>
      </div>

    </van-dialog>
  </div>
</template>

<script>
import price from "@/components/price.vue";
import menuList from "@/components/menuList";
import timeMap from "@/minxins/timeMap";
import { selectRice,selectFood } from "@/utils/processFood";

import { submitorder } from "@/api";
import { mapGetters, mapState } from "vuex";

const sorting = ["早餐","主食", "菜", "餐餐有" ,"汤", "小吃", "蔬菜", "蘸料"];

export default {
  name: "mentConnect",
  mixins: [timeMap],
  components: {
    menuList,
    price
  },
  props: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  data() {
    return {
      shoppList: [].concat(sorting),
      activation: 0,
      submit: false,

      dialogShow: false,
      rice: [],
      food: [],
    };
  },
  watch: {},
  computed: {
    ...mapState({
      cartLength: state => state.cart.to.totleLength,
      orderLength: state => state.order.to.totleLength,
      showData: function(state){


        const retVal = [];
        const showDate = state.foodlist.showDate;
        const data = state.foodlist.data[state.foodlist.showDate] || {};




        if (Object.keys(data).length > 0) {


          sorting.forEach((name,i) => {
            
            if (data[name]) {
              const index = this.shoppList.indexOf(name);
              if(index == -1){
                this.shoppList.splice(i,0,name)
              }


              retVal.push({
                name,
                items: data[name]
              });
            }else{
              const index = this.shoppList.indexOf(name);
              if(index > -1){
                this.shoppList.splice(index,1)
              }
            }

          });



        }

        retVal.date = showDate;
        return retVal;
      }
    }),

    editModule() {
      /**
       * 是否编辑模式
       */

      // 如果购物车数量为0，且订单列表数量也为0。那么就代表今天没有点餐，直接为编辑模式
      if (this.cartLength == 0 && this.orderLength == 0) {
        return true;
      }

      return this.cartLength > 0 && this.orderLength == 0;
    },
    price() {
      return this.$store.getters.totleMoney;
    },
    end: {
      get() {

        const { data } = this.$store.state.foodlist;

        return  data[this.selectedDate] && (data[this.selectedDate].lock || data[this.selectedDate].end ) || false

      },
      set(statu) {
        this.$store.commit("foodlist/LOCK_DATE", {
          statu,
          date: this.selectedDate
        });
      }
    },
    show: {
      get() {
        return this.$store.state.foodlist.foodshow;
      },
      set(value) {
        this.$store.state.foodlist.foodshow = value;
      }
    },
    noNavigation() {
      return this.cartLength == 0 && this.orderLength == 0;
    }
  },
  methods: {
    listWrapScroll(event) {
      let topEle,
        index = 0;

      if (this.scrollLock) {
        if (
          this.offsetTop == event.target.scrollTop ||
          event.target.clientHeight + event.target.scrollTop ==
            event.target.scrollHeight
        ) {
          this.scrollLock = false;
        }
        return;
      }

      for (let [key, values] of Object.entries(
        this.$refs["menu-list-wrap"].$refs
      )) {
        values = values[0];
        if (!values) {
          continue;
        }

        if (event.target.scrollTop >= values.offsetTop) {
          topEle = values;
        } else if (topEle) {
          this.activation = index - 1;
          break;
        }
        index += 1;
      }
    },
    titleClick(index, name) {
      if (this.activation == index) {
        return;
      }
      this.activation = index;

      let elem = this.$refs["menu-list-wrap"].$refs[name];
      if (elem && elem.length > 0) {
        elem = elem[0];

        this.scrollLock = true;
        this.offsetTop = index == 0 ? 0 : elem.offsetTop;
        elem.parentElement.scrollTo({
          top: this.offsetTop,
          behavior: "smooth"
        });
      }
    },
    submitClick() {
      // 提交菜单
      if (!this.show) {
        this.cartClick();
      } else {
        this.rice = selectRice(this.$store.state.cart.to.time);
        this.food = selectFood(this.$store.state.cart.to.time);

        this.dialogShow = true;
      }
    },
    cartClick() {
      // 弹出购物车列表
      if (this.show) {
        this.show = false;
        this.$store.commit("order/CLOSE_SHOW");
        this.$store.commit("cart/CLOSE_SHOW");
      } else {
        this.show = true;
        this.$store.commit("order/CLOSE_SHOW");
        this.$store.commit("cart/OPEN_SHOW");
      }
    },
    orderClick() {
      // 弹出已点清单列表
      if (this.show) {
        this.show = false;
        this.$store.commit("order/CLOSE_SHOW");
        this.$store.commit("cart/CLOSE_SHOW");
      } else {
        this.show = true;
        this.$store.commit("order/OPEN_SHOW");
        this.$store.commit("cart/CLOSE_SHOW");
      }
    },
    endOrder() {
      // 结束当天的点餐

      // this.end = true;
      // this.show = false;


      // this.$store.commit("order/CLOSE_SHOW");
      // this.$store.commit("cart/CLOSE_SHOW");

    },
    sendSubmit() {
      // 发送提交

      this.submit = true;
      this.$store.commit("foodlist/SWITCH_SUBMITLOCK", true);

      const data = this.$store.state.cart.to.time;
      const empid = this.$store.getters.userEmpid;

      return submitorder(empid, this.selectedDate, data)
        .then(({ data, msg }) => {
          this.$toast.success("提交成功");


          this.$store.commit("order/CLONE_TO",this.$store.state.cart.to);

          this.$store.commit("cart/CLOSE_SHOW");
          this.$store.commit("cart/EMPTY_THEDAY");
          this.$store.commit("order/OPEN_SHOW");
        })
        .catch(error => {
          if (error.code == 300) {
            this.endOrder();
          }


          this.$toast.fail(error.msg || error.message || "提交失败,请稍后重试",{
              duration: 1000
          });

          
        })
        .finally(() => {
          this.submit = false;
          this.$store.commit("foodlist/SWITCH_SUBMITLOCK", false);
        });
        
    }

  },
  mounted() {
    this.$refs["menu-list-wrap"].$refs["card-wrap"].addEventListener(
      "scroll",
      this.listWrapScroll
    );
  },
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss">
.submit-wrap {
  &.no-naviga {
    display: none !important;
    height: 0px !important;

    .submit,
    .van-badge__wrapper {
      display: none !important;
    }
  }

  .van-badge {
    opacity: 0;
    top: 4px;
    right: 4px;
  }

  .badge-show .van-badge {
    opacity: 1;
    transform: rotate;
  }
}
</style>

<template>
  <div class="shopp-cart"  @click.capture="checkboxClick" >
    <div class="features" >
      <van-checkbox
        v-model="packagAll"
        shape="square"
        icon-size="18px"
        label-disabled
        style="opacity: 0;"
        >打包</van-checkbox
      >

      <span>已点清单</span>

      <div class="delete" @click="editOrder" ref="edit">
        <template v-if="!overdueTime && !end" ><van-icon name="edit" /> 编辑</template>
        <div v-else style="width:53px;"></div>

      </div>
    </div>
    <div class="list-wrap">
      <template v-for="({ name, key }, index) in timeMap">
        <div class="list" v-if="cart[key].length > 0" :key="index" >
          <div class="title">{{ name }}</div>
          <ul>
            <li v-for="item in cart[key]" :key="item.id">
              <dishes :name="item.shopp.fnamespice" />

           
              <div class="num-wrap">
                <van-tag plain type="primary" class="pack-lable" v-if="item.packag">打包</van-tag>
                <div class="wrap">
                  <price :price="item.shopp.fprice" size="16" />
                  <span class="num">{{item.num}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import timeMap from "@/minxins/timeMap";
import price from "@/components/price.vue";
import dishes from "@/components/dishes.vue";

import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "menuShoppCart",
  mixins: [timeMap],
  components: {
    price,
    dishes
  },
  props: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  data() {
    return {
      packagAll: false
    };
  },
  watch: {
    ["$store.state.order.to.packageLength"](value) {
      const { totleLength } = this.$store.state.order.to;
      this.packagAll = totleLength > 0 && value == totleLength;
    },
    ["$store.state.order.to.totleLength"](value) {
      this.packagAll = value > 0 && value == this.$store.state.order.to.packageLength;
    }
  },
  computed: {
    cart() {
      return this.$store.state.order.to.time;
    },
    show: {
      get() {
        return this.$store.state.foodlist.foodshow;
      },
      set(value) {
        this.$store.state.foodlist.foodshow = value;
      }
    },
    end: {
      get() {

        const { data } = this.$store.state.foodlist;

        return  data[this.selectedDate] && (data[this.selectedDate].lock || data[this.selectedDate].end ) || false

      }
    },
  },
  methods: {
    ...mapMutations({
      cartOperation: "order/OPERATION_WEIGHT",
      allPackag: "order/SWITCH_PACKAG",
    }),
    
    editOrder() {

      this.$store.dispatch("user/CONFIRM_EDIT").then(()=>{
          this.$store.commit("order/CLOSE_SHOW");
          this.$store.commit("cart/OPEN_SHOW");
      })

    },
    checkboxClick(event){
      /**
       * 拦截订单列表的全部操作，除非是点击右上角的编辑
       */
    
      const { target } = event;
      
      if(!this.$refs.edit.contains(target)){
          event.preventDefault();
          event.stopPropagation();
      }

    }
  },
  mounted() {
     this.packagAll = this.$store.state.order.to.totleLength == this.$store.state.order.to.packageLength;
  },
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.shopp-cart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
   padding: 5px;
    padding-top: 10px;
    box-sizing: border-box;

  .features {
    display: flex;

    justify-content: space-between;
    align-items: center;

    padding-bottom: 10px;
    .delete {
      float: right;
    }
  }

  .list-wrap {
    overflow: auto;
  }
  .list {
    .title {
      font-weight: bold;
      margin: 10px 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      border-bottom: 1px solid #ebedf0;
    }

    .num-wrap {
      display: flex;
      align-items: center;
      .wrap{
        box-sizing: border-box;
        margin-right: 10px;
        padding: 5px 10px;
        color: #323233;
        background-color: #f2f3f5;
        width: 90px;

        display:flex;
        justify-content: flex-end;
      }
    }
  }
  .pack-lable{
    margin-right: 10px;
  }
}


</style>

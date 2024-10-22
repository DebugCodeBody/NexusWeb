<template>
  <div class="shopp-cart"  >
    <div class="features">
      <van-checkbox
        v-model="packagAll"
        shape="square"
        icon-size="18px"
        @click="clickallPackag"
        >打包</van-checkbox
      >
      <span>购物车</span>
      <div class="delete" @click="deleteAll">
        <van-icon name="delete-o" /> 清空
      </div>
    </div>
    <div class="list-wrap">
      <template v-for="({ name, key }, index) in timeMap">
        <div class="list" v-if="cart[key].length > 0" :key="index" >
          <div class="title">{{ name }}</div>
          <ul>
            <li v-for="item in cart[key]" :key="item.id">
              <van-checkbox
                v-model="item.packag"
                shape="square"
                icon-size="18px"
                @click="calculatePackage(item.packag)"
              >
              <dishes :name="item.shopp.fnamespice" />
              </van-checkbox>
              <div class="num-wrap">
                <price :price="item.shopp.fprice" size="16" />
                <van-stepper
                  min="0"
                  async-change 
                  :disable-input="true"
                  :long-press="false"
                  :value="item.num"

                  @change="(value)=>{ onChange(value,item,key) }"

                />
              </div>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script>


// @plus="Add(key, item)"
// @minus="Dele(key, item)"

import timeMap from "@/minxins/timeMap";
import price from "@/components/price.vue";
import dishes from "@/components/dishes.vue";

import { mapGetters, mapState, mapMutations } from "vuex";
import { submitorder  } from "@/api"


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
    ["$store.state.cart.to.packageLength"](value) {
      const { totleLength } = this.$store.state.cart.to;
      this.packagAll = totleLength > 0 && value == totleLength;
    },
    ["$store.state.cart.to.totleLength"](value) {
      this.packagAll = value > 0 && value == this.$store.state.cart.to.packageLength;
    }
  },
  computed: {
     ...mapState({
      selectedDate: state => state.foodlist.showDate,
    }),
    cart() {
      return this.$store.state.cart.to.time;
    },
    
    show: {
      get() {
        return this.$store.state.foodlist.foodshow;
      },
      set(value) {
        this.$store.state.foodlist.foodshow = value;
      }
    }
  },
  methods: {
    ...mapMutations({
      cartOperation: "cart/OPERATION_WEIGHT",
      allPackag: "cart/SWITCH_PACKAG",
      calculatePackage: "cart/CALCULATE_PACKAGE",
      deleteCartAll: "cart/DELETE_ALL"
    }),
    clickallPackag() {
      this.allPackag(this.packagAll);
    },
    Add(time, item) {
      const num = 1;
      const { shopp } = item;
      this.cartOperation({ time, shopp, num });
    },
    Dele(time, item) {
      const num = -1;
      const { shopp } = item;
      this.cartOperation({ time, shopp, num });
    },
    onChange(value,item,key) {
      if(this.lockOperation){
        this.lockOperation = false;
        return;
      }


      this.lockOperation = true;
      const big = item.num > value ;
      let message = ""

      if(value == 0){
        if(this.$store.state.cart.to.totleLength == 1){
          return this.deleteAll();
        }
        
        message = "是否删除菜品？"
      }else{
        message = `是否${ big ? "删除" : "增加" }数量？`
      }

      

      this.$dialog
        .confirm({
          message,
          closeOnClickOverlay: false
        })
        .then(()=>{
          if(big){
            this.Dele(key,item)

          }else{
            this.Add(key,item)

          }
          
        })
        .catch((error) => {
          this.lockOperation = false;
        });
    },
    deleteAll() {
      this.$dialog
        .confirm({
          message: "是否清空今日点餐？"
        })
        .then(this.deleteCart)
        .catch((error) => {
          console.log(error)
        });
    },
    deleteCart(){
  
      this.$store.commit("foodlist/SWITCH_SUBMITLOCK", true);

 
      const empid = this.$store.getters.userEmpid;

      return submitorder(empid, this.selectedDate, []).then(({ data, msg }) => {
            
            this.$toast.success("提交成功");

            this.deleteCartAll();
            this.$store.commit("cart/CLOSE_SHOW");
            this.$store.commit("order/CLOSE_SHOW");
            this.show = false;


          }).catch(error => {
            
            this.$toast.fail(error.msg || error.message || "提交失败,请稍后重试");

          }).finally(()=>{
            this.$store.commit("foodlist/SWITCH_SUBMITLOCK", false);
          })

    },
    
  },
  mounted() {
    

    const { totleLength } = this.$store.state.cart.to;
    this.packagAll = totleLength > 0 && totleLength == this.$store.state.cart.to.packageLength;
    
  },
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss">
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
    .van-checkbox {
      float: left;
    }
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
      margin-right: 15px;
    }
  }
}
</style>

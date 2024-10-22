<template>
  <li class="dishes">
    <!-- <div class="img-wrap">
      <img
        class="card-img"
        data-src="http://p0.meituan.net/deal/d142173e5869bc3623889b2af198d9c233131.jpg"
        alt=""
        src="http://p0.meituan.net/deal/d142173e5869bc3623889b2af198d9c233131.jpg"
      />
    </div> -->
    <div class="info-wrap">
      <div class="name">
        <dishes :name=" shopp.fnamespice" />
      </div>
      <div class="price-wrap">
        <price v-model="shopp.fprice" style="color: #ee0a24;" />
        <div class="button-wrap" :class="{ disabled: disabled }">
          <van-button
            v-for="name in shopp.mtype"
            :class="{
              [nametoKey[name]]: true,
              disabled: shopp[nametoKey[name]].lock
            }"
            :key="name"
            @click="click(nametoKey[name],shopp[nametoKey[name]].lock)"
            >{{ name }}</van-button
          >
        </div>
      </div>
    </div>
  </li>
</template>

<script>
// lunch
// night
// midnight

import timeMap from "@/minxins/timeMap";

import price from "@/components/price.vue";
import dishes from "@/components/dishes.vue";

import { mapMutations } from "vuex";

export default {
  name: "menuDishes",
  mixins: [timeMap],
  components: {
    price,
    dishes
  },
  props: {
    shopp: {
      typeof: Object,
      required: true
    },
    disabled: Boolean,
    edit: Boolean
  },
  beforeCreate() {},
  created() {
  },
  beforeMount() {},
  data() {
    return {};
  },
  watch: {},
  computed: {
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
      addCard: "cart/ADD_FOOD"
    }),
    click(time,lock) {
      if(lock){
        return;
      }

      if (!this.disabled) {

        new Promise((resolve)=>{
          if(!this.edit){

              this.$store.dispatch("user/CONFIRM_EDIT").then(resolve);

          }else{
            resolve();
          }

        }).then(()=>{

          const { shopp } = this;
          this.addCard({ time, shopp });

        })

      }
    }
  },
  mounted() {
    
  },
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss">
.dishes {
  display: flex;
  padding: 5px;
  border-bottom: 0.3vw solid #ddd8ce;

  .break{
    color: #e6a23c;
    background: #fdf6ec;
    border-color: #f5dab1;
  }
  .lunch {
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }

  .night {
    color: #67c23a;
    background: #f0f9eb;
    border-color: #c2e7b0;
  }

  .midnight {
    color: #f56c6c;
    background: #fef0f0;
    border-color: #fbc4c4;
  }

  &:first-of-type {
  }

  .img-wrap {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    width: 24vw;
    height: 21.9vw;
    overflow: hidden;
    // background-image: url(data:image/png;base64,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);
    // background-color: #e0e0e0;
    // background-size: 50%;
    // background-repeat: no-repeat;
    // background-position: 50%;
    // max-width: 24vw;
    img {
      height: 21.9vw;
    }
  }
  .info-wrap {
    padding-left: 10px;

    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .price-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price {
    font-size: 4.8vw;
  }

  .submit-bar {
    color: #ee0a24;
    font-weight: 500;
    font-size: 12px;
    margin-right: 10px;
    .submit-bar__price {
      font-size: 18px;
      font-family: Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif;
      color: #ee0a24;
      font-weight: 500;
    }
  }

  .name {
    margin-bottom: 5px;
    font-size: 4vw;
    color: #333;
  }
}

.button-wrap {
  &.disabled button,
  button.disabled {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
  }

  button {
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>

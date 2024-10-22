<template>
  <div id="app" @click="click">
    <div v-if="!ddPlatform" class="no-platform">
      <van-icon name="warn-o" />
      <span style="margin-top: 10px;">{{ errorMessage }}</span>
    </div>

    <div class="icon-warp" v-else-if="activation == -1">
      <div class="warp" @click="newOrder('')">
        <svg class="icon" viewBox="0 0 1234 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4554">
          <path
            d="M1145.210543 848.089963H88.235159A88.154744 88.154744 0 0 1 0.300801 752.662452a618.59837 618.59837 0 0 1 484.231256-553.00573 623.818783 623.818783 0 0 1 264.381588 0 618.088725 618.088725 0 0 1 484.176159 553.00573 88.154744 88.154744 0 0 1-87.879261 95.427511z m-528.487692-574.383256a534.438137 534.438137 0 0 0-113.430363 12.148826C277.795407 334.905383 107.119558 529.906432 88.221385 759.935218h1056.989158c-18.884399-230.028786-189.560249-425.029835-415.05733-474.148556a534.438137 534.438137 0 0 0-113.430362-12.079955zM1190.62401 1024h-1143.25684a44.077372 44.077372 0 1 1 0-88.154744h1143.25684a44.077372 44.077372 0 1 1 0 88.154744z"
            fill="#323232" p-id="4555"></path>
          <path
            d="M449.834901 297.425843v-130.537893a166.88795 166.88795 0 0 1 333.7759 0v130.537893l-53.443814-11.639181a538.363778 538.363778 0 0 0-226.874499 0z m166.88795-111.87388a623.240268 623.240268 0 0 1 78.733206 4.986252v-23.650265a78.733206 78.733206 0 1 0-157.466412 0v23.581394a623.391784 623.391784 0 0 1 78.733206-4.917381z"
            fill="#323232" p-id="4556"></path>
          <path
            d="M730.166987 285.786662a538.363778 538.363778 0 0 0-226.874499 0l-18.746657-86.143715a624.052944 624.052944 0 0 1 264.367814 0z"
            fill="#323232" p-id="4557"></path>
        </svg>
        <span>新版点餐</span>
      </div>

      <div class="warp" @click="activation = 1">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4320">
          <path
            d="M224.395636 210.478545C254.138182 81.035636 329.309091 11.636364 446.068364 11.636364c116.898909 0 190.184727 69.585455 215.808 198.842181h20.061091c53.76 0 98.816 40.727273 104.098909 93.44l16.616727 133.981091a34.909091 34.909091 0 0 1-69.306182 8.564364l-16.686545-134.749091a34.909091 34.909091 0 0 0-34.722909-31.418182H207.639273a34.909091 34.909091 0 0 0-34.746182 31.418182L120.250182 834.327273a34.909091 34.909091 0 0 0 34.722909 38.4h302.429091a34.909091 34.909091 0 0 1 0 69.818182H154.996364a104.727273 104.727273 0 0 1-104.192-115.223273l52.666181-522.612364a104.727273 104.727273 0 0 1 104.192-94.231273h16.756364z m71.866182 0h294.306909c-20.712727-88.808727-67.746909-129.024-144.500363-129.024-76.869818 0-125.765818 40.448-149.806546 129.024zM755.316364 1004.450909c-137.588364 0-249.134545-111.522909-249.134546-249.111273 0-137.588364 111.546182-249.134545 249.134546-249.134545s249.111273 111.546182 249.111272 249.134545-111.522909 249.111273-249.111272 249.111273z m0-58.181818a190.952727 190.952727 0 1 0 0-381.882182 190.952727 190.952727 0 0 0 0 381.905455z m-23.947637-146.850909l130.048-129.931637a29.090909 29.090909 0 1 1 41.122909 41.146182l-150.178909 150.085818a29.090909 29.090909 0 0 1-40.704 0.41891l-82.944-79.546182a29.090909 29.090909 0 1 1 40.261818-41.984l62.394182 59.810909z"
            p-id="4321"></path>
        </svg>
        <span>取餐</span>
      </div>
      <div class="warp" @click="activation = 2" v-if="false">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4821">
          <path
            d="M356.139 673.4l217.877-61.866-155.625-154.654-62.251 216.519zM938.048 249.733l-155.629-154.662-342.375 340.247 155.625 154.661 342.378-340.246zM892.695 822.49c0 53.763-43.577 97.336-97.337 97.336h-584.076c-53.763 0-97.353-43.573-97.353-97.336v-584.074c0-53.763 43.586-97.349 97.353-97.349h389.374l97.356-97.345h-519.179c-89.6 0-162.243 72.64-162.243 162.239v648.977c0 89.6 72.645 162.239 162.243 162.239h648.966c89.606 0 162.251-72.64 162.251-162.239v-519.174l-97.356 97.349v389.377h0.003zM1010.37 119.814l-97.263-96.663c-16.116-16.017-43.121-15.151-60.311 1.927l-46.683 46.402 155.624 154.654 46.691-46.397c17.19-17.076 18.059-43.913 1.943-59.923v0z"
            p-id="4822"></path>
        </svg>
        <span>功能建议</span>
      </div>
      <div class="warp" @click="otherClick" @touchstart="touchstart" @touchend="touchend" v-if="!rowMeal">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5601">
          <path
            d="M884.8 252.8L517.6 130.4c-1.6-0.8-3.2-0.8-4.8-0.8-1.6 0-3.2 0-4.8 0.8L139.2 254.4c-6.4 2.4-11.2 8-11.2 15.2v486.4c0 7.2 4.8 12.8 11.2 15.2l368.8 122.4c1.6 0.8 3.2 0.8 4.8 0.8 1.6 0 3.2 0 4.8-0.8l367.2-122.4c6.4-2.4 11.2-8 11.2-15.2v-488c0-7.2-4.8-12.8-11.2-15.2z m-372-56.8l269.6 89.6L512 384 244 286.4l268.8-90.4zM192 304l3.2-0.8L496 412v410.4L192 721.6V304z m640 417.6l-304 101.6V412l303.2-109.6h0.8v419.2z"
            p-id="5602"></path>
        </svg>
        <span>其他</span>
      </div>
      <div class="warp" @click="activation = 0" v-if="false">
        <svg class="icon" viewBox="0 0 1234 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4554">
          <path
            d="M1145.210543 848.089963H88.235159A88.154744 88.154744 0 0 1 0.300801 752.662452a618.59837 618.59837 0 0 1 484.231256-553.00573 623.818783 623.818783 0 0 1 264.381588 0 618.088725 618.088725 0 0 1 484.176159 553.00573 88.154744 88.154744 0 0 1-87.879261 95.427511z m-528.487692-574.383256a534.438137 534.438137 0 0 0-113.430363 12.148826C277.795407 334.905383 107.119558 529.906432 88.221385 759.935218h1056.989158c-18.884399-230.028786-189.560249-425.029835-415.05733-474.148556a534.438137 534.438137 0 0 0-113.430362-12.079955zM1190.62401 1024h-1143.25684a44.077372 44.077372 0 1 1 0-88.154744h1143.25684a44.077372 44.077372 0 1 1 0 88.154744z"
            fill="#323232" p-id="4555"></path>
          <path
            d="M449.834901 297.425843v-130.537893a166.88795 166.88795 0 0 1 333.7759 0v130.537893l-53.443814-11.639181a538.363778 538.363778 0 0 0-226.874499 0z m166.88795-111.87388a623.240268 623.240268 0 0 1 78.733206 4.986252v-23.650265a78.733206 78.733206 0 1 0-157.466412 0v23.581394a623.391784 623.391784 0 0 1 78.733206-4.917381z"
            fill="#323232" p-id="4556"></path>
          <path
            d="M730.166987 285.786662a538.363778 538.363778 0 0 0-226.874499 0l-18.746657-86.143715a624.052944 624.052944 0 0 1 264.367814 0z"
            fill="#323232" p-id="4557"></path>
        </svg>
        <span>点餐</span>
      </div>
      <div class="warp" @click="activation = 3">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4201">
          <path
            d="M509 349.5c-88.6 0-161.1 73.1-161.1 162.6 0 89.4 72.5 162.6 161.1 162.6s161.1-73.1 161.1-162.6S597.6 349.5 509 349.5zM380.1 85.3c16.1 0 34.2 6.1 44.3 16.3 12.1 14.2 54.4 50.8 86.6 50.8 32.2 0 74.5-36.6 86.6-48.8 10.1-12.2 28.2-18.3 44.3-18.3 10.1 0 16.1 0 24.2 4.1h2l110.7 63h2c22.1 16.3 30.2 46.7 20.1 71.1 0 0-10.1 22.4-10.1 42.7 0 61 48.3 109.7 108.7 109.7h4c20.1 0 36.2 18.3 42.3 46.7 2 2 10.1 50.8 10.1 89.4 0 40.6-10.1 89.4-10.1 89.4-4 28.4-22.1 46.7-42.3 46.7h-4c-60.4 0-108.7 48.8-108.7 109.7 0 20.3 10.1 42.7 10.1 42.7 10.1 24.4 2 52.8-20.1 69.1h-2l-110.7 63h-2c-6 2-14.1 4.1-22.1 4.1-18.1 0-36.2-8.1-46.3-20.3-12.1-14.2-56.4-52.8-88.6-52.8-30.2 0-70.5 36.6-86.6 52.8-10.1 12.2-26.2 20.3-44.3 20.3-10.1 0-16.1 0-24.2-4.1h-2l-108.7-61h-2c-22.3-16.2-30.3-46.7-20.3-71 0 0 10.1-22.4 10.1-42.7 0-61-48.3-109.7-108.7-109.7h-4c-20.1 0-36.2-18.3-42.3-46.7-2-2-10.1-50.8-10.1-89.4 0-36.6 8.1-85.3 10.1-89.4 4-28.4 22.1-46.7 42.3-46.7h2c60.4 0 108.7-48.8 108.7-109.7 0-20.3-10.1-42.7-10.1-42.7-10.1-24.4-2-52.8 20.1-69.1h2l114.8-65h2c6.1-2.2 14.2-4.2 22.2-4.2z"
            fill="#333333" p-id="4202"></path>
        </svg>
        <span>提醒设置</span>
      </div>
      <div class="warp" v-if="license" @click="toRowMeal">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1814">
          <path
            d="M525.341866 913.349901l-363.058806 0c-11.033287 0-20.008706-8.976442-20.008706-20.008706L142.274354 124.288724c0-11.033287 8.975419-20.008706 20.008706-20.008706l631.496581 0c11.032264 0 20.008706 8.975419 20.008706 20.008706l0 363.193883c0 11.050684 8.959046 20.008706 20.008706 20.008706 11.04966 0 20.008706-8.958022 20.008706-20.008706L853.80576 124.288724c0-33.098839-26.928303-60.027142-60.027142-60.027142L162.28306 64.261583c-33.098839 0-60.027142 26.928303-60.027142 60.027142l0 769.05247c0 33.098839 26.928303 60.027142 60.027142 60.027142l363.058806 0c11.050684 0 20.008706-8.959046 20.008706-20.008706C545.350572 922.308947 536.39255 913.349901 525.341866 913.349901zM715.324802 204.536396c0-11.050684-8.959046-20.008706-20.008706-20.008706L246.960625 184.52769c-11.050684 0-20.008706 8.958022-20.008706 20.008706 0 11.050684 8.958022 20.008706 20.008706 20.008706l448.355471 0C706.365756 224.546126 715.324802 215.588103 715.324802 204.536396zM467.63456 328.272535 246.960625 328.272535c-11.050684 0-20.008706 8.958022-20.008706 20.008706 0 11.050684 8.958022 20.008706 20.008706 20.008706L467.63456 368.289947c11.050684 0 20.008706-8.958022 20.008706-20.008706C487.643266 337.230558 478.685243 328.272535 467.63456 328.272535zM467.63456 472.01738 246.960625 472.01738c-11.050684 0-20.008706 8.958022-20.008706 20.008706s8.958022 20.008706 20.008706 20.008706L467.63456 512.034792c11.050684 0 20.008706-8.958022 20.008706-20.008706S478.685243 472.01738 467.63456 472.01738zM884.388289 543.66621l-131.218554 0L753.169735 356.166839c0-47.832402-38.915311-86.748736-86.74976-86.748736l-0.73678 0c-48.091298 0-87.216387 39.125089-87.216387 87.216387l0 201.644533c-13.299911 7.020904-25.061792 16.138562-34.95614 26.859741-33.55114-21.274536-78.616522-17.316387-107.854427 11.921517-33.843806 33.846876-33.843806 88.918145 0.001023 122.763998l93.650937 93.650937c1.49505 1.49505 3.170203 2.698458 4.953825 3.621481 12.707416 12.716626 28.873608 21.491477 45.409213 28.609595l-0.846274 94.909603c-0.047072 5.336542 2.039449 10.471492 5.79703 14.263865 3.75758 3.790326 8.873088 5.922896 14.211676 5.922896l268.086781 0c10.930957 0 19.838837-8.771781 20.006659-19.701714l1.418302-92.293009c21.959128-1.295506 41.312918-5.994528 52.861952-22.225187 11.745509-16.505929 11.745509-38.811957 11.745509-75.768661L952.952874 612.230796C952.952874 574.423725 922.194336 543.66621 884.388289 543.66621zM463.954751 625.356744c8.78406-8.78406 20.533662-13.623275 33.084513-13.623275 8.683776 0 16.983813 2.320858 24.184819 6.658653-7.985882 17.134239-12.344143 36.193317-12.344143 56.125275l0 61.934584-44.925189-44.925189C445.711248 673.284313 445.711248 643.60127 463.954751 625.356744zM912.934438 750.815107c0 24.938995 0 46.477544-4.331655 52.568263-2.77316 3.89675-16.220427 5.871731-39.969317 5.871731-10.930957 0-19.838837 8.771781-20.006659 19.701714l-1.411139 91.828428L619.022479 920.785244l0.785899-88.305185c0.072655-8.316409-5.006014-15.812127-12.755512-18.826787-44.567032-17.331737-58.154491-32.014134-58.154491-62.838164l0-76.29771c0-37.997406 22.662139-71.435982 57.734936-85.191264 8.454556-3.315512 13.617136-11.911284 12.570293-20.933775-0.11768-1.00284-0.264013-2.009773-0.412392-3.021823-0.124843-0.837064-0.294712-1.984191-0.304945-2.361791L618.486266 356.635513c0-26.025747 21.173229-47.198975 47.198975-47.198975l0.73678 0c25.76685 0 46.731324 20.963451 46.731324 46.731324l0 207.508078c0 11.050684 8.959046 20.008706 20.008706 20.008706l151.22726 0c15.739473 0 28.54615 12.806677 28.54615 28.547173L912.935462 750.815107z"
            p-id="1815"></path>
        </svg>
        <span>菜品管理</span>
      </div>
      <div class="warp"  @click="newOrder('mealamount')">
        <svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3396"><path d="M512 1023.998537A475.420846 475.420846 0 0 1 53.584592 421.85975a54.856251 54.856251 0 1 1 105.872565 29.073814A365.708343 365.708343 0 1 0 512 182.869348a361.502697 361.502697 0 0 0-169.688671 41.507897A54.856251 54.856251 0 1 1 291.477869 128.013097 475.420846 475.420846 0 1 1 512 1023.998537z" fill="#333333" p-id="3397"></path><path d="M566.856251 297.518914h-54.856251a18.285417 18.285417 0 0 0-18.285417 18.285417v224.727777a18.285417 18.285417 0 0 1-18.285417 18.285417h-169.688671a18.285417 18.285417 0 0 0-18.285418 18.285417v54.856252a18.285417 18.285417 0 0 0 18.285418 18.285417H566.856251a18.285417 18.285417 0 0 0 18.285418-18.285417V315.804331a18.285417 18.285417 0 0 0-18.285418-18.285417zM402.287497 320.375685a54.856251 54.856251 0 0 1-19.931105-3.657083l-151.403254-59.244752a54.856251 54.856251 0 0 1-31.085209-71.130272l59.244752-151.403254a54.856251 54.856251 0 0 1 102.215482 39.862209l-40.227918 100.38694 100.38694 39.313647A54.856251 54.856251 0 0 1 402.287497 320.375685z" fill="#333333" p-id="3398"></path></svg>
        <span>点菜记录</span>
      </div>

    </div>



    <qrcode v-else-if="activation == 1" />
    <advice v-else-if="activation == 2" />
    <remind v-else-if="activation == 3" />
  </div>
</template>

<script>
import menuShoppCart from "@/components/menuShoppCart";
import menuOrder from "@/components/menuOrder";
import userInfo from "@/components/userInfo";

import mentConnect from "@/components/mentConnect";
import mentDate from "@/components/mentDate";
import overlay from "@/components/overlay";

import advice from "@/layout/advice";
import qrcode from "@/layout/qrcode";
import remind from "@/layout/remind";

import { islogin, setUserInfo, getempid, getUserName } from "@/utils/auth";
import { login, assignLog, gettotlecost,getMuneLicense } from "@/api";

import { mapGetters, mapState } from "vuex";

function splitSearch(url) {
  const str = url.split("?")[1];
  if (!str) {
    return {};
  }
  const arr = str.split("&");
  const obj = {};
  arr.forEach(item => {
    const oneItem = item.split("=");
    obj[oneItem[0]] = oneItem[1];
  });
  return obj;
}


export default {
  name: "App",
  components: {
    userInfo,
    menuShoppCart,
    menuOrder,

    mentDate,
    mentConnect,
    overlay,

    advice,
    qrcode,
    remind
  },
  props: {},
  beforeCreate() { },
  created() {
    window.search = this.search = splitSearch(location.search);

    if (process.env.NODE_ENV == "production") {
      this.ddPlatform = (dd.env.platform != "notInDingTalk") && (this.search.corpId != "");
    } else {
      this.search.corpId = "dingf2f1e9ca1da23dff";
    }


    const { corpId = "", user } = this.search;


    if (this.ddPlatform == false && !user) {
      return;
    }
    if (corpId == "" && user) {
      this.ddPlatform = false;
    }



    if (islogin()) {

      this.ddPlatform = true;
      this.userNme = getUserName();
      gettotlecost(getempid()).then(({ cost }) => {
        this.$store.commit("user/ADD_COST", cost);
        this.muneLicense();

      });

     

    } else {

      this.logToast = this.$toast.loading({
        duration: 0,
        message: "正在登录",
        forbidClick: true
      });

      if (this.ddPlatform) {

        dd.runtime.permission.requestAuthCode({
          corpId
        }).then(({ code }) => {


          login(code).then(this.logSuccess).catch(this.logFill);

        }).catch((error) => {

          this.errorMessage = "请在钉钉环境中打开页面！";
          this.ddPlatform = false;

        })

      } else {

        assignLog(user).then((data) => {

          this.ddPlatform = true;
          this.logSuccess(data);

        }).catch(this.logFill);

      }

      

    }

  },
  beforeMount() { },
  data() {
    return {
      ddPlatform: true,
      overlayshow: false,
      activation: -1,
      ClickTime: Date.now(),
      ClickNum: 0,
      errorMessage: "正在登录",
      license:false
    };
  },
  watch: {},
  computed: {
    ...mapState({
      totleLength: state => state.cart.to.totleLength,
      submitlock: state => state.foodlist.submitlock,
      orderShow: state => state.order.show,
      cartShow: state => state.cart.show,
    }),
    show: {
      get() {
        return this.$store.state.foodlist.foodshow;
      },
      set(value) {
        this.$store.state.foodlist.foodshow = value;
      }
    },
    rowMeal() {
      return ["吴天震", "黎旭辉", "迪迦奥特曼"].includes(this.userNme);
    }
  },
  methods: {


    newOrder(path) {
      let date = new Date();

      date.setTime(date.getTime() - 10000);

      document.cookie = "appToken=828; path=/; expire=" + date.toGMTString();

      let href = "/ding/neweatmeal/index.html?";
      const searchObj = [];


      if (window.search.corpId) {
        searchObj.push(`corpId=${window.search.corpId}`)
      }
      if (window.search.user) {
        searchObj.push(`user=${window.search.user}`)
      }
      if(path){
        searchObj.push(`path=${path}`)
      }

      href += searchObj.join("&");

      location.href = href;




    },

    toMealamount(){

    },
    toRowMeal() {
      let date = new Date();

      date.setTime(date.getTime() - 10000);

      document.cookie = "appToken=828; path=/; expire=" + date.toGMTString();

      let href = "/ding/data_manage/index.html?";



      const searchObj = [];


      if (window.search.corpId) {
        searchObj.push(`corpId=${window.search.corpId}`)
      }
      if (window.search.user) {
        searchObj.push(`user=${window.search.user}`)
      }

      href += searchObj.join("&");

      location.href = href;


    },

    logSuccess(data) {
      this.logToast.clear();



      setUserInfo(data);

      this.userNme = data.name;


      this.$store.commit("user/SET_INFO", data);
      this.$store.commit("user/ADD_COST", data.cost);

      this.muneLicense();

      

    },
    muneLicense(){

      getMuneLicense(getempid()).then((data) => {
        this.license = data;
      }).catch(() => {
        this.license = false;
      })

    },
    
    logFill(error) {
      this.logToast.clear();


      console.log(JSON.stringify(error))
      let message;
      if (error || error.code) {
        message = error.msg;

      } else {
        message = "登录失败，请刷新重试";
      }


      this.errorMessage = message;
      this.$dialog.alert({
        message,
        confirmButtonText: "确定"
      })


    },

    click(event) {
      const time = Date.now();
      if ((time - this.ClickTime) <= 300) {
        this.ClickNum += 1;
        if (this.ClickNum >= 30) {
          localStorage.clear();
          alert("缓存已清空");
        }
      } else {
        this.ClickNum = 0;
      }


      this.ClickTime = time;
    },
    clickOverlay() {
      if (!this.submit) {
        this.show = false;
        this.$store.commit("cart/CLOSE_SHOW");
        this.$store.commit("order/CLOSE_SHOW");
      }
    },
    otherClick() {
      this.$dialog
        .alert({
          message: "这是通往异次元空间的按钮！",
          confirmButtonText: "确定",
        })
    },
    overlayMove(event) {

    },
    touchstart(event) {
      event.preventDefault();
      this.nowTime = Date.now();
      this.time = setTimeout(() => {
        localStorage.clear();

        this.$dialog.confirm({
          message: "缓存清空啦,是否刷新页面？"
        }).then(() => {
          location.reload();
        })

      }, 5000)
    },
    touchend() {
      clearTimeout(this.time);
      if (Date.now() - this.nowTime < 260) {
        this.otherClick();
      }
    }
  },
  mounted() { },
  beforeDestroy() { },
  destroyed() { }
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;

  padding: 0;
  margin: 0;
}

// 左边标签激活上下两个标签的圆角化
$titleAround: 10px;

#app {
  width: 100%;
  height: 100%;
  background-color: rgb(247, 248, 250);
  padding-top: 10px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.no-platform {
  display: flex;

  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 80px;
  display: flex;
  flex-direction: column;

  justify-content: center;

  i {
    color: #f56c6c;
  }

  span {
    font-size: 18px;
  }
}

.take-order_wrappe {
  overflow: hidden;
  position: relative;
  flex: 1;
  padding-top: 10px;

  .take-order {
    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
    border-radius: 10px;
    position: relative;
    overflow: hidden;

    .menu_wrappe {
      flex: 1;
      flex-direction: column;

      display: flex;
      background: white;

      .title-list-wrap {
        position: relative;
        width: 80px;
        overflow: auto;

        &::after {
          content: "";
          display: block;
          height: 100%;
          background-color: #f2f2f2;
          border-top-right-radius: $titleAround;
        }
      }

      .title-list {
        position: absolute;
        width: 100%;
        background-color: white;
        overflow: hidden;
        border-top-right-radius: $titleAround;

        display: flex;
        flex-direction: column;

        // // 这个小玩意，如果使用 display: inline-block 的话会在最底部加上一个空隙，具体是为啥就没搞明白了
        // // 而且很离谱的是，在调试器上面看的画它是没有高度和宽度
        // // 可就是会占那么一点位置，北京颜色和字体颜色还没办法设置
        // &::after {
        //   content: "";
        //   height: 100%;
        //   width: 100%;
        //   background-color: #f2f2f2;
        //   display: inline-block;
        // }

        &:first-child {
          border-top-right-radius: $titleAround;
        }

        li {
          color: #303133;
          font-size: 12px;
          padding: 10px;
          text-align: center;
          height: 44px;
          line-height: 24px;
          font-weight: 500;
          box-sizing: border-box;
          background-color: #f2f2f2;
          transition: font-size 0.2s;

          &.top {
            border-bottom-right-radius: $titleAround;
          }

          &.activation {
            background-color: white;

            font-size: 18px;

            color: black;
            font-weight: bold;

            &+li {
              border-top-right-radius: $titleAround;
            }
          }
        }
      }

      .submit-wrap {
        background: rgb(244, 244, 245);
        box-sizing: border-box;
        height: 50px;
        width: 100%;
        display: flex;
        padding: 5px;

        justify-content: space-between;
        align-content: center;
        flex-wrap: wrap;
        position: relative;
        z-index: 99;

        .van-button--primary {
          min-width: 100px;
          height: 35px;
          border-radius: 25px;
          transition: width 0.3s;
        }

        .submit {
          display: flex;
          justify-content: center;
          align-items: center;

          .submit-bar {
            color: #ee0a24;
            font-weight: 500;
            font-size: 12px;
            margin-right: 10px;

            .submit-bar__price {
              font-size: 20px;
              color: #ee0a24;
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  .back-overlay {
    top: 0;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
    height: 100%;
    width: 100%;
  }

  .detailed {
    position: absolute;
    width: 100%;
    bottom: 50px;
    height: 0px;


    transition: height 0.3s;

    background: #f4f4f5;

    &.show {
      height: 300px;
    }
  }
}

#app .icon-warp {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;

  justify-content: center;
  align-content: center;

  .warp {
    width: 100px;
    height: 100px;
    margin: 20px;

    border-radius: 10px;
    background-color: white;
    text-align: center;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);

    &:hover {
      cursor: pointer;
    }

    svg {
      font-size: 42px;
      margin-bottom: 10px;
      width: 1em;
      height: 1em;
    }
  }
}
</style>

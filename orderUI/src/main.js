import Vue from 'vue'
import App from './App'

import Vant from 'vant';
import 'vant/lib/index.css';

import store from "./store"
import moment from "moment";
moment.locale('zh-cn', {
  weekdays: '周日_周一_周二_周三_周四_周五_周六'.split('_')
})

window.moment = moment;

Vue.config.productionTip = false
Vue.use(Vant);


new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from "vue";
import App from "./App";

Vue.config.productionTip = false;

import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import "./style/index.scss";


Vue.use(ElementUI);

dd.ready(function() {
  new Vue({
    el: "#app",
    components: { App },
    template: "<App/>"
  });

});


// try {
//   if (dd.env.platform == "notInDingTalk") {
//     ElementUI.MessageBox({
//       title: "错误",
//       message: "请在钉钉环境中打开页面！",
//       confirmButtonText: "确定",
//       type: "error",
//       center: true
//     });
//   } else {

//     dd.ready(function() {
//       new Vue({
//         el: "#app",
//         components: { App },
//         template: "<App/>"
//       });

//     });

//   }
// } catch (error) {
//   if (process.env.NODE_ENV == "development") {
//     console.error("环境初始化失败",error )
//   }
// }


// new Vue({
//   el: "#app",
//   components: { App },
//   template: "<App/>"
// });


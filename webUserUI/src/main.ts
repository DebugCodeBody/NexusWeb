import { createApp } from "vue";
import { createPinia } from 'pinia'

import router from "./router";
import App from "./App.vue";

import queryString from "query-string";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

window.urlSearch = queryString.parse(location.search);
if (process.env.NODE_ENV == "development") {
  window.urlSearch.corpId = "dingf2f1e9ca1da23dff";
}




app.use(createPinia()).use(router).use(ElementPlus).mount("#app");



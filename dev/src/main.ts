import { createApp } from 'vue'


import router from './router'
import pinia from "./store"

import App from './App.vue'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import "@/style/index.scss"
import 'normalize.css/normalize.css'

import '@/assets/icons' // icon

import directive from "@/directive"
import registerIcons from "@/assets/icons"



if (process.env.NODE_ENV != "production") {
  require("element-plus/dist/index.css");
}



async function start() {

  const app = createApp(App)


  directive(app);
  registerIcons(app);


  app.use(router);
  app.use(pinia);
  app.use(ElementPlus, {
    locale: zhCn
  });


  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }


  app.mount('#app')

}

start()




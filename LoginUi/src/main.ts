
import 'windi.css'

import { createApp } from "vue";
import App from "./App.vue";


import router from "@/router"

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

if (process.env.NODE_ENV != "production") {
    require("element-plus/dist/index.css");
}



const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router).use(ElementPlus, {
    size: "large",
    locale: zhCn
}).mount("#app");



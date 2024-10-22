
import 'windi.css'

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"
import pinia from './store/indtx';


import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import "@/style/index.scss"

if (process.env.NODE_ENV != "production") {
    require("element-plus/dist/index.css");
}




const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(ElementPlus, {
    locale: zhCn
});
app.mount('#app')



// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }

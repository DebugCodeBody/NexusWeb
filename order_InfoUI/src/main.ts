
import { createApp } from "vue";
import { createPinia } from 'pinia'


import App from "./App.vue";
import router from "@/router"

import init from "@/enum/init"

import { userLogin } from "@/store/user"


import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


if (process.env.NODE_ENV != "production") {
    require("element-plus/dist/index.css");
}


new Promise<init>((resolve) => {
    userLogin().then(resolve, resolve);
}).then((code: init) => {

    window.initCode = init.SUCCESS;

    const app = createApp(App)

    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }

    app.use(router).use(createPinia()).use(ElementPlus, {
        locale: zhCn
    }).mount("#app");


})




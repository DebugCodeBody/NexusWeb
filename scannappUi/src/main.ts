
import 'windi.css'

import { createApp } from "vue";
import App from "./App.vue";
import init from "@/enum/init"

import { userLogin } from "@/store/user"


import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

if (process.env.NODE_ENV != "production") {
    require("element-plus/dist/index.css");
}





new Promise<init>((resolve) => {


    userLogin().finally(()=>{
        resolve(init.SUCCESS);
    })
    

}).then((code: init) => {


    window.initCode = code;

    const app = createApp(App)


    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }

    app.use(ElementPlus, {
        size: "large",
        locale: zhCn
    }).mount("#app");





10
})




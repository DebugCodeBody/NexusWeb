
import { createApp } from "vue";

import initStatus from "@/enum/init"


import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'



if(process.env.NODE_ENV != "production"){
    require("element-plus/dist/index.css");
}


import App from "./App.vue";
import queryString from "query-string";
import { environment, userLogin } from "./utils/auto";


window.urlSearch = Object.assign({
    user: String.Empty,
    corpId: String.Empty
}, queryString.parse(location.search));


if (process.env.NODE_ENV == "development") {

    if (window.urlSearch.corpId == String.Empty) {
        window.urlSearch.corpId = "dingf2f1e9ca1da23dff";
    }

}



new Promise((resolve) => {
    
    if(window.urlSearch.path == "order"){
        window.initCode = initStatus.SUCCESS;
        resolve();
        return;
    }

    environment().then(() => {

        userLogin().then(() => {
            window.initCode = initStatus.SUCCESS;
        }).catch(() => {
            window.initCode = initStatus.NOLOGIN;
        }).then(resolve)

    }).catch(() => {

        window.initCode = initStatus.NOENVIRONMENT;
        resolve();

    })


}).then(() => {
    const app = createApp(App)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }

    app.use(ElementPlus, {
        size: "large",
        locale: zhCn
    }).mount("#app");
})




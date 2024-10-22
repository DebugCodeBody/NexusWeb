

import { createApp } from "vue";
import App from "./App.vue";



import initialEnum from "./enums/initialEnum"
import viewEnum from "./enums/viewEnum"

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

if(process.env.NODE_ENV != "production"){
    require("element-plus/dist/index.css")
}



import * as ElementPlusIconsVue from '@element-plus/icons-vue'




import queryString from "query-string";
import { environment, userLogin } from "./utils/auto";

String.Empty = "";

window.urlSearch = Object.assign({
    user: String.Empty,
    path: String.Empty
}, queryString.parse(location.search));




if (process.env.NODE_ENV == "development") {

    if (window.urlSearch.corpId == "" || !window.urlSearch.corpId) {
        window.urlSearch.corpId = "dingf2f1e9ca1da23dff";
    }

    localStorage.setItem("User-Info", `{"empid":1446,"fcardid":"0010010977","name":"迪迦奥特曼","branch":"光之国","userid":"01514963235039914122","cost":"209.50","avatar":"https://static-legacy.dingtalk.com/media/lADPDgtY1eZr3h3Mx8zI_200_199.jpg"}`)
    localStorage.setItem("prodsure-info", `{"empid":1446,"fcardid":"0010010977","name":"迪迦奥特曼","branch":"光之国","userid":"01514963235039914122","cost":"209.50","avatar":"https://static-legacy.dingtalk.com/media/lADPDgtY1eZr3h3Mx8zI_200_199.jpg"}`)
}


let { user, path } = window.urlSearch;
if (path == String.Empty || ![viewEnum.DECLARE, viewEnum.SALES, viewEnum.ENDWORK].includes(path)) {
    path = window.urlSearch.path = viewEnum.DECLARE;
}

if (user === String.Empty) {
    window.urlSearch.user = user = localStorage.getItem("userToken");
} else {
    localStorage.setItem("userToken", user);
}




new Promise((resolve) => {
    if (path == viewEnum.SALES) {
        return resolve()
    }

    environment().then(() => {

        userLogin().then(() => {
            window.initCode = initialEnum.SUCCESS;
        }).catch(() => {
            window.initCode = initialEnum.NOLOGIN;
        }).then(resolve)

    }).catch(() => {

        window.initCode = initialEnum.NOENVIRONMENT;
        resolve();

    })

}).then(() => {

    const path = [];
    for (const [key, value] of Object.entries(window.urlSearch)) {
        if(key != "user"){
            path.push(`${key}=${value}`)
        }
    }


    try {
        const replace = `${location.origin}${location.pathname}?${path.join("&")}`
        window.history.replaceState({
            path: replace
        }, String.Empty, replace);
    } catch {
        console.log("");
    }


    const app = createApp(App)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }

    app.use(ElementPlus, {
        locale: zhCn,
    }).mount('#app');




})








import { createApp } from "vue";
// import router from "./router";
import App from "./App.vue";
import * as dd from 'dingtalk-jsapi';

import initStatus from "./init"

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'




import queryString from "query-string";
import { environment, userLogin } from "./utils/auto";


window.urlSearch = queryString.parse(location.search);
window.initStatus = initStatus;
window.dd = dd;



if (process.env.NODE_ENV == "development") {
    window.urlSearch.corpId = "dingf2f1e9ca1da23dff";
}



new Promise((resolve) => {
    if (!environment()) {

        window.initCode = initStatus.NOENVIRONMENT;
        resolve();

    } else {

        userLogin().then(() => {
            window.initCode = initStatus.SUCCESS;
        }).catch((error) => {
            window.initCode = initStatus.NOLOGIN;
        }).then(resolve)

    }
}).then(() => {

    createApp(App).use(ElementPlus, {
        size: "large"
    }).mount("#app");
})




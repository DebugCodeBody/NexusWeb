import { createApp } from "vue";
// import router from "./router";
import App from "./App.vue";
import * as dd from 'dingtalk-jsapi';


import { userLogin } from "@/store/user"


import initStatus from "./init"


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'




import queryString from "query-string";
import { environment } from "./utils/auto";


window.urlSearch = queryString.parse(location.search);
window.initStatus = initStatus;
window.dd = dd;



if (process.env.NODE_ENV == "development") {
    window.urlSearch.corpId = "dingf2f1e9ca1da23dff";
}

new Promise<initStatus>((resolve) => {
    
    userLogin().then(resolve, resolve);

}).then((code: initStatus) => {


    window.initCode = code;

    const app = createApp(App)


    app.use(ElementPlus, {
        size: "large"
    }).mount("#app");




})


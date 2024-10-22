
import { createApp } from "vue";
import App from "./App.vue";

// import * as dd from 'dingtalk-jsapi';

import initStatus from "./init"




import queryString from "query-string";
import { environment, userLogin } from "./utils/auto";


window.urlSearch = queryString.parse(location.search);
window.initStatus = initStatus;



if (process.env.NODE_ENV == "development") {
    
    if(window.urlSearch.corpId == "" || !window.urlSearch.corpId){
        window.urlSearch.corpId = "dingf2f1e9ca1da23dff";
    }

    // localStorage.setItem("User-Info", `{"empid":1446,"fcardid":"0010010977","name":"迪迦奥特曼","branch":"光之国","userid":"01514963235039914122","cost":"209.50","avatar":"https://static-legacy.dingtalk.com/media/lADPDgtY1eZr3h3Mx8zI_200_199.jpg"}` )
}
if(window.urlSearch.gid == undefined || window.urlSearch.gid == String.Empty){
    window.urlSearch.gid = "1"
}



new Promise( (resolve) => {
    
    // 要同时兼容 pc 和 钉钉，所以这里就写死这个了
    window.initCode = initStatus.SUCCESS;

    environment().then(() => {

        userLogin().then(() => {
           

        }).catch(() => {

            // window.initCode = initStatus.NOLOGIN;


        }).then(resolve)

    }).catch(() => {

        // window.initCode = initStatus.NOENVIRONMENT;
        resolve();

    })

}).then(() => {
    const app = createApp(App);

    app.mount("#app");
})




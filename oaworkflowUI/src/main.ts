
import 'windi.css'

import { createApp } from "vue";
import App from "./App.vue";
import init from "@/enum/init"

import vant from "vant"
import { userLogin } from "@/store/user"

if (process.env.NODE_ENV != "production") {
    require("vant/lib/index.css");
}

new Promise<init>((resolve) => {
    
    userLogin().then(resolve, resolve);

}).then((code: init) => {


    window.initCode = code;

    const app = createApp(App)

    app.use(vant).mount("#app");

})




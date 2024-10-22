
import 'windi.css'

import init from "@/enum/init"
import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import { userLogin } from "@/store/user"




import vant from "vant"
import 'vant/lib/index.css';




new Promise<init>((resolve) => {
    userLogin().then(resolve, resolve);

}).then((code: init) => {

    window.initCode = code;

    const app = createApp(App)

    app.use(createPinia()).use(vant);

    app.mount("#app");

})





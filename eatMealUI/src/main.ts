import { createApp } from "vue";
import App from "./App.vue";
import init from "@/enum/init"

import vant from "vant"
import 'vant/lib/index.css';

import { createPinia } from "pinia";

import { userLogin } from "@/store/user"



new Promise<init>((resolve) => {
    userLogin().then(resolve, resolve);
}).then((code: init) => {

    window.initCode = code;
    
    const app = createApp(App);

    app.use(createPinia()).use(vant).mount("#app");

})








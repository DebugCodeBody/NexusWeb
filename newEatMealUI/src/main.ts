
import 'windi.css'

import init from "@/enum/init"
import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import { userLogin } from "@/store/user"




import vant from "vant"
import 'vant/lib/index.css';
import "@/style/index.scss"

window.addEventListener("error", (event) => {

    let data: any = {}
    if (event.error) {
        const { message, stack } = event.error;
        data = {
            message,
            stack
        }
    } else {
        data.message = event.message
    }



})


new Promise<init>((resolve) => {
    userLogin().then(resolve, resolve);

}).then((code: init) => {

    window.initCode = code;

    const app = createApp(App);

    app.config.errorHandler = (err:any, vm, info) => {

		const { message, stack } = err;
    }

    app.use(createPinia()).use(vant);

    app.mount("#app");

})





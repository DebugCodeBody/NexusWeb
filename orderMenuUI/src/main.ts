
import Vue, { createApp } from "vue";
import App from "./App.vue";
import init from "@/enum/init"

import { userLogin } from "@/store/user"


import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

if (process.env.NODE_ENV != "production") {
    require("element-plus/dist/index.css");
}




// app.directive("debounce", {
//     created(el: Element, binding: any) {

//         const [fn, event = "click", time = 300] = binding.value;
//         let timer: number | undefined = undefined;

//         el.addEventListener(event, () => {
//             timer && window.clearTimeout(timer);

//             timer = window.setTimeout(() => fn(), time);

//         })

//     },
//     unmounted(el, binding, vnode, prevVnode){
//         console.log(el, binding, vnode, prevVnode)
//     }
// })


new Promise<init>((resolve) => {
    resolve(init.SUCCESS);

    // userLogin().then(resolve, resolve);
}).then((code: init) => {

    window.initCode = code;

    const app = createApp(App)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }



    app.use(ElementPlus, {
        locale: zhCn
    }).mount("#app");

})




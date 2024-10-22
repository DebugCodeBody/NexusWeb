
import { createApp } from "vue";
import App from "./App.vue";


import router from './router'
import store from "./store"


import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

if (process.env.NODE_ENV != "production") {
    require("element-plus/dist/index.css");
}


import "./style/index.scss"


async function start() {
    const app = createApp(App)

    app.use(router);
    app.use(store);
    app.use(ElementPlus);


    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }

    app.directive('blur', {
        mounted(el) {
            el.addEventListener('focus', () => {
                el.blur()
            })
        },
    })

    app.mount('#app')

}

start()
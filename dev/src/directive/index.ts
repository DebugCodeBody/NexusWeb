import permission from "./permission"
import blurDirective from "./blurDirective"


export default function install(Vue: any) {

    Vue.use(permission);
    Vue.use(blurDirective);



}
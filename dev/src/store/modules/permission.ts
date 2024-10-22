import { defineStore } from "pinia";
import constantRouterMap from '@/router/constantRouterMap'



interface state {
    /** 全部路由 */
    routers: routerItems,
    /** 远程拉取下来的路由或者动态添加的路由 */
    addRouters: routerItems,
    /** 菜单导航条的路由 */
    sidebarRouters: routerItems
}

const state: state = {
    routers: [],
    addRouters: [],
    sidebarRouters: []
}

export default defineStore('permission', {
    state() {
        return state
    },
    actions: {
        /** 设置整个路由项目 */
        set_routers(routers: routerItems) {
            this.addRouters = routers;
            this.routers = constantRouterMap.concat(routers);
        },
        /** 设置菜单导航条项目 */
        set_sidebar_routers(routers: routerItems) {
            this.sidebarRouters = constantRouterMap.concat(routers);
        }

    }
})


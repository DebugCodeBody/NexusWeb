import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { ElMessage } from "element-plus";

import constantRouterMap, { loadMenus } from "./constantRouterMap"
import { permissionStore, userStore } from "@/store"
import { getToken,setToken } from "@/utils/auth"

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'



NProgress.configure({ showSpinner: false });


/** 是否已经加载成功路由 */
let isLoadMenus = false;

const loginPath = '/login';
/** 这数组里面的路径，在没有登录的情况下都是不需要二次跳转 */
const whiteList = [loginPath, '/auth-redirect'];


const router = createRouter({
    routes: constantRouterMap,
    history: createWebHashHistory(),
})



router.beforeEach(async (to: any, from: any, next: any) => {

    // 进度条开始
    NProgress.start();

    const hasToken = getToken();

    if (hasToken) {
        if (to.path == loginPath) {
            next({ path: '/' });
        } else {
            if (isLoadMenus) {
                next();
            } else {

                const user = userStore();
                const permission = permissionStore();

                try {
                    const asyncRouter = await loadMenus();
                    permission.set_routers(asyncRouter);
                    for (const routeItem of asyncRouter) {
                        router.addRoute(routeItem);
                    }

                    /**
                     * 这里要先设置为真，因为next函数执行是同步的
                     * 如果先调用next再设置为真，name在下一次循环中会再加载一次菜单
                     */
                    isLoadMenus = true;
                    next({ ...to, replace: true });

                } catch (error: any) {
                    // 如果出问题的话，需要把当前的用户信息清空再跳到登录页面
                    // 避免进入死循环

                    user.resetToken();

                    ElMessage.error(error.toString());
                    next(`${loginPath}?redirect=${to.path}`)
                }

            }

        }

    } else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            next(`${loginPath}?redirect=${to.path}`)
        }

    }

    NProgress.done();


})



router.afterEach(() => {
    // 进度条结束
    NProgress.done()
})



export default router;


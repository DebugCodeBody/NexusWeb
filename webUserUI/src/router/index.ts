import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { getToken } from "@/utils/auto"




NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/auth-redirect'] // 这数组里面的路径，在没有登录的情况下都是不需要二次跳转


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
];



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // 进度条开始
  NProgress.start()

  const hasToken = getToken();
  if (hasToken) {
    if (to.path == "/login") {
      next({ path: "/" });
      NProgress.done()
    }else{
      next();
      NProgress.done()
    }


  }
  else {
    if (whiteList.indexOf(to.path) != -1) {
      next();
    } else {
      // 其他没有访问权限的页面被重定向到登录页面
      // 所以要添加一个 redirect 跳转参数
      // 在登录成功后才可以正常跳转成功

      next(`/login?redirect=${to.path}`)
    }

  }





})


router.afterEach(() => {
  // 进度条设置完成
  NProgress.done()
})



export default router;

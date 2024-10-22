import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from "vue-router";


const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: "/:url*",
    redirect: "/login"
  }

];




const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});



export default router;

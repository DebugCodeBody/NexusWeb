import Layout from "@/layout/index.vue"
import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from "vue-router";



export const routerTable = [
  
  {
    path: "/quotes/new",
    component: () => import('@/views/newQuotes/index.vue'),
    meta: {
      title: "新文件"
    }
  },
  {
    path: "/quotes",
    component: () => import('@/views/quotes/index.vue'),
    name: 'Dashboard',
    meta: {
      title: "历史文件"
    }
  },
  {
    path: "/quotation/:id",
    component: () => import('@/views/quotation/index.vue'),
    name: 'quotation',
    meta: {
      title: "编辑文件",
      hidden: true
    }
  }
];



const routes: Array<RouteRecordRaw> = [


  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: () => import('@/views/login/index.vue')
  },

  {
    path: '/',
    component: Layout,
    redirect: "/quotes/new",
    children:  routerTable
  }

];




const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});


router.beforeEach(async (to, from, next) => {
  next();


})


export default router;



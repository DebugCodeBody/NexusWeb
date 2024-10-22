import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw, } from "vue-router";


import declare from "@/views/declare/index.vue";



const routes: Array<RouteRecordRaw> = [

  {
    path: "/",
    component: declare,
    children: [
      
      {
        path: '/',
        redirect: "/head/check"
      },
      {
        path: "/deal/check",
        component: () =>
          import("@/views/deal/check/index.vue"),
      },
      {
        path: "/deal/detail",
        component: () =>
          import("@/views/deal/detail/index.vue"),
      },
      {
        path: "/head/check",
        component: () =>
          import("@/views/head/check/index.vue"),
      },
      {
        path: "/head/detail",
        component: () =>
          import("@/views/head/detail/index.vue"),
      },



    ]
  },
  {
    path: '/:pathMatch(.*)',
    redirect: "/head/check"
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

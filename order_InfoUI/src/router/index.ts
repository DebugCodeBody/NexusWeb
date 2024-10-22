import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from "vue-router";

import process from "@/views/process/index.vue"
import outbound from "@/views/outbound/index.vue"
import prodsure from "@/views/prodsure/index.vue"
import beian from "@/views/beiliao/index.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/process",
    name: "工单详细",
    component: process,
    children: [
      {
        path: "outbound",
        name: "外发催货",
        component: outbound
      },
      {
        path: "prodsure",
        name: "车间问数",
        component: prodsure
      },
      {
        path: "beiliao",
        name: "备料信息",
        component: beian
      }
    ]
  }
];



const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

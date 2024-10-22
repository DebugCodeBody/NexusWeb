import { defineStore } from "pinia";
import { packagStorage } from "@/utils/other"



interface state {
    /** 左边导航条是否展开 */
    opened: boolean,
    /** 是否没有过渡效果 */
    withoutAnimation: boolean

}

const sidebarStatus = packagStorage("sidebarStatus");
const withoutAnimation = packagStorage("withoutAnimation");

const state: state = {
    opened: sidebarStatus.get() ? !!+sidebarStatus.get()! : true,
    withoutAnimation: withoutAnimation.get() ? !!+withoutAnimation.get()! : false,
}


export default defineStore('sidebar', {
    state() {
        return state
    },
    actions: {
        closeSideBar() {
            sidebarStatus.set(0);
            this.opened = false;
        },
        /** 菜单展开状态切换 */
        TOGGLE_SIDEBAR() {
            this.opened = !this.opened;
            sidebarStatus.set(Number(this.opened));
        }

    },
})
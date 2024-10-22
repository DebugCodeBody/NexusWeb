import { defineStore } from "pinia";

interface state {
    /** 显示路由列表 */
    visited: routerTags;
    /** 缓存路由列表 */
    cached: string[];
}

const state: state = {
    visited: [],
    cached: [],
};

export default defineStore("tagsView", {
    state() {
        return state;
    },
    actions: {
        /** 添加一个标签 */
        addView(view: routerTag) {
            this.addCachedView(view);
            this.addVisitedView(view);
        },
        /** 删除一个标签 */
        delView(view: routerTag) {
            this.delVisitedView(view);
            this.delCachedView(view);
        },
        /** 添加标签条标签 */
        addVisitedView(view: routerTag) {
            // 去重，如果数组里面已经存在过了就不再加进去
            if (this.visited.some((tag: routerTag) => tag.path === view.path)) {
                return;
            }
            this.visited.push(view);
        },
        /** 添加缓存标签 */
        addCachedView(view: routerTag) {
            // 去重，如果数组里面已经存在过了就不再加进去
            if (this.cached.some((tag) => tag === view.name)) {
                return;
            }
            // 判断一下它是不是不需要缓存
            if(view.meta.noCache){
                return;
            }
            this.cached.push(view.name);
        },
        /** 删除标签条标签 */
        delVisitedView(view: routerTag) {
            const { path } = view;
            const index = this.visited.findIndex((arrElem) => arrElem.path == path);
            if (index > -1) {
                this.visited.splice(index, 1);
            }
        },
        /** 删除缓存标签 */
        delCachedView(view: routerTag) {
            const { name } = view;
            const index = this.cached.findIndex((arrElem) => arrElem == name);
            if (index > -1) {
                this.cached.splice(index, 1);
            }
        },
    },
});

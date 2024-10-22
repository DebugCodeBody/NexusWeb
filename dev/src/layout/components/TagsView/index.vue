<template>
    <div id="tags-view-container">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper">
            <router-link class="tags-view-item" v-for="item in visitedViews" :key="item.path" :to="item.path"
                :class="isActive(item) ? 'active' : ''">
                <span>{{ item.title }}</span>

                <i class="el-icon-close" @click.prevent="onCloseTage(item)" v-if="!item.meta.affix">
                    <Close />
                </i>
            </router-link>
        </scroll-pane>
    </div>
</template>

<script setup lang="ts">
import { RouteLocationNormalizedLoaded } from "vue-router";
import ScrollPane from "./ScrollPane.vue"
import { Close } from "@element-plus/icons-vue";


import path from 'path'
import { tagsviewStore, permissionStore } from "@/store"


const Route = useRoute();
const Router = useRouter();
const tagsView = tagsviewStore();
const permission = permissionStore();

const affixTags = ref<routerTags>([]);
const visitedViews = computed(() => {
    return tagsView.visited;
})


function generateTag(routeItem: RouteLocationNormalizedLoaded, tagPath?: string): routerTag {
    tagPath = tagPath || routeItem.fullPath;
    const meta = routeItem.meta!;
    const title  = meta.title || "没有名字";

    return Object.assign({}, routeItem, {
        title
    }) as any as routerTag

}


function isActive(route: routerTag) {
    return route.path === Route.path;
}

function onCloseTage(item: routerTag) {
    if (isActive(item)) {
        toLastView(item);
    }
    tagsView.delView(item);
}

function toLastView(item: routerTag) {

    let toItem: routerTag;
    const index = visitedViews.value.indexOf(item);

    if (index == 0) {
        // 首位
        toItem = visitedViews.value[0];
    } else if (index == visitedViews.value.length - 1) {
        // 最后一位
        [toItem] = visitedViews.value.slice(-2, -1);
    } else {
        // 中间就取后面那一位
        [toItem] = visitedViews.value.slice(index + 1, index + 2);
    }
    if (toItem) {
        Router.push(toItem as any);
    } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (item.name === 'Dashboard') {
            // 重新加载主页
            Router.replace({ path: '/redirect' + item.fullPath });
        } else {
            Router.push("/");
        }
    }
}

/** 遍历路由，把所有 affix 属性为真的页面找出来 */
function filterAffixTags(routes: routerItems, basePath = "/") {
    const retTags: routerTags = [];

    routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path);
            retTags.push(generateTag(route as any, tagPath));
        }
        if (route.children) {
            retTags.push(...filterAffixTags(route.children, route.path));
        }
    })

    return retTags;
}


function initTags() {
    affixTags.value.push(...filterAffixTags(Router.getRoutes() as any));
    affixTags.value.forEach((tag) => {
        if (tag.name) {
            tagsView.addVisitedView(tag);
        }
    });
}

/** 把当前所在的路由添加store去 */
function addTags() {
    const { name } = Route;
    if (name) {
        tagsView.addView(generateTag(Route));
    }
}


watch(Route, () => {
    addTags();
})

onMounted(() => {
    initTags();
    addTags();
})

</script>

<script lang="ts">
export default {
    name: 'TagsView'
}
</script>

<style lang="scss">
#tags-view-container {
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    height: 35px;

    display: flex;
    align-items: center;
    padding-left: 15px;

    .tags-view-item {
        padding: 0 8px;
        line-height: 24px;
        font-size: 12px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        display: flex;
        align-items: center;
        cursor: pointer;

        &:not(:last-child) {
            margin-right: 8px;
        }

        &.active {
            background-color: #42b983;
            color: #fff;
            border-color: #42b983;

            &::before {
                content: "";
                width: 8px;
                height: 8px;
                background-color: white;
                margin-right: 5px;
                border-radius: 50%;
            }
        }

        .el-icon-close {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            text-align: center;
            transition: all .3s;
            transform-origin: 100% 50%;

            margin-left: 3px;


            &::before,
            & svg {
                display: inline-block;
                transform: scale(0.8);
            }

            &:hover {
                background-color: #b4bccc;
                color: #fff;

            }
        }


    }

    .tags-view-wrapper .el-scrollbar__view {
        display: flex;
        align-items: center;
    }
}
</style>

<template>

    <el-breadcrumb separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>

</template>

<script setup lang="ts" >
import { compile } from 'path-to-regexp'
import { RouteRecord } from "vue-router"

const levelList = ref<any[]>([]);
const Route = useRoute();
const Router = useRouter();


watch(Route, (value) => {
    // 如果是跳转页面的话，那就不生成。
    if (value.path.startsWith('/redirect/')) {
        return;
    }
    generate();
})


/**
 * 把路径转换成vue-router声明里的参数路径，这样才可以正常跳转
 * 比如路由表里有一个路径为 /redirect/:path 的路由
 * 而面包屑上面有一个路径为 /redirect/index
 * 这时候就需要把路径改成符合路由表上面的路径
 *   
 */
function pathCompile(path: string) {
    const { params } = Route
    const toPath = compile(path)
    return toPath(params)
}

/** 
 * 当面包屑被点击后
 * 如果路由表中有 redirect 的路径，就优先跳转
 * 没有的话再跳转 path
 */
function handleLink(routeItem: RouteRecord) {
    const { redirect, path } = routeItem;
    if (redirect) {
        Router.push(redirect as string);
        return
    }

    Router.push(pathCompile(path));
}


/** 判断是否为首页 */
function isDashboard(item: RouteRecord) {
    const path = item && item.path;
    if (!path) {
        return false;
    }

    return path.trim().toLocaleLowerCase() === "/index".toLocaleLowerCase()
}

function generate() {
    const { matched } = Route;

    const newList = matched.filter(item => item.meta && item.meta.title);
    if (!isDashboard(newList[0])) {
        newList.unshift({ path: "/index", meta: { title: "首页" } } as any)
    }

    levelList.value = newList.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)

}


generate();



</script>

<style lang="scss">
.el-breadcrumb__item {

    .el-breadcrumb__separator,
    .el-breadcrumb__inner a {
        font-weight: 400 !important;
    }

    .el-breadcrumb__inner {

        span {
            &:hover {
                color: #1890ff;
                cursor: pointer;
            }

            &.no-redirect {
                color: #97a8be;
                cursor: text;
            }
        }
    }
}
</style>
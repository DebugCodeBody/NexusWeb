<template>

    <div v-if="!item.hidden">
        <template v-if="ShowingChild">
            <router-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
                    <menu-item 
                        :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
                </el-menu-item>
            </router-link>
        </template>

        <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
            <template #title>
                <menu-item 
                    v-if="item.meta" 
                    :icon="item.meta && item.meta.icon" 
                    :title="item.meta.title" />
            </template>
            <sidebar-item 
                v-for="child in item.children" 
                :key="child.path" 
                :is-nest="true" 
                :item="child"
                :base-path="resolvePath(child.path)" 
                class="nest-menu" />
        </el-sub-menu>
        
    </div>

</template>

<script setup lang="ts">
import path from "path";
import menuItem from "./Item.vue"
import { isExternal } from '@/utils/validate'


const Props = withDefaults(defineProps<{
    /** 路由 */
    item: routerItem,

    /** 默认路径 */
    basePath?: string,

    /** 是否为一级路由 */
    isNest?: boolean
}>(), {
    basePath: "",
    isNest: false
});

const onlyOneChild = ref<routerItem>({} as routerItem);
const ShowingChild = computed(() => {
    const { item } = Props;
    return hasOneShowingChild(item.children, item) && (!onlyOneChild.value.children || onlyOneChild.value.noShowingChildren) && !item.alwaysShow
})


/**  */
function hasOneShowingChild(children: routerItems = [], parent: routerItem) {

    const showingChildren = children.filter(item => {
        if (item.hidden) {
            return false
        } else {
            // Temp set(will be used if only has one showing child)
            onlyOneChild.value = item
            return true
        }
    })

    // 当只有一个子路由器时，默认显示子路由器
    if (showingChildren.length === 1) {
        return true
    }

    // 如果没有要显示的子路由器，则显示父路由器
    if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
        return true
    }

    return false
}

function resolvePath(routePath: string) {
    if (isExternal(routePath)) {
        return routePath
    }
    if (isExternal(Props.basePath)) {
        return Props.basePath
    }

    
    return path.resolve(Props.basePath, routePath);
}

</script>

<script lang="ts">
/** 子菜单条 */
export default {
    name: "sidebarItem"
}
</script>

<style lang="scss">

</style>

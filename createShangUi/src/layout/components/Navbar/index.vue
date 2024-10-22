<template>
    <div class="navbar ">
        <div class="wh-full flex justify-between ">
            <div>

            </div>
            <div class="header-navigation">
                <div class="h-full flex items-center">

                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">

                        <template v-for="item in routerTable">
                            <el-menu-item :index="item.path" :key="item.path" v-if="!item.meta.hidden"
                                @click="onClickRouterItem(item.path)">{{ item.meta.title
                                }}</el-menu-item>
                        </template>
                        <el-sub-menu index="2">
                            <template #title>Workspace</template>
                            <el-menu-item index="2-1">
                                <el-icon>
                                    <Unlock />
                                </el-icon>
                                <span>退出登录</span>
                            </el-menu-item>
                            <div class="divider "></div>
                            <div class="i18-meun">
                                <div class="i18-item is-active">
                                    <span>中文</span>
                                </div>
                                <div class="i18-item">
                                    <span>英文</span>
                                </div>
                            </div>
                        </el-sub-menu>
                    </el-menu>


                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Unlock } from '@element-plus/icons-vue'

import { routerTable } from "@/router"




const Route = useRoute();
const Router = useRouter();



const activeIndex = computed(()=>{
    return Route.path;
});

function onClickRouterItem(value: string) {
    Router.push(value);
}






</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.navbar {
    height: 56px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    display: flex;
    align-items: center;
    background-color: white;


    #hamburger-container {
        height: 100%;
        width: 50px;
        text-align: center;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;

        &:hover {
            background: rgba(0, 0, 0, .03);
        }
    }

    #breadcrumb-container {
        margin-left: 10px;
    }


}
</style>

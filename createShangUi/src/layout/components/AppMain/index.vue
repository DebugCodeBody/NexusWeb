<template>
    <div class="app-main">
        <div class="app-content">
            <el-scrollbar>

                <router-view :key="key" />

            </el-scrollbar>
        </div>



    </div>
</template>

<script setup lang="ts">


// <!-- 要这个样子才可以正常的缓存组件，而且 include 参数也必须传进去 -->
// <!-- 
//                 <router-view v-slot="{ Component }">
//                     <transition name="fade-transform" mode="out-in">
//                         <keep-alive :include="cachedViews">
//                             <component :is="Component" :key="key" />
//                         </keep-alive>
//                     </transition>
//                 </router-view> -->

const Route = useRoute();

const key = computed(() => {
    return Route.path
})

</script>

<script lang="ts">
export default {
    name: 'appMain',
}
</script>

<style lang="scss">

.app-content{
    padding: 10px;

    box-sizing: border-box;
}

</style>

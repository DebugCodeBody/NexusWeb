<template>
    <div class="app-main">
        <div class="app-content">
            <el-scrollbar>
                <router-view :key="key" />
            </el-scrollbar>
        </div>

        <!-- 要这个样子才可以正常的缓存组件，而且 include 参数也必须传进去 -->
        <!-- <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view :key="key" />
            </keep-alive>
        </transition> -->

    </div>
</template>

<script setup lang="ts">
import { tagsviewStore } from "@/store"
import { useCurrentElement } from '@vueuse/core'
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from 'vue'


const Route = useRoute();
const tagsView = tagsviewStore();


const cachedViews = computed(() => {
    return tagsView.cached
})

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

</style>

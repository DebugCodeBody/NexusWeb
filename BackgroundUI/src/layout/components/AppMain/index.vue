<template>
    <div class="app-main">
        <div class="app-content">
            <el-scrollbar>
                <router-view v-slot="{ Component }">
                    <transition name="router-fade" mode="out-in">
                        <!-- <keep-alive >
                            <component :is="Component" />
                        </keep-alive> -->

                        <component :is="Component" />

                    </transition>
                </router-view>
            </el-scrollbar>
        </div>

        <!-- <keep-alive :include="cachedViews">
            <transition name="fade-transform" mode="out-in">
                <router-view :key="key" />
            </transition>
        </keep-alive>
 -->

    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from '@vueuse/core'
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from 'vue'



const cachedViews = computed(() => {
    debugger;    
    return /.*?/g
})

const key = computed(() => {
    return ''
})

</script>

<script lang="ts">
export default {
    name: 'appMain',
}
</script>

<style lang="scss">
</style>

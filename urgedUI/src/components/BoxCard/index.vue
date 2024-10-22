<template>
    <div class="box-card">
        <div class="box-card_head">
            <slot name="header"></slot>
            <span class="title">{{ $attrs.title }}</span>
        </div>
        <el-scrollbar class="box-card_body">
            <div style="height: 100%; position: relative;">
                <div style="height: 100%;width: 100%;position: absolute;">
                    <slot></slot>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"


</script>

<script lang="ts">
export default {
    name: "BoxCard"
}
</script>

<style lang="scss" >
.box-card {
    height: 100%;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    border: 1px solid #e4e7ed;
    color: #303133;

    display: flex;
    flex-direction: column;

    .box-card_head {
        height: 50px;
        border-bottom: 1px solid #e4e7ed;
        padding: 10px;
        font-size: 16px;
        text-align: center;
        box-sizing: border-box;

        display: flex;
        align-items: center;
        justify-content: center;

    }

    .box-card_body {
        flex: 1;
        padding: 10px;

        box-sizing: border-box;

    }


}
</style>

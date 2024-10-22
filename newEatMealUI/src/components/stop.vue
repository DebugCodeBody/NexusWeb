<template>
    <svg class="time-ban" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3102">
        <path
            d="M512 884.736c-205.482667 0-372.736-167.253333-372.736-372.736S306.517333 139.264 512 139.264s372.736 167.253333 372.736 372.736-167.253333 372.736-372.736 372.736z m0-704.512c-182.954667 0-331.776 148.821333-331.776 331.776s148.821333 331.776 331.776 331.776 331.776-148.821333 331.776-331.776S694.954667 180.224 512 180.224zM761.173333 781.653333c-5.461333 0-10.24-2.048-14.336-6.144l-498.346666-498.346666c-8.192-8.192-8.192-21.162667 0-28.672 8.192-8.192 21.162667-8.192 28.672 0l498.346666 498.346666c8.192 8.192 8.192 21.162667 0 28.672-4.096 4.096-8.874667 6.144-14.336 6.144z"
            p-id="3103"></path>
    </svg>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" scoped>
svg {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 16px;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
    display: none;


    &:before {
        transform: translate(50%, 30%);
    }
}
</style>

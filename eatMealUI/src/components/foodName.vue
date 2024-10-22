<template>
    <span>{{name}}</span>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

const Props = defineProps<{
    name: string,
    taste?: string
}>();



const name = computed(() => {
    let ret = Props.name;

    if (Props.taste && Props.taste != "正常") {
        ret += `(${Props.taste})`
    }

    return ret;

});







</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

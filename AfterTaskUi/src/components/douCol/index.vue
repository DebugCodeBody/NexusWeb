<template>
    <div class="double-column" :class="{ 'double-center-column': center }">
        <div class="left-view">
            <label>{{  $attrs.label  }}：</label>
        </div>
        <div class="right-view">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, useAttrs, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

const attrs = useAttrs();
const center = attrs.center == null ? false : attrs.center === false ? false : true;



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.double-column {
    display: flex;

    .left-view {
        flex-shrink: 0;
        margin-right: 10px;
    }

    .right-view {
        flex: 1;
    }

    &.double-center-column {
        align-items: center;

        .left-view,
        .right-view {
            display: flex;
            align-items: center;
        }

    }


}
</style>

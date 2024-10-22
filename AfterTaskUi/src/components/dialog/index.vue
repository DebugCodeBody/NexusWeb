<template>
    <el-dialog v-model="prominent" @closed="closed" :custom-class="$attrs['custom-class']">
        <slot name="header"></slot>
        <slot></slot>
        <template #footer>
            <el-button @click="onClose" v-if="Props.showCancelButton" >取消</el-button>
            <el-button type="primary" @click="confirm" :disabled="disabled">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, useAttrs, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

const Emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm", value: diaCloseCb): boolean;
    (e: "cancel"): void;
}>();

const Props = withDefaults(defineProps<{
    disabled?: boolean,
    modelValue: boolean,
    showCancelButton?: boolean
}>(), {
    showCancelButton: true,
    disabled: false
});


function closed() {
    Emits("update:modelValue", false);
}
function confirm() {
    Emits("confirm", onClose)
}

function onClose() {
    prominent.value = false;
    Emits("cancel")
}


const prominent = ref(true);

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

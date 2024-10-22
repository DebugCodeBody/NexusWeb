<template>
    <div class="remind">
        <div class="left">
            <slot></slot>
        </div>
        <span v-if="show">{{ $attrs.text }}</span>
    </div>
</template>

<script setup lang="ts">

const Props = defineProps<{
    modelValue?: boolean 
}>();

const show = computed(() => {
    return !!Props.modelValue
})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" scoped>
.remind {
    display: flex;
    width: 100%;

    .left {
        flex: 1;
    }

    &>span {
        margin-left: 10px;
        color: red;
    }

}
</style>

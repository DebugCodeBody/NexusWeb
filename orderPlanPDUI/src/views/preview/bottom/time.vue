<template>
    <span><template v-if="time.hours">{{time.hours}}小时</template>
    <template v-if="time.minutes">{{time.minutes}}分钟</template></span>
</template>

<script setup lang="ts">

defineProps<{
    time: Time
}>()


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

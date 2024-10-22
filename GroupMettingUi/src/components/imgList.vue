<template>
    <el-image style="width: 100px; height: 100px" :src="imgHref" :fit="'fill'" :preview-src-list="srcList" loading="lazy" :lazy="true" ></el-image>
</template>

<script setup lang="ts">


const Props = defineProps<{
    img: string[],
    index: number
}>();


const imgHref = computed(() => {

    let href = Props.img[Props.index];

    if (process.env.NODE_ENV == "production") {
        href = `${location.origin}/ding/media/smb/${href}`
    } else {
        href = `/api/media/smb/${href}`
    }

    return href

})


const srcList = computed(() => {

    return Props.img.map((href) => {
        if (process.env.NODE_ENV == "production") {
            href = `${location.origin}/ding/media/smb/${href}`
        } else {
            href = `/api/media/smb/${href}`
        }

        return href
    })

})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

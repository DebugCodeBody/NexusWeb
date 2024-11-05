<template>
    <img :src="imgSrc" @error="onImgError">
</template>

<script setup lang="ts">


const Props = defineProps<{
    src: string
}>()


let count = $ref(0);


const imgSrc = $computed(() => {
    if (!Props.src) {
        return ""
    }


    if (process.env.NODE_ENV == "production") {



        if (count == 0) {
            return `../media/smb/${Props.src}`
        } else {
            return `../media/img/${Props.src}`
        }

    } else {
        return `http://${location.host.split(":")[0]}:7001/ding/media/img/${Props.src}`
    }



})


function onImgError() {
    count += 1;
}




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>



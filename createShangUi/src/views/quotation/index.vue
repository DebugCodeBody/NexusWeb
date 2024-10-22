<template>
    <div class="wh-full flex flex-center justify-center">
        <div class=" w-1152px ">
            <quotation :modelItem="dataItem" />
        </div>
    </div>
</template>

<script setup lang="ts">

import quotation from "@/components/quotation/index.vue"

import useDataStore from "@/store/data"

const Route = useRoute();

const dataStore = useDataStore();


const dataItem = $computed(() => {
    return dataStore.files[Route.params.id as any];
})




</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

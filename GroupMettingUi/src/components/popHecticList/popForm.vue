<template>
    <pop-dialog 
        class="pop-edit_track" 
        title="设置繁忙时间" 
        v-model="popValue" 
        @confirm="onConfirm" 
        @opened="onOpenEd"
        @closeed="onCloseEd"
        v-if="renderValur">

        <leave-form ref="formEl" />

    </pop-dialog>
</template>

<script setup lang="ts">


import popDialog from "global@/popDialog/index.vue";

import leaveForm from "@/components/leaveForm/index.vue"


let renderValur = $ref(false);
let popValue = $ref(true);
const formEl = $ref<any>();


function onConfirm() {

}

function onOpenEd() {

}

function onCloseEd() {

}


defineExpose({
    set(item:any) {

        renderValur = true;

        setTimeout(() => {

            formEl.set(item.name, item);

            popValue = true;


        });


    }
})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

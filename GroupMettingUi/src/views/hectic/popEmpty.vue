<template>
    <popDialog v-model="popValue" title="提示" class="hectic-empty" custom-class="hectic-empty" @confirm="onConfirm"
        @cancel="onCancel">

        <div>
            <div class="flex overflow-hidden flex-wrap">
                <div v-for="item in list" :key="item" class="mr-10px mt-10px">
                    <el-tag>{{ item }}</el-tag>
                </div>
            </div>
            <div class="mt-10px">
                <span >以上繁忙时间段未进行设置，是否继续提交？</span>
            </div>

        </div>


    </popDialog>

</template>

<script setup lang="ts">


import popDialog from "global@/popDialog/index.vue"


let popValue = $ref(false);

const list = $ref<string[]>([]);

let confirm: any;
let cancel: any;



/** 确定 */
function onConfirm() {
    confirm();

    popValue = false;

}

/** 取消 */
function onCancel() {
    cancel();
    popValue = false;
}

defineExpose({
    open(value: string[]) {


        return new Promise((resolve, reject) => {

            confirm = resolve;
            cancel = reject;

            list.length = 0;

            list.push(...value);

            popValue = true;

        })

    }
})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

<template>

    <popDialog id="open-dialog" title="打开" v-model="userInfo.pop.open" :modalCancel="false" @confirm="onClickConfirm"
        @cancel="onClickConfirm" @closeed="onCloseEd">

        <div class="app-view_list">
            <el-form 
                :model="formData" 
                :hide-required-asterisk="true" 
                label-width="auto" 
                ref="formEl">
                <el-form-item label="应用">
                    <el-tag>{{ app.name }}</el-tag>
                </el-form-item>
                <el-form-item label="视图">
                    <el-button v-for="item in app.view" :key="item.path" @click="onClickView(item)">{{ item.name }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </popDialog>

</template>

<script setup lang="ts">



import popDialog from "global@/popDialog/index.vue"
import userInfo from "@/store/data"

const formData = $ref({});

const app = computed(() => {
    return userInfo.select.app!
})



function onClickConfirm() {

}

function onCloseEd() {
}

function onClickView(view?: viewItem) {

    const app = userInfo.select.app!;

    userInfo.openApp(app, view);

    userInfo.pop.open = false;

}



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

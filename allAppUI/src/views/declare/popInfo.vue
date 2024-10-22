<template>
    <popDialog id="info-dialog" title="个人信息设置" 
        v-model="userInfo.pop.info" 
        :modalCancel="userInfo.pop.info" 
        :disabledCancel="disabledCancelButton"
        @open="onOpen"
        @confirm="onClickConfirm" 
        @cancel="onCancel">
        <el-form 
                :model="formData" 
                :hide-required-asterisk="true" 
                :rules="rules"
                label-width="auto" 
                ref="formEl">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>

            </el-form>
    </popDialog>
</template>

<script setup lang="ts">

import { ElForm,FormRules  } from 'element-plus'

import popDialog from "global@/popDialog/index.vue"
import userInfo from "@/store/data"


const formData = $ref({
    name: userInfo.name
});
const formEl = $ref<any>();
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ]
});

let disabledCancelButton = $ref(!formData.name);


async function onClickConfirm(){
    try {
        await formEl.validate();
    } catch {
        return;
    }

    userInfo.setName(formData.name);
    userInfo.pop.info = false;

}

function onOpen(){



    formData.name = userInfo.name

}

function onCancel(){

    
    
}

onMounted(() => {

    userInfo.pop.info = (!formData.name);

})


defineExpose({

    

})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

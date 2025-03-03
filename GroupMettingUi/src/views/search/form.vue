<template>
    <el-form :model="formData" label-width="auto" label-position="top" :hide-required-asterisk="true" ref="formEl"
        :rules="rules">
        <el-row :gutter="10">
            <el-col :span="6">
                <el-form-item label="状态" prop="status">
                    <el-select v-model="formData.status" placeholder="请选择会议状态">
                        <el-option v-for="item in statusOption" :key="item.status" :label="item.label"
                            :value="item.status">{{ item.label }}</el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="6">
                <el-form-item label="类型" prop="type">
                    <el-select v-model="formData.type" placeholder="请选择会议类型">
                        <el-option v-for="item in typeOption" :key="item.status" :label="item.label"
                            :value="item.label">{{ item.label }}</el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="6">
                <el-form-item label="创建时间" prop="time">
                    <el-date-picker v-model="formData.time" type="daterange" range-separator="-"
                        start-placeholder="起始时间" end-placeholder="结束时间" />
                </el-form-item>
            </el-col>
            <el-col :span="3">
                <el-form-item label="只显示群内用户" prop="time">
                    <el-switch
                        v-model="formData.isExistGroup"
                        size="large"
                        active-text="是"
                        inactive-text="否"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="3">
                <el-form-item label="客户图纸问题" prop="time">
                    <el-switch
                        v-model="formData.is_optimize"
                        size="large"
                        active-text="是"
                        inactive-text="否"
                    />
                </el-form-item>
            </el-col>

        </el-row>
        <el-row :gutter="10">

            <el-col :span="6">
                <el-form-item label="执行人" prop="track_user">
                    <select-name v-model="formData.track_user" title="搜索执行人">
                    </select-name>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="创建人员" prop="create_user">
                    <select-name v-model="formData.create_user" title="搜索创建人">
                    </select-name>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="参与人员" prop="actor_user">
                    <select-name v-model="formData.actor_user" title="搜索参与人员">
                    </select-name>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="会议内容" prop="content">
                    <el-input v-model="formData.content" @keyup.enter="onContentEnter" clearable></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup lang="ts">

import type { FormRules } from 'element-plus'



import thisManage from "./manage";
import selectName from "@/components/selectName.vue"


const { formData } = thisManage;

const formEl = $ref<any>();


function createValidator(message: string) {

    return function (rule: any, value: any, callback: any) {

        let error: Error | undefined = undefined;
        if (formData.status == 0 && formData.type == "全部" && (!formData.time || !formData.time.length)) {
            error = new Error(message);
        }

        callback(error);

    }

}


const rules = reactive<FormRules>({
    time: [
        {
            validator(rule, value, callback) {

                let error: Error | undefined = undefined;
                if (!formData.time || formData.time.length == 0) {
                    error = new Error("请选择时间范围");
                }

                callback(error);

            },
            trigger: 'blur'
        }
    ],
    track_user: [
        {
            validator: createValidator("请选择执行人"),
            trigger: 'blur'
        }
    ],
    create_user: [
        {
            validator: createValidator("请选择创建人"),
            trigger: 'blur'
        }
    ],
    actor_user: [
        {
            validator: createValidator("请选择参与人"),
            trigger: 'blur'
        }
    ]
});



const statusOption = $ref([
    {
        label: "全部",
        status: 0
    },
    {
        label: "待开",
        status: 1
    },
    {
        label: "正在开",
        status: 2
    },
    {
        label: "结案",
        status: 3
    }
]);


const typeOption = $ref([
    {
        label: "全部",
        status: 0
    },
    {
        label: "在产类",
        status: 1
    },
    {
        label: "防呆类",
        status: 2
    },
    {
        label: "畅聊类",
        status: 3
    },
    {
        label: "现场类",
        status: 4
    }
]);

function onContentEnter() {

    if (formData.content) {

        thisManage.search();

    }

}


onMounted(() => {

    thisManage.setFormEl(formEl);

})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

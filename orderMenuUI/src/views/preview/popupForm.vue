<template>
    <el-dialog v-model="dialogFormVisible" :title="title" @closed="closed">
        <el-form :model="form" label-width="70px" :rules="rules" ref="formEl" :hide-required-asterisk="true">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="类型" prop="ftype">
                <el-input v-model="form.ftype" />
            </el-form-item>
            <el-form-item label="价格" prop="fprice">
                <el-input v-model="form.fprice" type="number" />
            </el-form-item>
            <el-form-item label="库存" prop="fqty">
                <el-input v-model="form.fqty" />
            </el-form-item>
            <el-form-item>
                <el-form-item label="启用" prop="factive">
                    <el-switch v-model="form.factive" />
                </el-form-item>
                <el-form-item label="预制菜品" prop="fpreset">
                    <el-switch v-model="form.fpreset" />
                </el-form-item>
            </el-form-item>

            <el-form-item label="库存方式" prop="stored">
                <el-select v-model="form.stored" placeholder="请选择库存方式">
                    <el-option label="不限制" :value="0" />
                    <el-option label="每餐" :value="1" />
                    <el-option label="每天" :value="2" />
                    <el-option label="全部" :value="3" />
                </el-select>
            </el-form-item>

            <el-form-item label="供餐" prop="supplykind">
                <el-select v-model="form.supplykind" class="m-2" placeholder="请选择供餐时间">
                    <el-option label="早餐" :value="1" />
                    <el-option label="中餐" :value="2" />
                    <el-option label="晚餐" :value="3" />
                    <el-option label="夜宵" :value="4" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="done">确定</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import bigjs from "big.js";
import type { FormInstance, FormRules } from 'element-plus'


import { add, edit } from "@/api/canteen"

const Emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'addItem'): void;
}>();

const Props = defineProps<{
    modelValue: boolean,
    edit: canteenItem
}>();


const isEdit = ref(Props.edit.name != null);
const formEl = ref<FormInstance>();


const rules = reactive({
    name: [{
        required: true,
        message: '请输入菜品名字',
        trigger: 'blur'
    }]
    ,
    ftype: [{
        required: true,
        type: "string",
        message: '请输入菜品类型',
        trigger: 'blur'
    }
    ]
    ,
    fprice: [
        {
            required: true,
            message: '请输入菜品价格',
            trigger: 'blur',
        },
        {
            required: true,
            validator(rule: any, value: any, callback: any) {

                const valBig = new bigjs(value || 0);

                if (valBig.lte(new bigjs(0))) {
                    callback(new Error('菜品价格必须大于0'));
                } else {
                    callback();
                }


            }
        }
    ]
})



const title = isEdit.value ? "编辑" : "添加";
const dialogFormVisible = ref(true);
const form = reactive((Props.edit && JSON.parse(JSON.stringify(Props.edit))) || {
    name: "",
    ftype: "",
    fprice: "",
    fqty: 1,
    factive: true,
    supplykind: null,
    fcan_remarks: false,
    fmake: 1,
    fmode: 1,
    fauto: 1,
    fprocess_cost: "",
    fcategory: 1,
    fpreset: false,
    farea: 1,
    stored: 0
});


function closed() {
    Emits('update:modelValue', false);
}

async function done() {

    try {
        await formEl.value!.validate();
    } catch (err) {
        console.log(err, "表单验证失败");
        return;
    }

    if (!isEdit.value) {
        await add(form)
        Emits("addItem");
    } else {
        await edit(form)
        Emits("addItem");

    }

    dialogFormVisible.value = false
}

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.pop-dialog {
    width: 90%;


}

.el-form-item {
    .el-form-item__content {
        margin-left: 0 !important;

        .el-form-item:not(:first-child) {
            margin-left: 20px;
        }

    }
}
</style>

<template>
    <div class="wh-full overflow-auto form-content ">
        <div class="relative">
            <div class="p-5px">
                <el-form :model="form" :hide-required-asterisk="true" :rules="rules" label-width="40" ref="formEl">
                    <el-form-item label="单号" prop="orderId">
                        <el-input v-model="form.orderId"></el-input>
                    </el-form-item>
                    <el-form-item label="材料" prop="matName">
                        <el-input v-model="form.matName"></el-input>
                    </el-form-item>
                    <el-form-item label="规格" prop="spec">
                        <el-input v-model="form.spec"></el-input>
                    </el-form-item>
                    <el-row :gutter="5">
                        <el-col :span="12">
                            <el-form-item label="数量">
                                <el-input-number v-model="form.qty" :min="1" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="金额">
                                <el-input v-model="form.amount"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="报价成本" class="pre-label">
                        <el-tag type="danger" v-if="form.excost">{{ form.quocost }}</el-tag>
                        <el-tag v-else>{{ form.quocost }}</el-tag>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElForm, FormRules } from 'element-plus'

const Props = withDefaults(defineProps<{
    data?: buyorderItem
}>(), {
    data: {} as any
});

const form = $ref(Object.assign({
    orderId: "",
    matName: "",
    spec: "",
    qty: 1,
    amount: "",
    quocost: "",
    excost: false

}, Props.data));

const rules = reactive<FormRules>({
    orderId: [
        { required: true, message: '请填写工单号', trigger: 'blur' }
    ],
    matName: [
        { required: true, message: '请填写材料名', trigger: 'blur' }
    ],
    spec: [
        // { required: true, message: '请填写规格', trigger: 'blur' }
    ],
})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.form-content {

    form {
        padding: 10px;
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);


        textarea {
            height: 100px;
            resize: none;
        }

        .el-checkbox-group .el-checkbox,
        .el-radio-group .el-radio {
            margin-right: 10px;
            margin-bottom: 10px;
            padding: 0 10px;
        }


    }

}

.button-block {
    .el-button {
        width: 100%;

        &+.el-button {
            margin-left: 0;
        }
    }
}
</style>

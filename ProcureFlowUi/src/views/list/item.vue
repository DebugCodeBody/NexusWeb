<template>
    <div class="item-content">
        <el-form class="mb-0" :hide-required-asterisk="true" label-width="40" ref="formEl">
            <el-form-item label="单号">
                <div class="w-full flex justify-between">
                    <span>{{ item.orderId }}</span>
                    <el-checkbox v-model="selectValue" @change="onChange" />
                </div>
            </el-form-item>
            <el-form-item label="材料">
                <span>{{ item.matName }}</span>
            </el-form-item>
            <el-form-item label="规格" v-if="item.spec">
                <span>{{ item.spec }}</span>
            </el-form-item>
            <el-row :gutter="5" class="mb-10px">
                <el-col :span="12">
                    <el-form-item label="数量">
                        <span>{{ item.qty }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="金额">
                        <span>{{ item.amount }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="5">
                <el-col :span="12">
                    <el-form-item label="重量">
                        <span>{{ item.bweight }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="单价">
                        <span>{{ item.taxinfo }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="报价成本" class="pre-label mt-10px" v-if="item.quocost">
                <el-tag>{{ item.quocost }}</el-tag>
                <span class="ml-10px text-red" v-if="item.excost">超出报价成本</span>
            </el-form-item>
        </el-form>


    </div>
</template>

<script setup lang="ts">

const Props = defineProps<{
    item: buyorderItem
}>();

let selectValue = $ref(false);

function onChange(value: boolean) {
    SetValue(Props.item, value);
}

function SetValue(item: buyorderItem, value: boolean) {
    item.select = value;
}

watch(() => Props.item.select, (value) => {

    selectValue = value;

})

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.item-content {
    .el-checkbox {
        height: initial !important;
    }

}
</style>

<template>
    <van-cell-group inset>

        <van-field name="checkboxGroup" label="时间">
            <template #input>
                <van-tag plain type="primary">{{ time }}</van-tag>
            </template>
        </van-field>

        <van-field class="field-weight" name="checkboxGroup" label="米饭"
            :rules="[{ required: true, message: '请选择米饭份量' }]">
            <template #input>
                <van-radio-group v-model="formData.weight" direction="horizontal">
                    <van-radio v-for="item in weightList" :key="item" :name="item">{{ item }}</van-radio>
                </van-radio-group>

            </template>
        </van-field>

        <van-field name="checkboxGroup" label="口味">
            <template #input>

                <van-checkbox-group v-model="formData.spice" direction="horizontal">
                    <van-checkbox shape="square" v-for="item in spiceList" :key="item" :name="item">{{ item
                        }}</van-checkbox>
                </van-checkbox-group>
            </template>
        </van-field>

    </van-cell-group>
</template>

<script setup lang="ts">


const Props = defineProps<{
    time: string
}>();

const weightList = $ref([
    "一两",
    "二两",
    "三两",
    "四两",
    "六两",
])

const spiceList = $ref([
    "免辣"
])

const formData = $ref({

    /** 米饭份量 */
    weight: "",

    /** 补餐口味 */
    spice: []

})


defineExpose({
    getInfo() {


        return {
            time: Props.time,
            weight: formData.weight,
            spice: formData.spice[0] || ""
        }

    }
})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

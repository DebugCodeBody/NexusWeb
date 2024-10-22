<template>
    <el-select
        v-model="selectValue" 
        multiple 
        clearable 
        collapse-tags 
        :placeholder="placeholder" 
        :disabled="disabled"
        popper-class="custom-header" 
        :max-collapse-tags="1" 
        class="name-select" 
        ref="selectEl">
            <el-option v-for="item in modelValue" :key="item" :label="item" :value="item" />
    </el-select>
</template>

<script setup lang="ts">

const Emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void;
}>();


const Props = withDefaults(defineProps<{

    /** 弹窗的标题 */
    title?: string,

    /** 已经勾选的用户 */
    modelValue: string[],

    /** 是否禁用 */
    disabled?: boolean,

    /** 是否只选中一个 */
    isOne?: boolean,

    placeholder?: string

    

}>(), {
    isOne: false,
    disabled: false
});

const selectValue = $ref<string[]>();

const selectEl = $ref<any>();
let closeEl: HTMLDivElement;


watch(()=>Props.modelValue, (value)=>{

    if(value !== selectValue){
        
        selectValue.length = 0;
        selectValue.push(...value);

    }


})


function updateModelValue() {
    Emit('update:modelValue', selectValue);
}


async function openStart() {

    try {


        const selectList = [...selectValue];

        const selectName = await window.openNameSelect({

            title: Props.title,
            isOne: Props.isOne,

            selectList

        });

        selectValue.length = 0;
        selectValue.push(...selectName);

        updateModelValue();

    } catch {
        return;
    }

}


function clickClear() {
    selectValue.length = 0;
    updateModelValue();
}



function onClick(event: PointerEvent) {

    const target = event.target as any;

    event.stopPropagation();

    if (!closeEl.contains(target) || Props.modelValue.length == 0) {

        openStart();

    } else {

        clickClear();

    }


}




onMounted(() => {

    closeEl = selectEl.$el.querySelector(".el-select__suffix")!;
    if (!closeEl) {
        closeEl = selectEl.$el.querySelector(".el-input__suffix")!
    }

    selectEl.$el.addEventListener("click", onClick as any, true)

})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>

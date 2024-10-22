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
    style="width: 130px" 
    class="name-select" 
    ref="selectEl">
    <el-option v-for="item in modelValue" :key="item" :label="item" :value="item" />

  </el-select>


</template>

<script setup lang="ts">

import { pySearch } from "@/utils/other"
import popDialog from "global@/popDialog/index.vue"

const el = $ref(useCurrentElement());


const Emit = defineEmits<{

  (e: "open"): void
  (e: "confirm"): void
  (e: "clear"): void
  
}>();



const Props = withDefaults(defineProps<{

  title: string,

  /** 要搜索的用户 */
  userList: userItem[],

  /** 已经勾选的用户 */
  modelValue: string[],

  /** 是否禁用 */
  disabled: boolean,

  placeholder?: string,

  isOne?: boolean,

  showCount?:boolean

}>(), {

  isOne: false,
  showCount: true

});



let dialogSearch = $ref({

  visible: false,
  dataList: [] as string[],

  select: [...Props.modelValue] as string[],

  search: ""

});

const selectEl = $ref<any>();

const selectValue = $ref<string[]>([...Props.modelValue]);

watch(() => Props.modelValue.length, (value) => {


  selectValue.length = 0;
  dialogSearch.select.length = 0;


  selectValue.push(...Props.modelValue);
  dialogSearch.select.push(...Props.modelValue);

})


let closeEl: HTMLDivElement;
function onClick(event: PointerEvent) {

  const target = event.target as any;

  event.stopPropagation();


  if (!closeEl.contains(target) || Props.modelValue.length == 0) {
    showDiaLog();

  } else {
    onClickClear();
  }


}

async function showDiaLog() {
  Emit("open");

  try{
    
        const resultUser = await window.openNameSelect({
            title: Props.title,
            userList: Props.userList,
            selectList: Props.modelValue,
            showCount: Props.showCount
            
        });
            
      Props.modelValue.length = 0;
      Props.modelValue.push(...resultUser);

      
      Emit("confirm");


    } catch {
        return;
    }




}

function onClickClear() {


  Emit("clear");

  Props.modelValue.length = 0;

  Emit("confirm");

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

<style lang="scss">
.el-select.name-select {

  .el-select__suffix {
    display: none;
  }

  .is-hovering {
    .el-select__suffix {
      display: block;
    }
  }

  .el-tag .el-icon {
    display: none;

  }

  

}
.dialog-search{

  .item-count{
    margin-left: 2px;
  }
  
}
</style>

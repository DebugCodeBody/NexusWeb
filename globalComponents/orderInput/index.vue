<template>
    <div class="order-search-select" :class="{
        'no-select': !select
    }">

        <el-select 
            v-model="selectValue" 
            :placeholder="placeholder" 
            filterable 
            remote 
            loading-text="搜索订单中"
            :loading="remoteLoading" 
            :remote-show-suffix="true"
            @change="onSelectChange" 
            @visible-change="onVisiblechange"
            @blur="onSelectBlur" 
            ref="elSelectEl" 
            v-if="search">
            <el-option v-for="item in selectOption" :key="item.orderid" :label="item.orderid" :value="item.orderid" />
        </el-select>

        <el-input 
            v-model="newInputValue" 
            :placeholder="placeholder" 
            ref="newInputEl" 
            @input="onvalue" 
            @blur="onInputBlur"
            :disabled="disabled" />

        <el-button type="primary" @click="onScanning" :disabled="disabled">扫描</el-button>


    </div>
</template>

<script setup lang="ts">
import { useDebounceFn, useCurrentElement } from "@vueuse/core"

import { ElMessage } from 'element-plus'

import to from "await-to-js"
import { searchText, searchMoid } from "./api"
import { scanning } from "@/utils/other"

/** 搜索结果 */
interface searchResult {
    attaid: number,
    moid: number,
    orderid: string,
}

const Emit = defineEmits<{
    (e: "update:modelValue", value: string): void,
    (e: "scan", value: string): void,
}>();

const Props = withDefaults(defineProps<{
    modelValue: string,
    /** 是否需要搜索 */
    search?: boolean,
    /** 如果不选择搜索出来的结果，是否把输入框的值设置为modelValue */
    default?: boolean,
    /** 禁止 */
    disabled?: boolean,
    placeholder?: string
    rules?: (value:string)=>boolean

}>(), {
    default: false,
    disabled: false,
    search: true,
    placeholder: "请输入订单号",
    rules:(value:string)=>true
});





let el = $ref(useCurrentElement());
let elSelectEl = $ref();
let selectHide = false;

/** 自定义输入框 */
let newInputEl = $ref();
/** 自定义输入框绑定的变量 */
let newInputValue = $ref("");


let remoteLoading = $ref(false);
let selectValue = $ref("");
let selectOption = $ref<searchResult[]>([]);
let touchstart = $computed(() => {
    return 'ontouchstart' in document
});

const isPc = $computed(()=>{
    return window.dd.pc;
});


let select = false;
/** 是否停止搜索 */
let stopSearch = false;


async function postMid(fun: any, arg: any, callback: any) {
    remoteLoading = true;
    const [err, result] = await to(fun(arg));
    remoteLoading = false;

    if (err) {
        ElMessage.error(err.msg || err.message || "搜索错误，请重试！")
        return;
    }

    callback(result);
}


/** 通过字符串手动组装一个选项 */
function setSelectOption(val: string) {

    selectValue = val;
    selectOption.splice(0, selectOption.length, {
        attaid: 0,
        moid: 0,
        orderid: val
    });
    onSelectChange(val);

}



/** 扫码识别moid后识别 */
async function onScanning() {

    let moid;
    if (true) {
        moid = await scanning();
        if (!moid) {
            return
        }


    } else {

        if(!(moid = newInputValue)){
            return;
        }

    }

    if(/https?:\/\//.test(moid) || !Props.rules(moid)){
        ElMessage.error('请扫描正确的条码')
        return;
    }

    
   
    


    Emit("scan", moid);

    if (!Props.search) {
        onSelectChange(moid);
        return;
    } else {
        postMid(searchMoid, moid, (result) => {
            setSelectOption(result);
        });
    }

    return moid;

}


const debounceSearch = useDebounceFn(async function (value: string) {
    if (stopSearch) {
        return;
    }

    postMid(searchText, value, (result) => {

        if (result.length) {

            selectOption.splice(0, selectOption.length);
            setTimeout(() => {
                selectOption.push(...result);
            });
        } else {
            setSelectOption(value);
        }


        // 如何触发这个bug
        // 先输入关键字，等搜索完成弹出选择夹
        // 在清空关键字，等选择夹收回去并且丢失焦点
        // 然后再输入关键字，这时候搜索出来的内容就不会弹出选择夹了
        // 这里用自带的 focus 的获取焦点函数依然是不会弹出选择夹的，所以要直接操作它的变量
        if (!selectHide) {
            setTimeout(() => {
                elSelectEl.visible = true;
            })
        }


    });

}, 500)

function onvalue(value: string) {

    if(Props.search){
        // 如果内容为空,那么就不搜索
        if (!value) {
            elSelectEl.blur();
            onSelectChange(selectValue = value);
            stopSearch = true;
            return;
        } else {
            stopSearch = false;
        }

        remoteLoading = true;
        if (!selectHide) {
            setTimeout(() => {
                elSelectEl.visible = true;
            })
        }

        // 这里把输入框函数和搜索函数分开，主要是为了能够快速响应内容为空的时候
        // 如果把当前函数设置成防抖函数，那么在清空内容的时候会有一定的延时，对当前组件的绑定变量不能够快速的响应
        debounceSearch(value);
            
    }else{
        Emit("update:modelValue", value);
    }



}



function onSelectChange(value: string) {

    newInputValue = value;
    Emit("update:modelValue", value);
}

/** 选择夹展开收缩回调 */
function onVisiblechange(value: boolean) {
    selectHide = value;
}

function onSelectBlur() {
}


function onInputBlur() {
    if (Props.default) {
        onSelectChange(newInputValue);
    }
}


// 下面这些代码是按钮来控制展开和收缩的，但是现在暂时用不到先不管了

// /** 按钮触发 */
// let a = false;
// /** 选择夹获取焦点触发 */
// let b = false;
// let c = 0;

// /**
//  *  选择夹的展开和收缩会比按钮点击事件先触发
//  *  如果手动点击选择夹展开后，在点击按钮。这个时候就会判断错误。导致再次展开一次
//  *
//  */
// function onVisiblechange(value:boolean){

//     if(value && !a){
//         c = 2;
//         a = true;
//     } else {

//       if(c == 2 && a){
//         a = false;
//       }
//     }

//     b  = value;
// }

// function test(){

//     if (a || b){
//         elSelectEl.blur();
//         a = false;
//         b = false;
//     } else {
//         elSelectEl.visible = true;
//         a = true;
//     }

//     c = 1;


// }


onMounted(() => {

    if (Props.modelValue) {
        setSelectOption(Props.modelValue);
    }


    if (Props.search) {

        const Input = newInputEl.$el.querySelector("input");

        const inpitParent = Input.parentElement;
        const selectInput = elSelectEl.$el.querySelector("input");

        selectInput.parentElement.insertBefore(Input, selectInput);

        inpitParent.parentElement.style = "display:none !important; "
        selectInput.style = "display:none !important;"

    }



    // select中的.visible 控制展开，但是隐藏的话就需要使用的 blur 函数来丢失焦点取消
    // 如果需要手动来控制展开和缩放，需要一个变量来保存当前状态，展开之后在下次事件循环中再次获取 .visible  的话，那么还是为false

    // element-plus@2.2.17 上进行修改
})

defineExpose({
    Scan: onScanning,
    clear(){
        newInputValue = "";
        selectValue = "";
    }
})


</script>

<script lang="ts">
/**
 * 
 * 搜索订单号封装
 * 字符串搜索 orderid
 * moid搜索 orderid
 * 二维码，条形码扫描
 * 
 */
export default {
    name: "OrderIpunt"
}


</script>

<style lang="scss">
.order-search-select {
    display: flex;
    
    align-items: center;

    .el-select {
        flex: 1;
        margin-right: 10px;
        box-sizing: box-shadow;
    }

    &.no-select {
        .el-input {
            margin-right: 10px;
        }
    }
}
</style>

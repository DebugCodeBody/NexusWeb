<template>
    <el-dialog        
        v-model="prominent" 
        @close="dialogClose"
        @closed="dialogClosed"
        @open="dialogOpen"
        @opened="dialogOpened" 


        :show-close="isShowClose"
        :beforeClose="onBeforeClose"
        :close-on-click-modal="isModalCancel"
        :custom-class="$attrs && ($attrs['custom-class'] || $attrs['class'])"
        :center="center"
        :close-on-press-escape="isCloseOnPressEscape"

        isDisabledCancelButton
        v-bind="$attrs"
        :width="width"
        :title="title || $attrs.title"
        :destroy-on-close="destroyOnClose"
        :modalAppendToBody="modalAppendToBody"
        v-if="lazyRender"

        ref="el"
        >

        <slot name="header"></slot>

        <div class="content" v-if="disabledSubmitOverlay">
            <slot></slot>
        </div>
        <div class="content" v-else v-loading="overlayLoad">
            <slot></slot>
        </div>

        <template #footer>
            <el-button @click="cancel" v-if="isShowCancelButton" :disabled="submitLoading || disabledCancelButton">取消</el-button>
            <slot name="footer-center"></slot>
            <el-button type="primary" @click="confirm" v-if="Props.showConfirmButton" :disabled="confirmDisabled"
                :loading="submitLoading || loading">确定</el-button>
            <slot name="footer"></slot>
        </template>

    </el-dialog>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { version, ref, reactive, nextTick, defineEmits, defineProps, useAttrs, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { callThenFun } from "../coreUtils/Common"



const Emits = defineEmits<{
    /** 确定按钮点击事件 */
    (e: "confirm"): void;
    /** 取消按钮点击事件 */
    (e: "cancel"): void;

    /** close 关闭的回调 */
    (e: "close"): void;

    /** close 关闭动画结束的回调 */
    (e: "closeed"): void;
    
    /** Dialog 打开的回调 */
    (e: "open"): void;
    /** Dialog 打开动画结束时的回调 */
    (e: "opened"): void;
    /** Vue3 的更新 */
    (e: 'update:modelValue', value: boolean): void;
    /** Vue2 的更新 */
    (e: 'input', value: boolean): void;


}>();

const Props = withDefaults(defineProps<{
    /** 是否禁止操作 */
    disabled?: boolean,

    /** 是否显示取消按钮 */
    showCancelButton?: boolean,
    /** 是否显示确定按钮 */
    showConfirmButton?: boolean,

    /** 是否正在加载数据中 */
    loading?: boolean
    /** 是否禁止确定按钮 */
    disabledConfirmButton?: boolean,
    /** 是否禁止取消按钮 */
    disabledCancelButton?: boolean,
    /** 是否禁用提交的时候遮罩层，默认为假 */
    disabledSubmitOverlay?: boolean

    /** 是否允许点击外面关闭窗口，默认允许 */
    modalCancel?: boolean

    /** 是否显示关闭按钮 */
    showClose?: boolean

    /** 是否居中显示 */
    center?: boolean


    /** vue3 用来控制弹窗是否出现 */
    modelValue?: boolean

    /** vue2 用来控制弹窗是否出现  */
    value?: boolean

    width?: string

    title?: string,

    destroyOnClose?:boolean,

    /** 是否懒加载 */
    isLazy?:boolean,

    /** 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上 */
    modalAppendToBody?: boolean,

    /** 是否可以通过按下 ESC 关闭 Dialog, 默认为true */
    closeOnPressEscape?: boolean 
    /** 
     * 
     * 不显示取消按钮，不显示右上角叉号，不允许点击外部关闭，只允许通过model来进行关闭
     * 此属性为true的时候，将自动把 disabledCancelButton ，modalCancel ，showClose 属性设置为false
     * 
     *  */
    disabledCancel?:boolean

}>(), {
    showCancelButton: true,
    showConfirmButton: true,
    disabled: false,
    loading: false,
    disabledConfirmButton: false,
    disabledCancelButton: false,
    disabledSubmitOverlay: true,
    modalCancel: true,
    showClose: true,
    center: false,
    width: "50%",

    isLazy: false,
    modalAppendToBody: true,

    disabledCancel: false,

    closeOnPressEscape: true

});


const Attrs = useAttrs();

const isShowCancelButton = computed(()=>{
    return  Props.disabledCancel ? false : Props.showCancelButton;
})

const isModalCancel = computed(()=>{
    return  Props.disabledCancel ? false : Props.modalCancel;
})

const isShowClose = computed(()=>{
    return  Props.disabledCancel ? false : Props.showClose;
})

const isCloseOnPressEscape = computed(()=>{

    return  Props.disabledCancel ? false : Props.closeOnPressEscape;
})


const isVue2 = version.substring(0, 1) == '2';
const el = ref();



/** 通过 alert 弹出的窗口异步函数 */
let alertReject;
let alertResolve;
/** 是否为alert弹窗模式 */
const alertProminent = ref(false);

/** 
 * 通过 v-model 绑定的值来弹出窗口,然后调用close关闭窗口的异步回调
 */
let closeResolve;
const isClose = ref(false);




let prominent = computed({
    get() {

        if (isClose.value) {
            return false;
        }

        return alertProminent.value || Props.value || Props.modelValue;
    },
    set() {

    }
})

const lazyRender = ref(!Props.isLazy);
let lazyWatch;




if(Props.isLazy){
    lazyWatch = watch(prominent, (value)=>{
        if(value){
            lazyRender.value = true;
            lazyWatch();
        }
    })
}




function openDialog(value) {
    if(!lazyRender.value){
        lazyRender.value = true;
    }




    const hookconsoleerror = console.error;
    console.error = () => { };
    el.value.visible = value;
    console.error = hookconsoleerror;
}



/** 是否在提交 */
const submitLoading = ref(false);
/** 提交遮罩层，用来开始提交的时候禁止用户操作中间的内容 */
const overlayLoad = ref(false);
/** 禁止确定按钮 */
const confirmDisabled = computed(() => {
    return Props.disabled || Props.loading || Props.disabledConfirmButton
})



function dialogOpen() {
    Emits("open");
}

/** Dialog 打开动画结束时的回调 */
function dialogOpened() {
    Emits("opened");
}


/** 
 * 
 * 在Vue2中，因为使用直接修改原型链的方法。没有进行数据的绑定，导致 el-dialog 在更新 visible 的时候没有效果
 * 因为vue2的 el-dialog 使用 visible.sync 进行绑定
 * 那么只能够监听关闭的回调，自己修改变量值
 * 
 * 2023-08-01
 *      经过代码查看，这里可以直接更新绑定的值为false 
 * 
 * 
 * el-dialog 弹窗关闭
 * 
 */
function dialogClose() {
    // if (isVue2) {
    //     alertProminent.value = false;
    //     Emits("update:modelValue", false);
    //     Emits('input', false);
    // }


    isClose.value = false;
    alertProminent.value = false;
    Emits("update:modelValue", false);
    Emits('input', false);
    Emits('close', false);

    
}

/** Dialog 关闭动画结束时的回调 */
function dialogClosed() {
    Emits('closeed', false);


    if (closeResolve) {
        closeResolve();
        closeResolve = null;
    }
    /** 这个是使用了 alert 函数来弹出的窗口，所以关闭弹窗的时候走 reject 回调 */
    if (alertReject) {
        alertReject();
        alertResolve = null;
        alertReject = null;
    }

}



/** 点击确定事件 */
function confirm() {
    Emits("confirm");

    if (alertResolve) {
        alertResolve();
    }

}

/** 点击取消事件 */
function cancel(){

    Emits("cancel");
    onClosed();

}


/**
 * 关闭弹窗
 */
function onClosed() {

    return new Promise((resolve, reject) => {

        isClose.value = true;
        closeResolve = resolve;

    })
}

/**
 * 关闭弹窗前的回调函数
 * @param done 关闭弹窗的执行函数，如果需要关闭弹窗需要执行此参数
 */
function onBeforeClose(done: any) {
    if (!submitLoading.value) {
        done();
    }
}

/**
 *  开启提交动画
 *  确定按钮有个loading效果
 *  且不允许关闭弹窗    
 */
function startSubmit(callback?: any) {
    submitLoading.value = true;

    if (!Props.disabledSubmitOverlay) {
        overlayLoad.value = true;
    }

    if (callback) {
        callThenFun(callback, stopSubmit);
    }

}

/** 停止提交动画 */
function stopSubmit() {
    submitLoading.value = false;
    overlayLoad.value = false;
}


/**
 * 使用函数来弹出窗口，返回一个异步函数
 * 点击确定按钮的时候将调用 resolve 回调
 * 点击取消按钮的时候将调用 reject 回调 
 * 
 * 但是这个函数有个BUG，那就是只有首次回调能够正常触发
 * 也不能算Bug，而是异步就是这个样子
 * 
 * 这里不再使用异步了，封装此组件的目的一般是为了和表单配合使用
 * 表单需要验证，而验证失败的话使用Promise来进行回调会出现除了首次的回调可以正常，后面的都无法回调到
 * 
 * 使用函数回调方式，可以同时触发确定和取消事件
 * 这在某些场景下面很有用，比如一个表单确定后，需要把表单内容全部清空。如果使用Promise的话，是没办法实现这个需求的
 * 
 * 
 */
function alert(arg: any = {}) {

    alertProminent.value = true;

    alertResolve = arg.confirm;
    alertReject = arg.close;

    // return new Promise((resolve, reject)=>{

    //     prominent.value = true;

    //     alertReject = reject;
    //     alertResolve = resolve;

    // })



}

onMounted(() => {
    
    if (isVue2) {
        watch(prominent, openDialog, {
            immediate: true
        })
    }
    
    

})

defineExpose({
    close: onClosed,
    startSubmit,
    stopSubmit,
    alert
})


</script>

<script lang="ts">
/**
 * 弹窗组件，用来简化代码量的封装
 * 只是一个简单的封装了确定和取消的操作
 * 
 * 如果需要关闭弹窗，请使用组件的 close 函数来进行操作，这样才有过渡效果
 */
export default {
    name: "popDialog"
}


</script>

<style lang="scss">
.el-dialog__body .content {
    .el-loading-mask {
        opacity: 0;
    }

    .el-loading-spinner {
        display: none;

    }
}
</style>

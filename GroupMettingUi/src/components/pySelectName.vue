<template>

    <popDialog 
        v-model="popValue" 
        :title="popParams.title" 
        class="dialog-search" 
        custom-class="dialog-search" 
        :class="{
            'is-one': popParams.isOne
        }" 
        :disabledConfirmButton="!popParams.selectList.length"
        @confirm="onSearchConfirm" 
        @cancel="onSearchCancel"
        @closeed="onCloseEd"
        @opened="onOpenEd">


        <div class="mb-10px">
            <el-input v-model="popParams.search" size="default" placeholder="用户搜索" clearable @clear="onPyClear" ref="pyInputEl" ></el-input>
        </div>

        <div class="mt-50px" v-show="popParams.pyValue"></div>

        <el-checkbox-group v-model="popParams.selectList" @change="onChange">
            <el-checkbox 
                v-for="item in popParams.showUserList" 
                :key="item.name" 
                :label="item.name" 
                :value="item.name"
                :border="true">
                <span>{{ item.name }}</span>
                <el-tag size="small" class="item-count" v-if="popParams.showCount">{{ item.count }}</el-tag>
            </el-checkbox>
        </el-checkbox-group>

    </popDialog>


</template>

<script setup lang="ts">

import popDialog from "global@/popDialog/index.vue"

import { pySearch } from "@/utils/other"


const Props = defineProps<{
    userList?: userItem[]
}>();


let inputEl: HTMLInputElement;

const pyInputEl = $ref<any>();



let popValue = $ref(false);
let timtEmitClear = false;

const callback = {
    resolve: undefined as any,
    reject: undefined as any,
}

const popParams = $ref({

    title: "",
    /** 是否正在加载 */
    loading: false,

    /** 搜索py内容 */
    search: "",

    /** 选中的名字列表 */
    selectList: [] as string[],

    /** 需要展现的名字列表 */
    userList: [] as userItem[],

    /** 是否选中一个 */
    isOne: false,

    /** 默认选中的名字，排序在最前面 */
    defaultSelect: [] as string[],

    /** 拼音的内容 */
    pyValue: "",

    /** 需要显示的用户列表 */
    showUserList: [] as userItem[],

    /** 是否显示数量 */
    showCount: false

});


/** 用户过滤 */
function userFilter() {

    const usedList = [] as userItem[];
    let noList = [] as userItem[];

    const { search, defaultSelect, pyValue, userList, showUserList } = popParams;

    noList.push(...userList);


    if (pyValue) {
        noList = pySearch(noList, pyValue);
    }

    showUserList.length = 0;
    showUserList.push(...usedList, ...noList);

    return showUserList;

}




function onSearchConfirm() {


    let value:string|string[];
    if(popParams.isOne){
        
        value = popParams.selectList[popParams.selectList.length - 1]
    }else{
        value = [...popParams.selectList]
    }

    callback.resolve(value);

    popValue = false;

}

function onPyInput(event: Event) {

    const { value }  = inputEl;
    


    /** 
     *
     * 这里因为在回车按下的时候，有时候还是会触发到这个输入事件
     * 所以需要做个拦截，在回车定时器里设置 timtEmitClear = true
     * 然后再输入事件判断，如果为true的话不再进行赋值，而且需要把他们的值给删除掉
     * 
     */
    if(timtEmitClear){
        timtEmitClear = false;
        setTimeout(()=>{
            onPyClear();
        })
        return;
    }

    popParams.pyValue = value;
    userFilter();


}

function onPyKeyDown(event: KeyboardEvent){


    /**
     * 
     * keyCode = 229 的话，那就是当前是中文输入法
     * 需要判断当前案件的是不是回车
     * 
     * 13 = 英语输入的回车
     * 
     * 
     * 
     *  */   
    if((event.keyCode != 13 && event.keyCode != 229) || (event.keyCode == 229 && event.code != 'Enter' && event.code != 'NumpadEnter' )  ){
        return;
    }

    const { showUserList, selectList } = popParams;

    if(showUserList.length == 1){

        const { name } = showUserList[0];
        
        selectList.push(name);

        onChange(name);

        if(!popParams.isOne){
            
            setTimeout(() => {
                timtEmitClear = true;
                onPyClear();   
            });
        }

    }

}

function onPyClear(){
    
    popParams.search = "";
    popParams.pyValue = "";

    userFilter();

}



function onSearchCancel(){

    callback.reject();

}


function onChange(value: string) {

    if (popParams.isOne) {

        nextTick(() => {
            onSearchConfirm();
        })

    }

}

/** 打开完成的时候，输入框获取焦点，给输入框绑定事件 */
function onOpenEd(){
    

    pyInputEl.focus();

    inputEl = document.querySelector<HTMLInputElement>(".dialog-search .el-input__inner")!;

    inputEl?.addEventListener("input", onPyInput);
    inputEl?.addEventListener("keydown", onPyKeyDown);


}

/** 关闭完成的时候，取消输入框事件 */
function onCloseEd() {

    callback.reject = callback.resolve = undefined;

    inputEl?.removeEventListener("keydown", onPyKeyDown);
    inputEl?.removeEventListener("input", onPyInput);

}





window.openNameSelect = function (params: any) {

    return new Promise((resolve, reject) => {


        callback.resolve = resolve;
        callback.reject = reject;

        params.isOne = !!params.isOne;
        params.selectList = params.selectList || []; 

        params.showCount = params.showCount != undefined ?  params.showCount : false;

        if(!params.userList){
            params.userList = Props.userList || [];
        }


        Object.assign(popParams, params);

        popParams.search = "";
        popParams.pyValue = "";
        popParams.defaultSelect = [...popParams.selectList];

        userFilter();

        popValue = true;


    })

}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

.dialog-search{
    
    max-height: 90%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .el-dialog__body{
        overflow: auto;
        flex: 1;
    }

    &.is-one {


        .el-checkbox-group{
                
            display: flex;
            flex-wrap: wrap;
        }
        .el-checkbox{
            display: flex;
            justify-content: center;
        }

        .el-checkbox__inner {
            display: none !important;

        }


    }

}

</style>

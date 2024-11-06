<template>
    <div class="user-checkbox">
        <el-form-item :label="actorTitle" prop="actor" class="label-top">

            <div class="mb-5px w-full">
                <el-input v-model="data.actorPy" size="default" placeholder="用户搜索" clearable @clear="onActorClear"></el-input>
            </div>
            <div>
                
                <div class="mt-50px" v-show="data.pyValue"></div>
                <div v-if="!data.pyValue">
                    <div>热度：</div>
                    <el-checkbox-group v-model="data.hot" size="small" @change="onHotChange">
                        <el-checkbox v-for="item in hotList" :key="item.name" :label="item.name" :value="item.name"
                            :border="true" size="default" />
                    </el-checkbox-group>
                </div>

                <div v-if="!data.pyValue">
                    <div>拼音：</div>
                    <el-checkbox-group v-model="data.actor" size="small" @change="onActorChange">
                        <el-checkbox v-for="item in actorList" :key="item.name" :label="item.name" :value="item.name"
                            :border="true" size="default" />
                    </el-checkbox-group>
                </div>

                <div v-if="data.pyValue">
                    <el-checkbox-group v-model="data.actor" size="small" @change="onActorChange">
                        <el-checkbox v-for="item in allList" :key="item.name" :label="item.name" :value="item.name"
                            :border="true" size="default" />
                    </el-checkbox-group>
                    
                </div>
            </div>

        </el-form-item>
        <el-form-item :label="notuserTitle" class="label-top" v-if="showNotUser">

            <el-button v-if="!isAddNotUser" @click="onClickAddNotUser">添加人员</el-button>
            <template v-else>
                <template v-if="notuserList.length">
                    <div class="mb-5px w-full no-input" >
                        <el-input v-model="data.notuserPy" size="default" placeholder="用户搜索" clearable @clear="onNoActorClear"></el-input>
                    </div>
                    <el-checkbox-group v-model="data.notuser" size="small" @change="onNotUserChange">
                        <el-checkbox v-for="item in notuserList" :key="item.name" :label="item.name" :value="item.name"
                            :border="true" size="default" />
                    </el-checkbox-group>
                </template>

                <el-tag type="danger" v-else>暂无人员可选</el-tag>
            </template>
        </el-form-item>
        <slot>
        </slot>

    </div>
</template>

<script setup lang="ts">

import { pySearch } from "@/utils/other"



const Emit = defineEmits<{
    (e: 'change', actor: string[], notuser: string[]): void;
    (e: 'enter'): void;
}>();

const Props = withDefaults(defineProps<{
    /** 最高热度人员 */
    hot: userItem[],

    /** 参与人员 */
    actor: string[],

    /** 有空可参与 */
    notuser: string[],

    actorArr: userItem[],

    notuserArr: userItem[],

    /** 显示的标题 */
    title?: string,
    /** 是否显示有空参加 */
    showNotUser?: boolean,
    /** 是否只允许选中一个 */
    isOneUser?: boolean

}>(), {
    title: "参与人员",
    showNotUser: true
})



const actorTitle = computed(() => {

    const retVal = [Props.title];

    if(Props.actor.length){
        retVal.push(`(${Props.actor.length})`)
    }
    return retVal.join("");
})

const notuserTitle = computed(() => {

    const retVal = ['有空可参与'];

    if(Props.notuser.length){
        retVal.push(`(${Props.notuser.length})`)
    }
    return retVal.join("");
})



let isAddNotUser = $ref(false);
let inputEl: HTMLInputElement;
let timtEmitClear = false;


let noInputEl: HTMLInputElement;
let noTimtEmitClear = false;

const data = $ref({
    actor: Props.actor,
    notuser: Props.notuser,


    /** 当前的热点人员勾选列表 */
    hot: [] as string[],
    /** 上一次的热点人员勾选列表 */
    lastHot: [] as string[],





    actorPy: "",
    notuserPy: "",


    pyValue: "",
    noPyValue: "",


});


const actorList = $computed(() => {

    const retList = Props.actorArr.filter((elem) => !data.notuser.includes(elem.name))

    return pySearch(retList, data.pyValue);

});

const notuserList = $computed(() => {

    const retList = Props.actorArr.filter((elem) => !data.actor.includes(elem.name))

    return pySearch(retList, data.noPyValue)

});

const hotList = $computed(() => {

    return Props.hot.filter((elem) => !data.notuser.includes(elem.name))

});


const allList = $computed(() => {

    return pySearch([...actorList, ...hotList], data.pyValue)

})


function onClickAddNotUser() {
    isAddNotUser = true;
    setTimeout(() => {

        
        noInputEl = document.querySelector<HTMLInputElement>(".user-checkbox .no-input .el-input__inner")!;

        noInputEl.focus();

        noInputEl?.addEventListener("input", onNoPyInput);
        noInputEl?.addEventListener("keydown", onNoPyKeyDown);

    });
}



function getValue(value: string[]) {

    if (Props.isOneUser && value.length > 1) {

        value = [value.pop()!];
    }


    return value;

}

function emitChange() {
    Emit("change", data.actor, data.notuser);
}


function onHotChange(value: string[]) {

    const { actor } = data;


    value = getValue(value);

    value.forEach((elem) => {

        if (!actor.includes(elem)) {
            actor.push(elem)
        }

    });

    if (data.lastHot.length > 0) {

        const diffUser = [] as string[];

        data.lastHot.forEach((elem) => {

            if (!value.includes(elem)) {

                diffUser.push(elem);

            }

        })

        diffUser.forEach((elem) => {

            const index = actor.indexOf(elem);

            if (index > -1) {
                actor.splice(index, 1);
            }

        });

        const tempUser = [...actor];


        actor.length = 0;
        actor.push(...tempUser);


    }

    data.lastHot.length = 0;
    data.lastHot.push(...value);

    // 如果 data.actor 没有被修改的话，那么这里就不要重新赋值为0
    if(Props.actor !== actor){
        
        Props.actor.length = 0;
        Props.actor.push(...actor);

    }



    if (Props.isOneUser && value.length) {
        data.hot = value;
        data.actor = value;

    }




    emitChange();

}

function onActorChange(value: string[]) {

    const { hot, lastHot } = data;

    value = getValue(value);

    hot.length = 0;
    lastHot.length = 0;

    value.forEach((elem) => {

        if (Props.hot.find((item) => item.name == elem)) {
            hot.push(elem)
            lastHot.push(elem)
        }

    })

    Props.actor.length = 0;
    Props.actor.push(...value);

    if (Props.isOneUser && value.length) {
        data.actor = value;
        data.hot = value;

    }
    emitChange();


}

function onNotUserChange(value: string[]) {

    value = getValue(value);

    Props.notuser.length = 0;
    Props.notuser.push(...value);
    emitChange();

}

/** 参与人员清空 */
function onActorClear(){

    data.pyValue = "";
    data.actorPy = "";

    timtEmitClear = false;

}

/** 非必参与人员清空 */
function onNoActorClear(){

    
    data.noPyValue = "";
    data.notuserPy = "";

    noTimtEmitClear = false;


}


/** 参与人员输入框输入 */
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
            onActorClear();
        })
        return;
    }

    data.pyValue = value;

}

/** 参与人员输入框按下 */
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

    if(allList.length == 1){

        
        const { name } = allList[0];

        let isEmitEnter = false;

        if(!data.actor.includes(name)){
            onActorChange([...data.actor, name]);
            isEmitEnter = true;
        }


        setTimeout(() => {
            timtEmitClear = true;
            onActorClear();
        });

        if(isEmitEnter){
            Emit("enter");
        }

    }


    

}




/** 非参与人员输入框输入 */
function onNoPyInput(event: Event) {

    const { value }  = noInputEl;

    /** 
     *
     * 这里因为在回车按下的时候，有时候还是会触发到这个输入事件
     * 所以需要做个拦截，在回车定时器里设置 timtEmitClear = true
     * 然后再输入事件判断，如果为true的话不再进行赋值，而且需要把他们的值给删除掉
     * 
     */
    if(noTimtEmitClear){
        noTimtEmitClear = false;
        setTimeout(()=>{
            onActorClear();
        })
        return;
    }

    data.noPyValue = value;

}


/** 非参与人员输入框按下 */
function onNoPyKeyDown(event: KeyboardEvent){


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

    if(notuserList.length == 1){

        
        const { name } = notuserList[0];

        onNotUserChange([...data.notuser, name]);

        setTimeout(() => {
            noTimtEmitClear = true;
            onNoActorClear();
        })




    }

}








onMounted(() => {

    const { actor } = Props;

    Props.hot.forEach((elem) => {

        if (actor.includes(elem.name)) {

            data.hot.push(elem.name);

        }

    })

    onHotChange(data.hot);


    setTimeout(() => {
        inputEl = document.querySelector<HTMLInputElement>(".user-checkbox .el-input__inner")!;

            
        inputEl?.addEventListener("input", onPyInput);
        inputEl?.addEventListener("keydown", onPyKeyDown);

        inputEl?.focus();
    })


})


onUnmounted(() => {

    
    inputEl?.removeEventListener("keydown", onPyKeyDown);
    inputEl?.removeEventListener("input", onPyInput);

})


defineExpose({

    setData(actor:string[], notuser:string[]) {

        data.actor = [...actor];
        data.notuser = [...actor];




    }

});


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
div.user-checkbox {
    .el-checkbox {
        margin-right: 10px;
        margin-bottom: 5px;
        min-width: 90px;
    }
}
</style>

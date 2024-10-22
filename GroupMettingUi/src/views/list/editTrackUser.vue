<template>
    <popDialog 
        v-model="showDialog.trackUser" 
        title="修改执行者" 
        custom-class="track-user_dialog" 
        @confirm="onConfirm"
        @closeed="onPopClose"
        :disabledConfirmButton="confirmDisabled"
        :destroyOnClose="true">

        <actor-user-el 
            :actor="userList.actor" 
            :notuser="userList.notuser" 

            :hot="userList.hot"
            :actorArr="userList.actorArr" 
            :notuserArr="userList.notuserArr"
            :showNotUser="false"
            :isOneUser="true"
            :title="'全部人员'"
            @change="onUserChange"
            @enter="onClickEnter">
        </actor-user-el>
        
        <el-form-item label="留言" class="label-top">
            <el-input v-model="memo" size="default" type="textarea"></el-input>
        </el-form-item>

    </popDialog>
</template>

<script setup lang="ts">
import popDialog from "global@/popDialog/index.vue"

import { showDialog } from "./data"

import to from "await-to-js"
import { getEditorUserList, editTrackUser } from "@/api"
import actorUserEl from "@/components/actorUser.vue"


const Props = defineProps<{ 
    refresh: any
}>();


const actorUser = $ref<string[]>([]);

const userArr = $ref<userItem[]>([]);

let itemId = 0;
let selectUser = $ref("");

let memo = $ref("");

const confirmDisabled = $computed(() => {


    let retBool = true;
    if((!!selectUser && selectUser != showDialog.item.track_user)){
        retBool = false;
    }else{

        retBool = !memo;

    }
    
    return retBool


})


const userList = $ref({
    actor: [] as string[],
    notuser: [] as string[],


    hot: [] as userItem[],
    actorArr: [] as userItem[],
    notuserArr: [] as userItem[],

})




async function refreshUser() {

    const [error, data] = await to(getEditorUserList(itemId));
    if (error) {
        return
    }


    userList.hot = data.hot;
    userList.actorArr = data.user;




}

function onClickUser(item: string) {

    selectUser = item;

}


function onClickEnter(){

    onConfirm();


}

function onUserChange(actor:string[], notuser:string[]){

    selectUser = actor[0] || "" 

}


async function onConfirm() {



    await to(editTrackUser(itemId, selectUser, memo));


    showDialog.trackUser = false;


    Props.refresh();

}

function onPopClose(){
    memo = "";
    selectUser = "";
}



watch(() => showDialog.trackUser, (value) => {
    
    if (!value) {
        return;
    }


    userList.actor.length = 0;
    userList.actor.push(showDialog.item.track_user);


    actorUser.length = 0;
    actorUser.push(...showDialog.item.actor_user);

    userArr.length = 0;
    itemId = showDialog.item.id;
    refreshUser();

})





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.track-user_dialog {
    button {
        margin-left: 0;
        margin-right: 5px;
        margin-bottom: 5px;
    }

    .el-button+.el-button {
        margin-left: 0;

    }

    .el-dialog__body {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .el-form-item {
        margin-bottom: 0;
        ;
    }
}
</style>

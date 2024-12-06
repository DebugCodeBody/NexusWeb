<template>
      <popDialog title="编辑会议" 
      v-model="popValue" 
      class="edito-user_Dialog" 
      :destroyOnClose="true"
        :disabledConfirmButton="!actor.length" 
        @confirm="onConfirmEditUset" 
        @opened="onOpenEd"
        @closeed="onCloseEd" 
        v-if="renderValue">

        <el-form-item label="确认会议">
            <el-checkbox v-model="selectItem.is_mark" />
        </el-form-item>

        <el-form-item label="关注会议">
            <el-checkbox v-model="selectItem.follow" />
        </el-form-item>

        <el-form-item label="会议类型">
            <el-radio-group v-model="thisType">
                <el-radio v-for="(item, index) in typeArr" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="组织人员">
            <span class="mr-10px">{{ tissueName }}</span>
            <el-button @click="onClickTissueDialog" size="default">修改</el-button>
        </el-form-item>
        <el-form-item label="执行者">
            <span class="mr-10px" v-if="trackName">{{ trackName }}</span>
            <el-button @click="onClickTrackDialog" size="default">修改</el-button>
            <el-button @click="onClickClearTrack" size="default" type="info" v-if="trackName">清除</el-button>
        </el-form-item>


        <el-form-item label="留言" class="label-top" v-if="!item.create_group">
            <el-input v-model="memo" size="default" type="textarea"></el-input>
        </el-form-item>

        <actor-user :actor="actor" :notuser="notuser" :hot="hotArr" :actorArr="actorArr" :notuserArr="notUserList">
        </actor-user>

    </popDialog>
</template>

<script setup lang="ts">

let renderValue = $ref(false);

let popValue = $ref(false);


let selectItem = $ref<mettItem>({

} as mettItem)


window.onEditView = function() {

    popValue = true;
    renderValue = true;



}





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>

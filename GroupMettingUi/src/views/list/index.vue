<template>
    <div id="list" class="wh-full">
        <div class="declare-view">

            <div class="relative flex-1">
                <div class="wh-full overflow-hidden flex flex-col" ref="tabEl">
                    <div class="w-full mb-10px flex ">
                        <div class="mr-5px show-all w-70px ">
                            <div class="flex flex-wrap h-full">
                                <div>
                                    <el-button class="show-this" @click="onClickShowThis">只显示自己的</el-button>
                                </div>
                                <div>
                                    <el-button class="show-this" @click="onClickShowHectic" v-if="false">显示繁忙清单</el-button>
                                </div>
                            </div>
                        </div>

                        <div class="flex-1 filter-content">
                            <div class="w-full conditions">
                                <div class="flex flex-1 ">

                                    <div class="ml-5px" v-if="isCommView">
                                        <name-select v-model="dialogSearch.commList" title="搜索沟通人"
                                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="沟通人"
                                            @confirm="onSearchConfirm" @open="onFilterSearch" />
                                    </div>

                                    <div class="ml-5px" v-else>
                                        <name-select v-model="dialogSearch.trackList" title="搜索执行人"
                                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="执行人"
                                            @confirm="onSearchConfirm" @open="onOpenTrackUser" />
                                    </div>

                                    <div class="ml-5px">
                                        <name-select v-model="dialogSearch.createList" title="搜索创建人"
                                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="创建人"
                                            @confirm="onSearchConfirm" @open="onOpenCreate" />
                                    </div>
                                    <div class="ml-5px">
                                        <name-select v-model="dialogSearch.filterList" title="搜索排除参与"
                                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="排除参与"
                                            @confirm="onSearchConfirm" @open="onOpenSearch" />
                                    </div>
                                    <div class="ml-5px">
                                        <name-select v-model="dialogSearch.searchList" title="搜索参与人"
                                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="参与人"
                                            @confirm="onSearchConfirm" @open="onOpenSearch" />
                                    </div>
                                    <div class="ml-5px" v-if="false">
                                        <name-select v-model="dialogSearch.syncList" title="同步过滤人员"
                                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="同步过滤人员"
                                            @confirm="onSyncFilteConfirm" @open="onFilterSearch" />
                                    </div>
                                    <div class="ml-5px">
                                        <name-select v-model="dialogSearch.result" title="过滤结果"
                                            :user-list="dialogSearch.userList" :disabled="loading" :showCount="false"
                                            placeholder="过滤结果" @confirm="onSearchConfirm" @open="onOpenResult"
                                            v-if="isHandleView" />
                                    </div>
                                    <div class="ml-5px">
                                        <name-select v-model="dialogSearch.handleType" title="过滤类型"
                                            :user-list="dialogSearch.userList" :disabled="loading" :showCount="false"
                                            placeholder="过滤类型" @confirm="onSearchConfirm" @open="onOpenType"
                                            v-if="isHandleView" />
                                    </div>
                                    <div class="ml-5px flex flex-1">
                                        <el-input v-model="dialogSearch.value" placeholder="内容搜索" clearable
                                            :disabled="loading" @keydown.enter="onSearchValue"></el-input>
                                        <el-button class="ml-5px" :disabled="!dialogSearch.value || loading"
                                            @click="onSearchValue">搜索</el-button>

                                    </div>
                                    <el-button class="ml-5px" :disabled="clearSearchDisabled"
                                        @click="onClickClearSearch">清除</el-button>
                                </div>
                            </div>
                            <div class="w-full mt-10px">
                                <div class="flex flex-1">
                                    <el-checkbox v-model="dialogSearch.isFollow" label="只显示关注" value="只显示关注"
                                        @change="refresh" v-if="false && !isNowProView" />

                                    <el-checkbox v-model="dialogSearch.isTenDay" label="只显示十天前" value="只显示十天前"
                                        @change="refresh" v-if="isHandleView" />
                                        
                                    <el-checkbox v-model="dialogSearch.recentNoneHandle" label="三天内未处理" value="三天内未处理" @change="refresh"
                                        v-if="isHandleView" />

                                    <el-checkbox v-model="dialogSearch.isGroup" label="显示有会议群" value="显示有会议群"
                                        @change="refresh" v-if="isHandleView || isToStartView" />

                                    <el-checkbox v-model="dialogSearch.isNoGroup" label="显示无会议群" value="显示无会议群"
                                        @change="refresh" v-if="isHandleView || isToStartView" />

                                    <!-- <el-checkbox v-model="dialogSearch.filterLong" label="过滤二人会议" value="过滤二人会议"
                                        @change="refresh" v-if="isVerifyView" /> -->

                                    <el-checkbox v-model="dialogSearch.isLeave" label="过滤请假人员" value="过滤请假人员"
                                        @change="refresh" v-if="false && (isVerifyView || isPrepareStartView)" />

                                    <el-checkbox v-model="dialogSearch.isOutNextTime" label="只显示超出响应时间"
                                        value="只显示超出响应时间" @change="refresh" v-if="isNowProView" />

                                    <el-checkbox v-model="dialogSearch.isHectic" label="只显示非繁忙人员" value="只显示非繁忙人员"
                                        @change="refresh" v-if="false && (isVerifyView || isHandleView) "  />

                                    <el-checkbox v-model="dialogSearch.showIgnore" label="显示忽略会议" value="显示忽略会议" @change="refresh"/>
                                </div>
                            </div>
                            <div class="mobile">
                                
                                <el-button class="ml-5px"  @click="onClickOpenDrawer">展开搜索</el-button>
                                
                                <el-button class="ml-5px" :disabled="clearSearchDisabled" @click="onClickClearSearch">清除</el-button>

                            </div>

                        </div>
                        <div>
                            <el-button class="ml-5px add-view" type="primary" @click="onClickAddView">新增会议</el-button>
                        </div>

                    </div>
                    <el-tabs v-model="activeName" type="border-card" @tab-change="onTabChange">

                        <el-tab-pane v-for="item in tagList" :label="item.label" :key="item.id" :name="item.id">
                            <template #label>
                                <span>
                                    <span>{{ item.label }}</span>
                                    <span class="view-number ml-5px" v-if="nowActive == item.id">{{ totalLengt
                                        }}</span>
                                </span>
                            </template>
                        </el-tab-pane>

                        <div class="prepare-content relative" v-loading="loading" element-loading-text="正在操作中"
                            element-loading-background="rgba(0, 0, 0, 0.7)" v-if="nowActive != settingId">
                            <collapse-list :data="list" >

                                <template #item="{ item }">
                                    <meet-item :item="item" :type="nowActive" :refresh="refresh" :cancel="cancelUser"
                                        :optimize="optimizeUser" :hectic="hectic" :countMap="exportData.nameCountMap" @click-track-user="onClickTrackUser">
                                    </meet-item>
                                </template>
                            </collapse-list>
                        </div>
                        <admin v-else />

                    </el-tabs>
                </div>
            </div>

        </div>

        <popDialog title="提示" v-model="dialogVisible" :center="true" @confirm="onClickStart()">

            <div class="text-center">
                <div v-if="selectItem.is_resource && getIsReEnd(selectItem.rtime)">
                    <el-button type="danger" size="small">当前预约会议还未到时间</el-button>
                </div>
                <div>
                    确定开始此会议？
                </div>
            </div>

        </popDialog>

        <edit-track-user :refresh="refresh" />
        <endPopup :refresh="refresh" />
        <viewLink :refresh="refresh" />
        <pop-edit-track :refresh="refresh" />
        <py-select-name :userList="exportData.userData" />
        <pop-editr-tag :refresh="refresh" />
        <pop-set-next-time :refresh="refresh" />
        <pop-hectic-list :refresh="refresh" ref="hecticListEl" />
        <!-- <pop-edit-view :refresh="refresh"> -->


        <el-drawer v-model="drawer" title="过滤条件" direction="rtl" > 

            <div class="flex-1 filter-content">
                <div class="w-full conditions">
                    <div class="ml-5px" v-if="isCommView">
                        <name-select v-model="dialogSearch.commList" title="搜索沟通人"
                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="沟通人"
                            @confirm="onSearchConfirm" @open="onFilterSearch" />
                    </div>

                    <div class="ml-5px" v-else>
                        <name-select v-model="dialogSearch.trackList" title="搜索执行人"
                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="执行人"
                            @confirm="onSearchConfirm" @open="onOpenTrackUser" />
                    </div>

                    <div class="ml-5px">
                        <name-select v-model="dialogSearch.createList" title="搜索创建人"
                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="创建人"
                            @confirm="onSearchConfirm" @open="onOpenCreate" />
                    </div>
                    <div class="ml-5px">
                        <name-select v-model="dialogSearch.filterList" title="搜索排除参与"
                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="排除参与"
                            @confirm="onSearchConfirm" @open="onOpenSearch" />
                    </div>
                    <div class="ml-5px">
                        <name-select v-model="dialogSearch.searchList" title="搜索参与人"
                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="参与人"
                            @confirm="onSearchConfirm" @open="onOpenSearch" />
                    </div>
                    <div class="ml-5px" v-if="false">
                        <name-select v-model="dialogSearch.syncList" title="同步过滤人员"
                            :user-list="dialogSearch.userList" :disabled="loading" placeholder="同步过滤人员"
                            @confirm="onSyncFilteConfirm" @open="onFilterSearch" />
                    </div>
                    <div class="ml-5px">
                        <name-select v-model="dialogSearch.result" title="过滤结果" :user-list="dialogSearch.userList"
                            :disabled="loading" :showCount="false" placeholder="过滤结果" @confirm="onSearchConfirm"
                            @open="onOpenResult" v-if="isHandleView" />
                    </div>
                    <div class="ml-5px">
                        <name-select v-model="dialogSearch.handleType" title="过滤类型"
                            :user-list="dialogSearch.userList" :disabled="loading" :showCount="false"
                            placeholder="过滤类型" @confirm="onSearchConfirm" @open="onOpenType"
                            v-if="isHandleView" />
                    </div>
                    <div class="ml-5px flex flex-1">
                        <el-input v-model="dialogSearch.value" placeholder="内容搜索" clearable :disabled="loading"
                            @keydown.enter="onSearchValue"></el-input>

                    </div>
                    <div class="buttun-div">
                        <el-button class="ml-5px" :disabled="!dialogSearch.value || loading"
                                @click="onSearchValue">搜索</el-button>
                        <el-button class="ml-5px" :disabled="clearSearchDisabled"
                            @click="onClickClearSearch">清除</el-button>
                    </div>
                </div>

                <div class="w-full mt-10px">
                    <div class="">
                        <el-checkbox v-model="dialogSearch.isFollow" label="只显示关注" value="只显示关注" @change="refresh"
                            v-if=" false && !isNowProView" />
                            
                        <el-checkbox v-model="dialogSearch.isTenDay" label="只显示十天前" value="只显示十天前" @change="refresh"
                            v-if="isHandleView" />

                        <el-checkbox v-model="dialogSearch.recentNoneHandle" label="三天内未处理" value="三天内未处理" @change="refresh"
                            v-if="isHandleView" />

                        <el-checkbox v-model="dialogSearch.isGroup" label="显示有会议群" value="显示有会议群" @change="refresh"
                            v-if="isHandleView || isToStartView" />

                        <el-checkbox v-model="dialogSearch.isNoGroup" label="显示无会议群" value="显示无会议群" @change="refresh"
                            v-if="isHandleView || isToStartView" />

                        <!-- <el-checkbox v-model="dialogSearch.filterLong" label="过滤二人会议" value="过滤二人会议"
                                        @change="refresh" v-if="isVerifyView" /> -->

                        <el-checkbox v-model="dialogSearch.isLeave" label="过滤请假人员" value="过滤请假人员" @change="refresh"
                            v-if="false && (isVerifyView || isPrepareStartView) " />

                        <el-checkbox v-model="dialogSearch.isOutNextTime" label="只显示超时或未处理" value="只显示超出执行时间"
                            @change="refresh" v-if="isNowProView" />

                        <el-checkbox v-model="dialogSearch.isHectic" label="只显示非繁忙人员" value="只显示非繁忙人员" @change="refresh"
                            v-if="false && (isVerifyView || isHandleView)" />
                        <el-checkbox v-model="dialogSearch.showIgnore" label="显示忽略会议" value="显示忽略会议" @change="refresh"/>
                    </div>
                </div>

            </div>

            <template #footer>
                <div style="flex: auto">
                    <el-button @click="onClickCloseDrawer">关闭</el-button>
                </div>
            </template>
        </el-drawer>

    </div>
</template>

<script setup lang="ts">

import collapseList from "@/components/collapseList.vue"
import meetItem from "@/components/meetItem.vue"
import admin from "../admin/index.vue"
import nameSelect from "@/components/nameSelect.vue";
import endPopup from "@/components/endPopup/index.vue";
import viewLink from "@/components/viewLink.vue"
import popEditTrack from "@/components/popEditTrack.vue"
import popEditrTag from "@/components/popEditrTag.vue"
import pySelectName from "@/components/pySelectName.vue"
import popSetNextTime from "@/components/popSetNextTime.vue"
import popHecticList from "@/components/popHecticList/index.vue"

// import popEditView  from "@/components/popEditView.vue"



import { isDing } from "@/utils/auth"




import to from "await-to-js"

import getSearch, { getCorpId } from "@/utils/urlSearch"
import { MessageBoxWarning } from "@/utils/elementLib"
import { getList, getStart, getEnd, startMeeting, getApt, getMark, isSettingAdmin, getAllActorUser, getProdu, getFollow, getScene, editMark, getSuggest, diySearch, holidayGet, holidaySet, getAbout, getView, getLately } from "@/api"

import popDialog from "global@/popDialog/index.vue"
import editTrackUser from "./editTrackUser.vue"

import dayjs from "dayjs"


import HammerInit from "@/views/Hammer"
import { getAll, setAll, showDialog } from "./data"

import { getUserName } from "@/store/user"

import exportData from "@/store/data"


let cancelUser = $ref(false);
let optimizeUser = $ref(false);


let drawer = $ref(false);




const tabEl = $ref<HTMLElement>();
const hecticListEl = $ref<any>();


const list = $ref<mettItems>([]);
const hectic = $ref<string[]>([]);
let totalLengt = $ref(0)


let activeName = $ref(0);
let nowActive = $ref(0);
let loading = $ref(false);
let dialogVisible = $ref(false);
let selectItem = $ref<mettItem>();
let settingId = $ref<number>();

let thisName = $ref(getUserName());

let viewChange = false;
let viewId = $ref(getSearch("id"));

let all = $ref(true);

let userInfo = [] as any[];

const whereIdTable = {



} as any;




let dialogSearch = $ref({


    value: "",

    dataList: [] as userItem[],


    userList: [] as userItem[],

    /** 参与人列表 */
    actorList: [] as userItem[],


    /** 搜索列表 */
    searchList: [] as string[],

    /** 过滤列表 */
    filterList: [] as string[],

    /** 创建列表 */
    createList: [] as string[],

    /** 执行者列表 */
    trackList: [] as string[],

    /** 沟通人员列表 */
    commList: [] as string[],

    /** 同步人员列表 */
    syncList: [] as string[],

    /** 结案结果 */
    result: [] as string[],

    /** 过滤类型 */
    handleType: [] as string[],

    /** 是否使用同步状态 */
    isSync: false,


    /** 只显示关注的 */
    isFollow: false,


    /** 只显示十天前 */
    isTenDay: false,

    /** 过滤掉两人会议 */
    filterLong: true,

    /** 显示没有创建讨论群的 */
    isNoGroup: true,

    /** 显示有创建讨论群的 */
    isGroup: true,

    /** 只显示超出时间的 */
    isOutNextTime: false,

    /** 过滤请假人员 */
    isLeave: false,

    /** 只显示非繁忙人员 */
    isHectic: false,

    /** 显示忽略会议 */
    showIgnore: false,

    /** 三天内未处理 */
    recentNoneHandle: false


});




const clearSearchDisabled = $computed(() => {

    const namelist = [];

    namelist.push(...dialogSearch.searchList);
    namelist.push(...dialogSearch.filterList);
    namelist.push(...dialogSearch.createList);
    namelist.push(...dialogSearch.trackList);
    namelist.push(...dialogSearch.commList);
    namelist.push(...dialogSearch.result);


    return loading || (!namelist.length && !dialogSearch.value)
})


/** 是否待开类 */
const isToStartView = $computed(() => {

    return nowActive == 0;

})

/** 是否现场类 */
const isCommView = $computed(() => {

    return nowActive == 7;

})

/** 是否待处理 */
const isHandleView = $computed(() => {
    return nowActive == 6;
})


/** 是否已确认 */
const isVerifyView = $computed(() => {
    return nowActive == 4;
})

/** 是否待约 */
const isPrepareStartView = $computed(() => {
    return nowActive == 10;
})

/** 是否在场类 */
const isNowProView = $computed(() => {
    return nowActive == 5;
})




const tagList = $ref([
    {
        id: 0,
        label: "待开",
        event: getList

    },
    {
        id: 6,
        label: "待处理",
        event: getFollow
    },
    {
        id: 5,
        label: "在产类",
        event: getProdu
    },
    // {
    //     id: 7,
    //     label: "现场类",
    //     event: getScene
    // },

    // {
    //     id: 8,
    //     label: "建议类",
    //     event: getSuggest
    // },

    {
        id: 4,
        label: "已确认",
        event: getMark
    },

    // {
    //     id: 10,
    //     label: "待约",
    //     event: getAbout
    // },

    {
        id: 1,
        label: "已开",
        event: getStart

    },
    {
        id: 102,
        label: "最近操作",
        event: getLately
    },
    {
        id: 2,
        label: "结案",
        event: getEnd
    },
    {
        id: 101,
        label: "搜索"
    },

    // {
    //     id: 103,
    //     label: "OKR"
    // }


])


function getIsReEnd(time: string) {


    const reTime = dayjs(time).startOf("days")
    const nowTime = dayjs().startOf("days");

    return reTime.diff(nowTime, "days") > 0

}

/** 打开默认浏览器，然后新增 */
function onClickAddView() {

    let openUrl = `${location.origin}/ding/coolapp/meeting/index.html`
    const isDingtalk = navigator.userAgent.indexOf("dingtalk") > -1;

    if (isDingtalk) {

        openUrl = `${location.origin}/ding/coolapp/meeting/share/0?url=${encodeURIComponent(openUrl)}`;

    }

    window.open(openUrl)

}


async function onClickStart(item?: mettItem) {

    if (item) {
        dialogVisible = true;
        selectItem = item;

        return;
    }



    item = selectItem
    dialogVisible = false;
    loading = true;
    const [err] = await to(startMeeting(item.id));

    if (err) {
        return;
    }

    loading = false;

    getData(nowActive);

}

async function getData(value: number) {

    if (loading) {
        return;
    }


    const tag = tagList.find((elem) => elem.id == value)!;
    if (!tag.event) {
        nowActive = value;
        return;
    }

    loading = true;

    const tempObj = {
        all,
        search: dialogSearch.searchList,
        filter: dialogSearch.filterList,
        track: dialogSearch.trackList,
        comm: dialogSearch.commList,
        create: dialogSearch.createList,
        value: dialogSearch.value,
        result: dialogSearch.result,
        isSync: !dialogSearch.isSync,

        isFollow: dialogSearch.isFollow,
        
        isTenDay: dialogSearch.isTenDay,

        filterLong: dialogSearch.filterLong,

        noGroup: dialogSearch.isNoGroup,

        haveGroup: dialogSearch.isGroup,

        outTime: dialogSearch.isOutNextTime,

        isLeave: dialogSearch.isLeave,

        isHectic: dialogSearch.isHectic,

        showIgnore: dialogSearch.showIgnore,
        
        recentNoneHandle: dialogSearch.recentNoneHandle, 

        handleType: dialogSearch.handleType, 

    };


    whereIdTable[value] = JSON.parse(JSON.stringify(tempObj));

    const sendData = whereIdTable[value];





    const [err, result] = await to(tag.event(sendData));
    if (err) {
        loading = false

        return;
    }


    list.length = 0;
    hectic.length = 0;
    dialogSearch.syncList.length = 0;



    list.push(...result.data);
    hectic.push(...result.hectic);

    dialogSearch.syncList.push(...result.filter);
    

    totalLengt = (result as any).total;
    userInfo = (result as any).userInfo;

    exportData.statistic(result.data);

    


    nowActive = value;

    loading = false

}


/** 搜索内容 */
function onSearchValue() {

    if (!dialogSearch.value) {
        return;
    }

    refresh();

}

/** 清除全部搜索条件 */
function clearSearchWhere() {

    dialogSearch.filterList.length = 0;
    dialogSearch.searchList.length = 0;
    dialogSearch.trackList.length = 0;
    dialogSearch.createList.length = 0;
    dialogSearch.commList.length = 0;
    dialogSearch.result.length = 0;


    dialogSearch.value = "";
    all = true;


}


function onClickClearSearch() {

    clearSearchWhere();
    refresh();
}


/** 点击只显示自己的按钮 */
function onClickShowThis() {

    clearSearchWhere();

    if (nowActive == 6) {
        dialogSearch.trackList.push(thisName);
    } else {
        dialogSearch.searchList.push(thisName);
    }



    all = false;

    refresh();



}

function onClickShowHectic() {

    hecticListEl.open();

}




function onChangeShowHandle(value: boolean) {

    if (!value) {
        clearSearchWhere();
    }

    setAll(nowActive, value);
    refresh();
}

function onClickTrackUser(item: mettItem) {


    showDialog.item = item;
    showDialog.trackUser = true;

}



function onSearchConfirm() {
    onClickCloseDrawer();
    refresh();
}

function toSearchView(toPath: string) {

    const newUrl = location.href.replace("path=list", `path=${toPath}`);

    if (isDing()) {
        location.href = newUrl;
    } else {
        window.open(newUrl);
    }



}

async function onTabChange(value: number) {


    if (viewChange) {
        viewChange = false
        return;
    }

    viewId = "";

    const toPath = ({

        "101": "search",
        "103": "okrsearch"

    } as any)[value];


    /** 搜索页签的不话 */
    if (toPath) {

        toSearchView(toPath);

        nextTick(() => {
            activeName = nowActive;
        })
        return;
    }



    const tempObj =  {
        all: false,
        search: [],
        filter: [],
        track: [],
        comm: [],
        create: [],
        value: "",
        isSync: true,
        isFollow: false,
        isTenDay: false,


        filterLong: false,

        noGroup: true,

        haveGroup: true,

        /** 如果是在现场类的话，只显示超时或未处理是默认勾上的 */
        outTime: value === 5,

        // 暂时先把这两个隐藏起来，所以需要先设置为false
        // 2024-12-05
        // isLeave: (value === 4 || value === 10),
        // isHectic: (value === 4)

        isLeave: false,
        isHectic: false,

        showIgnore: false,

        /** 近期没有任何处理的，在带处理中默认为真 */
        recentNoneHandle: false,

        handleType: [] 

        
    };

    if(value == 6 && !whereIdTable[value]){
        tempObj.track.push(thisName as never)

    }

    Object.assign(tempObj, (whereIdTable[value] || {}));



    dialogSearch.searchList.length = 0;
    dialogSearch.searchList.push(...tempObj.search);

    dialogSearch.filterList.length = 0;
    dialogSearch.filterList.push(...tempObj.filter);

    dialogSearch.trackList.length = 0;
    dialogSearch.trackList.push(...tempObj.track);



    dialogSearch.commList.length = 0;
    dialogSearch.commList.push(...tempObj.comm);

    dialogSearch.createList.length = 0;
    dialogSearch.createList.push(...tempObj.create);




    dialogSearch.value = tempObj.value;

    dialogSearch.isFollow = tempObj.isFollow;
    dialogSearch.isTenDay = tempObj.isTenDay;
    dialogSearch.filterLong = tempObj.filterLong;

    dialogSearch.isNoGroup = tempObj.noGroup;
    dialogSearch.isGroup = tempObj.haveGroup;

    dialogSearch.isOutNextTime = tempObj.outTime;
    dialogSearch.isLeave = tempObj.isLeave;


    dialogSearch.isHectic = tempObj.isHectic;

    dialogSearch.recentNoneHandle = tempObj.recentNoneHandle;

    dialogSearch.handleType = tempObj.handleType;


    getData(value);


}


function onOpenSearchHandle(key: string) {


    const { filterList, userList, dataList, actorList } = dialogSearch;

    userList.length = 0;

    if (nowActive == 2) {

        userList.push(...dataList);

        return;
    }



    const tempList = [] as any[];

    userInfo.forEach((item) => {

        const count = item[key];
        if(count){

            tempList.push({
                name: item.name,
                py: item.py,
                count
            })

        }



    })


    userList.push(...tempList);


}


/** 打开参与人员搜索 */
function onOpenSearch() {

    onOpenSearchHandle("actor");

}

/** 打开创建人搜索 */
function onOpenCreate() {

    onOpenSearchHandle("create");

}

/** 打开执行人搜索 */
function onOpenTrackUser() {
    onOpenSearchHandle("track");
}

function onOpenResult() {

    const { filterList, userList, actorList } = dialogSearch;
    const dataList = exportData.userData;

    userList.length = 0;

    userList.push({
        name: "程序改善",
        py: "cxgs",
        count: 0
    });
    userList.push({
        name: "个案结案",
        py: "gaja",
        count: 0
    });

    userList.push({
        name: "培训",
        py: "px",
        count: 0
    });


}

/** 打开类型搜索 */
function onOpenType() {

    const { filterList, userList, actorList } = dialogSearch;
    const dataList = exportData.userData;

    userList.length = 0;

    userList.push({
        name: "防呆类",
        py: "fdl",
        count: 0
    });
    userList.push({
        name: "畅聊类",
        py: "cll",
        count: 0
    });

    userList.push({
        name: "在产类",
        py: "zcl",
        count: 0
    });


}



/** 打开过滤人员搜索 */
function onFilterSearch() {


    const { searchList, userList } = dialogSearch;
    const dataList = exportData.userData;

    userList.length = 0;

    dataList.forEach((elem) => {

        if (!searchList.includes(elem.name)) {
            userList.push(elem);
        }

    });


}


/** 同步过滤人员确定 */
async function onSyncFilteConfirm() {


    const [err] = await to(holidaySet(dialogSearch.syncList))

    refresh();

}

async function getIdView() {

    const { data, label } = await getView(viewId);


    nowActive = label;
    activeName = label;

    list.length = 0;

    list.push(...data);

    viewChange = true;

}

/** 关闭右边抽屉 */
function onClickCloseDrawer() {

    drawer = false;

}

function onClickOpenDrawer() {
    
    drawer = true;

}

function infiniteLoad() {


// v-infinite-scroll="infiniteLoad"

    console.log(123)




}




function refresh() {

    if (viewId) {
        getIdView();
    } else {
        getData(nowActive);
    }

}


async function init() {

    exportData.init();

    let label = parseInt(getSearch("label"));
    if(isNaN(label) === false){
        activeName = label;
    }


    let ismy = parseInt(getSearch("ismy"));
    if(ismy === 1){
       
        let setVal: any;
        if (activeName == 6) {

            setVal = {
                track:[thisName]
            }
            
        } else {
            setVal = {
                search:[thisName]
            }

        }

        whereIdTable[activeName] = setVal;
        
    }


    

    if (viewId) {
        getIdView();
    } else {
        onTabChange(activeName);
    }

}




init();

const watchUserData = watch(() => exportData.userData.length, () => {


    if(exportData.userData.length == 0){
        return;
    }

    dialogSearch.userList.length = 0;
    dialogSearch.userList.push(...exportData.userData);


    dialogSearch.dataList.length = 0;
    dialogSearch.dataList.push(...exportData.userData);

    watchUserData();




})


onMounted(async () => {

    const [err, data] = await to(isSettingAdmin());
    if (err) {
        return;
    }

    if (data && data.setting) {


        settingId = 9999;
        tagList.push({
            id: settingId,
            label: "设置"
        } as any);

    }

    cancelUser = data && data.cancel;
    optimizeUser = data && data.optimize;


    HammerInit();

})




</script>

<script lang="ts">
export default {
    name: "",
    title: "会议列表"
}
</script>

<style lang="scss">
.el-overlay.is-message-box .el-overlay-message-box {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-message-box {
        width: 80%;
        max-width: 650px;
    }
}

.el-overlay-dialog {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-dialog {
        width: 80%;
        max-width: 650px;
    }

}

#list {

    flex: 1;

    audio {
        width: 0;
        height: 0;
    }

    .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: #66b1ff;
    }

    .declare-view {
        position: relative;
        height: 100%;

        max-width: 1200px;
        margin: auto;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;


    }

    .el-result {
        max-width: 800px;
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        padding: 10px;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        background: white;


    }


    .el-input__inner[disabled] {

        color: #999 !important;
        -webkit-text-fill-color: #999 !important;
        opacity: 1 !important;

    }

    .declare_header.title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: white;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: rgb(102, 177, 255);
    }

    .el-tabs,
    .el-tabs__content,
    .prepare-content,
    .end-content,
    .all-content {
        width: 100%;
        height: 100%;
    }

    .el-tabs {
        display: flex;
        flex-direction: column;
    }

    .el-tabs--border-card>.el-tabs__content {
        padding: 0;
    }

    .prepare-content {
        .el-collapse {
            overflow: auto;
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .el-collapse-item__content {
            padding-bottom: 0;
        }

    }

    .view-number {
        width: 18px;
        height: 18px;
        background-color: #F3F3F3;
        border-radius: 50%;
        line-height: 18px;
        text-align: center;
        font-size: 12px;
        color: #409eff;
    }

    .show-all {

        z-index: 99;

        .el-checkbox__label {

            width: 40px;
            white-space: normal;

        }

    }

    .show-this {
        width: 65px;
        padding: 10px;
        white-space: inherit;
    }

    .add-view {
        width: 60px;
        padding: 10px;
        white-space: inherit;
    }

    .filter-content{

        .mobile{
            display: none;
        }

    }

}

.edito-user_Dialog {
    max-height: 80%;

    overflow: hidden;
    display: flex;
    flex-direction: column;

    .el-dialog__body {
        overflow: auto;
    }

    .el-form-item {
        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0;
        }
    }


}

.dialog-search {
    .el-input {
        margin-bottom: 10px;
    }

    .el-checkbox {
        min-width: 90px;
        margin-right: 10px;
        margin-bottom: 5px;
    }
}

.el-overlay .el-drawer{
    width: 90% !important;

    .conditions {
        & > div{
            margin-bottom: 10px;

            .el-select{
                width: 100% !important;
            }

           
        }

        .buttun-div{
            text-align: end;
        }

    }
}

@media screen and (max-width: 920px) {

    #list .declare-view .filter-content {

        width: auto;

        & > div{
            display: none;
        }

        .mobile{
            display: block;
        }
        
    }
}

</style>

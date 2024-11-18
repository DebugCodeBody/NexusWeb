<template>
    <div class="listcontent-item" @click="onClickItem(item)">
        <div class="w-full flex justify-between mb-5px font-16px title-line">
            <div>
                <span class="font-bold">{{ item.title }}</span>
                <span class="ml-10px">{{ item.tissue_user }}</span>
                <span class="ml-10px">{{ item.create_date }}</span>
                <span class="ml-10px" v-if="item.is_urgent">
                    <el-tag type="danger" effect="dark" size="small">紧急</el-tag>
                </span>
            </div>
            <div class="flex-1">
                <div class="text-right">
                    <el-button size="small" @click.stop="onClickStart(item)" v-if="showStart">转已开</el-button>
                    <el-button size="small" @click.stop="onClickToAbout(item)" v-if="showToAbout">转待约</el-button>
                    <end-button :item="item" size="small" v-if="showEnd" />
                    <el-button type="warning" v-if="showCancelEnd" size="small"
                        @click="onClickCacelEnd">撤销结案</el-button>
                    <el-button size="small" @click.stop="onClickEditMask(item)" v-if="showOk">确定会议</el-button>
                </div>

            </div>
        </div>
        <el-form :hide-required-asterisk="true" label-width="auto" ref="formEl">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="创建人员" prop="actor">{{ item.create_user }}</el-form-item>
                </el-col>
                <el-col :span="12" v-if="item.track_user">
                    <el-form-item label="执行者">
                        <el-tag class="cursor-pointer" size="small" @click="onClickTrackUser">{{ item.track_user
                            }}</el-tag>
                    </el-form-item>
                </el-col>

                <el-col :span="12" v-if="isNowProView">
                    <el-form-item label="期待响应时间">

                        <div class="cursor-pointer" @click="onClickSetNextTime">
                            <el-tag type="warning" size="small" v-if="!item.expect">未设置时间</el-tag>

                            <template v-else>
                                <el-tag size="small">{{ item.expect.time }}</el-tag>
                                <el-tag size="small" type="warning" class="ml-5px" v-if="item.expect.banci">{{ item.expect.banci }}</el-tag>

                            </template>


                        </div>

                    </el-form-item>
                </el-col>

            </el-row>
            <el-form-item label="沟通人员" v-if="item.comm_user">{{ item.comm_user }}</el-form-item>
            <el-form-item label="参与人员" prop="actor">

                <template v-for="(name, index) in item.actor_user" :key="index">


                    <el-popover ref="popover" placement="bottom" trigger="click" :width="popover.width"
                        :visible="popover.name == name">
                        <template #reference>

                            <div class="actor-name cursor-pointer" @click.capture="onClickPopoverActor(name)">
                                <el-tag size="default" effect="plain" type="danger" v-if="hectic.includes(name)">{{ name
                                    }}</el-tag>
                                <el-tag size="default" effect="plain" v-else>{{ name }}</el-tag>
                            </div>

                        </template>
                        <div>
                            <div>是否设置成执行者？</div>
                            <div class="mt-10px">
                                <el-input v-model="popover.memo" placeholder="请输入留言"></el-input>
                            </div>
                            <div class="mt-10px text-right">
                                <el-button size="small" @click="onClickPopoverCancel">取消</el-button>
                                <el-button type="primary" size="small"
                                    @click="onActorUserToTrack(name)">设置成执行人</el-button>
                            </div>
                        </div>
                    </el-popover>
                </template>
                <el-tag class="actor-name" size="default" effect="plain" @click.capture="onClickPopoverActor('')"
                    v-if="isNowView">其他</el-tag>

            </el-form-item>
            <el-form-item label="有空可参与" prop="actor" v-if="item.not_neceuser.length">
                <el-tag class="actor-name" size="default" effect="plain" type="success"
                    v-for="(name, index) in item.not_neceuser" :key="index">{{ name }}</el-tag>
            </el-form-item>
            <div class="flex">
                <el-form-item label="会议类型" prop="content" class="flex-1">
                    <div>{{ item.type }}</div>
                </el-form-item>
                <el-form-item label="开会时间" prop="content" class="flex-1" v-if="item.is_resource || item.start_time">
                    <div v-if="item.is_resource">{{ dayjs(item.rtime).format("MM-DD HH:mm") }}</div>
                    <div v-else>{{ item.start_time }}</div>
                </el-form-item>
            </div>

            <el-form-item label="标记内容">
                <div v-if="item.tag_content" class="mr-10px">{{ item.tag_content }}</div>
                <el-button size="small" @click="onClickSetTag">修改</el-button>
            </el-form-item>


            <el-form-item label="会议结果" prop="result" v-if="item.result">
                <div>{{ item.result }}</div>
            </el-form-item>
            <el-form-item label="开会内容" prop="content">
                <div>
                    <order-text :value="item.content" />
                </div>
            </el-form-item>
            <el-form-item label="图片" v-if="item.img.length">
                <template v-if="item.img.length">
                    <img-list v-for="(imgIten, index) in item.img" :img="item.img" :index="index" :key="index">
                    </img-list>
                </template>

            </el-form-item>
            <el-form-item label="留言" prop="content" v-if="stepList.length" class="label-top">
                <div>
                    <div v-for="(item, index) in stepList" :key="index">
                        <div>{{ item.createdate }} {{ item.fname }}  <order-text :value="item.memo" /></div>
                        <template v-if="item.img.length">
                            <img-list v-for="(imgIten, index) in item.img" :img="item.img" :index="index" :key="index">
                            </img-list>
                        </template>

                    </div>
                </div>

            </el-form-item>
        </el-form>
        <div class="w-full font-16px title-line">

            <div class="flex-1 text-right mb-5px flex justify-between items-center" v-if="type != 2 && type != 102">
                <div>

                </div>
                <div class="flex">
                    <!-- <el-button size="default" @click="onClickLinkView" v-if="!isLink && ( Props.type != 9 && Props.type != 10 )">关联会议</el-button> -->
                    <el-checkbox v-model="item.is_optimize" :border="true" size="default" class="optimize-check"
                        @change="onCheckOptimize" :disabled="disabledOptimize">工艺优化</el-checkbox>
                    <el-button type="success" size="default" @click="onClickAdd" v-if="isShowMemo">留言</el-button>
                    <el-button size="default" @click.stop="onClickStart(item)" v-if="showStart">转已开</el-button>
                    <el-button size="default" @click.stop="onClickToHandle(item)" v-if="isFdHandle">转待处理</el-button>

                    <end-button :item="item" v-if="isEnd" />
                </div>
            </div>
            <div class="flex-1 flex justify-between items-center">
                <el-tag type="danger" size="small" v-if="item.is_mark">已确认</el-tag>
                <div class="flex-1 text-right">

                    <!-- <el-button type="danger" size="default" @click="onClickToFollow"
                        v-if="showToFollowButton">关注会议</el-button>
                    <el-button size="default" @click="onClickDelFollow" v-if="showToNotFollowButton">取消关注</el-button> -->


                    <el-button size="default" @click.stop="onClickOpenCreate"
                        v-if="isShowCreateGroup && item.create_group" type="primary">打开会议群</el-button>
                    <el-button size="default" @click.stop="onClickOpenCreate"
                        v-if="isShowCreateGroup && !item.create_group" type="warning">创建会议群</el-button>
                    <el-button size="default" @click.stop="onClickSendMessage" type="success">发送消息</el-button>



                    <el-button size="default" @click.stop="onClickCopyShareUrl">复制链接</el-button>
                    <!-- <el-button size="default" type="info" @click.stop="onClickCopyValue">复制内容</el-button> -->
                    <el-button size="default" type="warning" v-if="isToStart"
                        @click.stop="onClickToStart">转待开</el-button>

                    <el-button size="default" @click.stop="onClickEdit(item)" v-if="showEditor">编辑会议</el-button>

                </div>
            </div>

        </div>
    </div>

    <pop-dialog title="添加留言" 
        v-model="add" 
        :destroyOnClose="true" 
        class="memo-input-dialog" 
        v-if="add"
        @confirm="onAddConfirm" 
        @opened="onOpenEd" 
        @closeed="onCloseEd">

        <el-form :model="form" label-width="0" :hide-required-asterisk="true" :rules="rules" label-position="top"
            ref="formEl">

            <el-form-item label="图片">
                <upload-file ref="uploadEl" v-model="imgLength" />

            </el-form-item>
            <el-form-item label="内容" prop="content">
                <el-input type="textarea" v-model="form.content" class="mb-5px" />
                <result-radio v-model="form.result" ref="resultRadioEl" />
            </el-form-item>

            <div class="create_group_tips flex flex-center" v-if="item.create_group">
                <div>
                    <el-tag type="danger">本会议已创建会议群，请到会议群中留言</el-tag>
                </div>
                <div class="mt-10px">
                    <el-button type="primary" @click="onClickOpenCreate">打开会议群</el-button>
                </div>
            </div>

        </el-form>

    </pop-dialog>

    <popDialog title="编辑会议" v-model="editDialog" class="edito-user_Dialog" :destroyOnClose="true"
        :loading="editorLoading" :disabledConfirmButton="!actor.length" @confirm="onConfirmEditUset" @opened="onOpenEd"
        @closeed="onCloseEd" v-if="editDialog">

        <el-form-item label="确认会议">
            <el-checkbox v-model="isMark" />
        </el-form-item>

        <el-form-item label="关注会议">
            <el-checkbox v-model="isFollow" />
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

    <popDialog title="修改组织" v-model="tissueDialog" custom-class="edito-tissue_Dialog" :destroyOnClose="true"
        :loading="editorLoading" v-if="editDialog" :showConfirmButton="false" @opened="onOpenEd" @closeed="onCloseEd">

        <el-button v-for="item in tissueArr" :key="item.name" @click="onClickEditTissue(item.name)">{{ item.name
            }}</el-button>

    </popDialog>

    <popDialog title="修改执行" v-model="trackDialog" custom-class="edito-tissue_Dialog" :destroyOnClose="true"
        v-if="trackDialog" :showConfirmButton="false" @opened="onOpenEd" @closeed="onCloseEd">

        <el-button v-for="item in allactor" :key="item.name" @click="onClickEditTrack(item.name)">{{ item.name
            }}</el-button>
    </popDialog>

</template>

<script setup lang="ts">
import popDialog from "global@/popDialog/index.vue";
import actorUser from "@/components/actorUser.vue";
import imgList from "@/components/imgList.vue";
import endButton from "@/components/endPopup/button.vue"
import orderText from "@/components/orderText.vue"


import { MessageBoxWarning, messageSuccess } from "@/utils/elementLib"
import dayjs from "dayjs"

import to from "await-to-js"
import { getStep, addStep, getEditorUserList, setEditorUserList, startMeeting, resourceAdd, resourceDel, delEditorUserList, editTrackUser, openSceneGroups, sceneGroupsMessage, editMark, cacelEnd, toAbout, tohandle } from "@/api"
import { followAdd, followDel } from "@/api"
import { setOptimize } from "@/api/optimize"
import { sendMessage } from "@/api/message";


import { getRtime, copyItemValue } from "@/utils/other"
import { getUserName } from "@/store/user"

import { messageError } from "@/utils/elementLib";
import uploadFile from "global@/uploadFile/index.vue";

import resultRadio from "@/components/resultRadio.vue"


import { onOpenEd, onCloseEd } from "@/utils/popKey";

import { isDing } from "@/utils/auth"






const Emit = defineEmits<{
    (e: 'clickTrackUser', value: mettItem): void;
}>();


const Props = withDefaults(defineProps<{
    type: number,
    item: mettItem,
    refresh: any,
    cancel?: boolean,
    optimize?: boolean,

    /** 是否关联会议 */
    isLink?: boolean,
    /** 繁忙人员名单 */
    hectic: string[]
}>(), {
    cancel: false,
    isLink: false,
    optimize: false,
});


const resultRadioEl = $ref<any>();

let add = $ref(false);

const formEl = $ref<any>();
const form = $ref({
    content: "",
    resultRadio: "0",
    result: "",
    train: ""

});
let imgLength = $ref(0);

const rules = reactive<any>({
    content: [
        {
            validator(rule: any, value: any, callback: any) {

                nextTick(() => {

                    let error: Error | undefined = resultRadioEl.rule();

                    if (!error && imgLength == 0 && !form.content && !form.result) {
                        error = new Error("请填写留言内容");
                    }

                    callback(error);

                })

            }, trigger: 'change'
        }
    ]
});


const stepList = computed(() => {


    const retList = Props.item.log;

    return retList;

});

/** 显示 */
const showEnd = computed(() => {
    /** Props.type 当前选中的是否为待处理 */
    return [1, 3, 4, 5, 7, 8].indexOf(Props.type - 0) > -1 || (Props.type == 6 && Props.item.track_user == thisName);
});

/** 顶边显示确定会议按钮 */
const showOk = computed(() => {

    let retVal = false;
    const { item, isLink, type } = Props;
    if (!isLink) {
        retVal = type == 0 || type == 6
    } else {
        retVal = item.status == 1 && !item.is_mark;
    }

    return retVal;


});

const showStart = computed(() => {

    return Props.type == 10;

})

const showToAbout = computed(() => {

    return Props.type == 4;

})


/** 是否显示编辑会议 */
const showEditor = computed(() => {

    return !Props.isLink && Props.type != 2 && Props.type != 9 && Props.type != 102

})

/** 是否显示撤销结案 */
const showCancelEnd = computed(() => {

    const { type } = Props;


    // type  == 102 &&  Props.item.status == 3 最近操作 且 已经结案

    return type == 2 || (type == 102 && Props.item.status == 3);
})



let editDialog = $ref(false);

const hotArr = $ref<userItem[]>([]);
const allactor = $ref<userItem[]>([]);
const actorArr = $ref<userItem[]>([]);
const notUserList = $ref<userItem[]>([]);


const actor = $ref<string[]>([]);
const notuser = $ref<string[]>([]);

const memo = $ref("");


let popover = $ref({
    visible: false,
    width: 0,
    memo: "",
    name: ""
});


let editorLoading = $ref(false);
let tissueDialog = $ref(false);
let trackDialog = $ref(false);

let isMark = $ref(Props.item.is_mark);


let isFollow = $ref(Props.item.follow);

let tissueName = $ref("");
let trackName = $ref("");

let thisName = $ref(getUserName());

/** 会议类型 */
let thisType = $ref("");

// "现场类",
let typeArr = $ref(["在产类", "防呆类", "畅聊类", "建议类"]);

const uploadEl = $ref<InstanceType<typeof uploadFile>>();


let tissueArr = $computed(() => {

    const tissue_user = tissueName;
    return allactor.filter((elem) => {
        return elem.name != thisName && elem.name != tissue_user
    })

})

/** 是否显示已确认 */
let isShowMark = computed(() => {
    return Props.cancel && [0, 3, 4, 5, 6, 8].indexOf(parseInt(`${Props.type}`)) > -1;
})

/** 是否显示转结案 */
let isEnd = computed(() => {
    return [0, 1, 3, 4, 5, 6, 7, 8].indexOf(parseInt(`${Props.type}`)) > -1 || Props.item.track_user == thisName;
})

/** 是否显示转待开 */
const isToStart = computed(() => {
    return Props.type == 10 || ([6, 8, 4, 1, 10].indexOf(Props.type) > -1 && (Props.item.track_user == thisName || Props.cancel))
})

/** 是否显示关注会议 */
const showToFollowButton = computed(() => {

    return isHandleView && !Props.item.follow;
})

/** 是否显示取消关注 */
const showToNotFollowButton = computed(() => {
    return isHandleView && Props.item.follow;
})


/** 是否现场类 */
const isNowView = computed(() => {
    return Props.type == 7
})

/** 是否在待处理类 */
const isHandleView = $computed(() => {
    return Props.type == 6
})

/** 是否在场类类 */
const isNowProView = $computed(() => {
    return Props.type == 5
})

/** 会议待处理 */
const isFdHandle = computed(() => {

    return Props.type == 0 && Props.item.type == "防呆类" && !!Props.item.track_user;

})


const isShowMemo = computed(() => {
    const { type } = Props;
    return ![9, 102].includes(type)
})

/** 是否显示创建群会议 */
const isShowCreateGroup = computed(() => {

    return [0, 4, 5, 6, 10].includes(Props.type - 0);

})

/** 是否禁用工艺优化 */
const disabledOptimize = computed(() => {

    return [2, 102].includes(Props.type) || !Props.optimize;

});



function onClickItem(item: mettItem) {

    // exportData.item = item as any;

    // window.movePath("memo")

}


async function onCheckOptimize(value: boolean) {



    await to(setOptimize(Props.item.id, value));


    Props.refresh();

}


function onClickCopyValue() {

    const { item } = Props;

    copyItemValue(item);

    messageSuccess("复制成功");

}

function onClickCopyShareUrl() {

    const { item } = Props;

    copyItemValue(item, true);

    messageSuccess("复制成功");
}


/** 转到待开 */
async function onClickToStart() {

    const [err] = await to(resourceDel(Props.item.id));
    if (err) {
        return;
    }

    Props.refresh();

}



/** 获取人员 */
async function onClickEdit(item: mettItem) {


    actorArr.length = 0;
    actor.length = 0;
    notuser.length = 0;

    editorLoading = true;

    const [error, data] = await to(getEditorUserList(item.id));

    editorLoading = false;
    if (error) {
        editDialog = false;
        return;
    }

    let { user, hot } = data;



    hotArr.length = 0;
    hotArr.push(...hot);


    allactor.length = 0;
    allactor.push(...user);


    actorArr.length = 0;
    actorArr.push(...user);

    actor.length = 0;
    actor.push(...item.actor_user);

    notuser.length = 0;
    notuser.push(...item.not_neceuser);


    thisType = item.type;

    tissueName = Props.item.tissue_user;
    trackName = Props.item.track_user;

    isFollow = Props.item.follow;

    editDialog = true;


}


function onClickEditTissue(name: string) {

    tissueDialog = false;
    tissueName = name;

}

/** 修改跟进人员 */
function onClickEditTrack(name: string) {

    trackDialog = false;
    trackName = name;

}


/** 清除跟进人员 */
function onClickClearTrack() {

    trackName = "";

}



/** 确定转成执行者 */
async function onActorUserToTrack(name: string) {


    popover.name = "";

    const [error] = await to(editTrackUser(Props.item.id, name, popover.memo))



    if (error) {
        return;
    }
    Props.refresh();


}


/** 提交编辑 */
async function onConfirmEditUset() {

    const data = {
        actor,
        notuser,
        tissue: tissueName,
        track: trackName,
        mark: isMark,
        memo,
        type: thisType,
        follow: isFollow

    };

    const [err, result] = await to(setEditorUserList(Props.item.id, data));
    if (err) {
        return;
    }

    editDialog = false;

    Props.refresh();

}


/** 点击的执行者 */
function onClickTrackUser() {
    Emit("clickTrackUser", Props.item);
}


/** 编辑会议点击修改组织人员 */
async function onClickTissueDialog() {

    try {
        tissueName = await window.openNameSelect({
            title: "修改组织人员",
            isOne: true,
        });


    } catch {
        return;
    }


}

/** 编辑会议点击修改组织人员 */
async function onClickTrackDialog() {

    try {

        trackName = await window.openNameSelect({
            title: "修改执行者",
            isOne: true,
        });


    } catch {
        return;
    }


}

/** 给参与人员和群发送消息 */
async function onClickSendMessage() {

    const [err] = await to(sendMessage(Props.item.id))





}


function onClickAdd() {


    add = true;

    form.content = "";
    form.resultRadio = "0";
    form.result = "";
    form.train = "";

}


function onClickEditMask(item: mettItem) {


    try {
        editMark(item.id, true)
    } finally {
        Props.refresh();
    }

}


async function onAddConfirm() {

    if(Props.item.create_group) {
        add = false;
        return;
    }

    try {
        await formEl.validate()
    } catch {
        return;
    }

    let img = [];

    try {
        img = await uploadEl.uploadFile();
    } catch {
        messageError("图片上传失败");
        return;
    }


    const sendData = {
        id: Props.item.id,
        memo: form.content,
        result: form.result,
        img

    }

    const [err] = await to(addStep(sendData));
    if (err) {
        return;
    }




    form.content = "";

    onCloseEd();
    add = false;

    Props.refresh();



}


function onClickLinkView() {

    window.linkView(Props.item);

}


/** 撤销结案 */
async function onClickCacelEnd() {

    try {
        await MessageBoxWarning("确定撤销结案？");
    } catch {
        return;
    }

    await to(cacelEnd(Props.item.id));



    Props.refresh();

}

/** 打开群 */
async function onClickOpenCreate() {


    const { id } = Props.item;


    let [error, result] = await to(openSceneGroups(id));
    if (error) {
        alert("创建群失败，请联系管理员！");
        return;
    }

    let { conversation, exist } = result!;
    if (exist) {
        try {
            await MessageBoxWarning("会议参与人员已有群，是否打开？");
        } catch {

            [error, result] = await to(openSceneGroups(id, true));
            if (error) {
                return;
            }

            conversation = (result && result!.conversation || "");

        }
    }

    if (!conversation) {
        alert("创建群失败，请联系管理员！");
        return;
    }

    Props.item.create_group = conversation;



    if (isDing()) {

        dd.biz.chat.toConversationByOpenConversationId({
            openConversationId: conversation
        });

    } else {

        let aEl = document.createElement("a");
        aEl.href = `dingtalk://dingtalkclient/action/openapp?corpid=dingf2f1e9ca1da23dff&container_type=work_platform&app_id=0_2726873885&redirect_type=emit_params&params=&redirect_url=https%3A%2F%2Fcddgd.cn%2Fding%2Fcoolapp%2Fmeeting%2Findex.html%3Fpath%3Dopengroup%26conversation%3D${encodeURIComponent(encodeURIComponent(conversation))}`

        aEl.click();
        aEl = undefined as any;

    }

    Props.refresh();
    add = false;


    // 打开群聊
    // https://open.dingtalk.com/document/orgapp/redirects-to-the-specified-session-based-on-the-openconversationid



    // setTimeout(async () => {

    //     [error] = await to(sceneGroupsMessage(id, conversation));
    //     if (error) {
    //         return;
    //     }



    // }, 500);



}



/** 点击后参与人员 */
function onClickPopoverActor(name: string) {

    if (Props.type == 2) {
        return;
    }

    if (Props.item.track_user != "" && Props.item.track_user == name) {
        return;
    }




    window.onPopEditorTrack(Props.item, name, Props.type == 7);

    // return;

    // const declareViewEl = document.querySelector("#app .main-wrap .declare-view")!;




    // popover.memo = "";
    // popover.width = parseInt(`${declareViewEl.clientWidth * 0.8}`);
    // popover.visible = true;
    // popover.name = name;


    // function onScroll() {

    //     window.removeEventListener("scroll", onScroll, true);

    //     popover.name = "";

    // }

    // window.addEventListener("scroll", onScroll, true);


}

/** 点击取消 */
function onClickPopoverCancel() {

    popover.visible = false;
    popover.name = "";



}


function onClickSetTag() {

    window.onEditeTag(Props.item);

}

async function onClickStart(item: mettItem) {

    const [err, result] = await to(startMeeting(item.id));

    Props.refresh();

}

// 待开防呆类有执行人转待处理
async function onClickToHandle(item: mettItem) {


    const [err, result] = await to(tohandle(item.id));

    Props.refresh();

}


async function onClickToAbout(item: mettItem) {

    const [err, result] = await to(toAbout(item.id));

    Props.refresh();

}

async function onClickToFollow() {

    await to(followAdd(Props.item.id));

    Props.refresh();


}
async function onClickDelFollow() {


    await to(followDel(Props.item.id));

    Props.refresh();

}


function onClickSetNextTime() {

    window.onSetNextTime(Props.item);

}



function closePop(value: boolean) {


    if (!value) {

        onCloseEd();

    }

}


watch(() => add, closePop);
watch(() => editDialog, closePop);
watch(() => editDialog, closePop);
watch(() => trackDialog, closePop);




onMounted(() => {

})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.listcontent-item {
    margin-bottom: 10px;
    border-radius: 5px;


    &.mark {
        .font-bold {
            color: red;
        }
    }

    .actor-name {
        margin-right: 5px;
        margin-bottom: 5px;
    }

    form {
        padding-top: 0;

        .el-form-item {
            margin-bottom: 5px;
        }
    }

    box-shadow: var(--el-box-shadow-light);

    .title-line {
        border-bottom: 1px solid #ddd;
        font-size: 14px;
        padding: 5px 10px;

    }

    .el-form {
        padding-bottom: 0 !important;
    }

    .el-form-item--large .el-form-item__content,
    .el-form-item__label {
        line-height: 24px !important;
    }

    .el-form-item--large .el-form-item__label {
        height: auto !important;
    }

    .optimize-check {
        margin-right: 10px !important;
    }



}

.memo-input-dialog {

    width: 90% !important;
    max-width: 650px;


    textarea {
        height: 100px;
        resize: none;
    }

    .el-form{
        position: relative;
    }

    .create_group_tips{

        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        background: white;
        justify-content: center;
        align-items: center;
        flex-direction: column;

    }

}

.edito-tissue_Dialog {
    button {
        margin-left: 0;
        margin-right: 5px;
        margin-bottom: 5px;
    }

    .el-button+.el-button {
        margin-left: 0;

    }

}

.edito-user_Dialog .el-form-item--large {
    margin-bottom: 0px !important;
}
</style>

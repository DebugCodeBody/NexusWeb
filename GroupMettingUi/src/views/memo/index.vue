<template>
    <div id="meeting-memo" class="wh-full">


        <div class="declare-view">
            <meet-item :item="item">
            </meet-item>

            <div class="flex-1">
                <div class="wh-full" ref="bottonContent">
                    <div class="wh-full relative">
                        <div class="wh-full absolute overflow-hidden">
                            <work-step v-model="stepList" :getTitle="getTitle" :maxHeight="stepHeight" :loading="loading"
                                :error="loadError">
                                <template #default="{ item }">
                                    <p>人员：{{ item.fname }}</p>
                                    <p>时间：{{ item.createdate }}</p>
                                    <p>内容：{{ item.memo }}</p>
                                </template>
                            </work-step>

                            <div class=" mt-10px input-content" ref="inputContent">
                                <div class="felx-1" v-if="!isEnd">
                                    <el-form :model="form" label-width="auto" :hide-required-asterisk="true">
                                        <el-form-item label="留言">
                                            <el-input type="textarea" v-model="form.content" />
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <div>
                                    <el-button type="primary" class="block" @click="onClickAddStep" v-if="!isEnd">提交</el-button>
                                    <el-button class="block" @click="onClickReturn">返回</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">

import meetItem from "@/components/meetItem.vue"
import workStep from "global@/workStep/index.vue"
import { getStep, addStep } from "@/api"
import to from "await-to-js";


import exportData from "@/store/data";


const item = exportData.item as any as mettItem;


let stepHeight = $ref(400);
const bottonContent = $ref<HTMLDivElement>();
const inputContent = $ref<HTMLDivElement>();



const form = $ref({
    content: ""
})

const stepList = $ref<any[]>([]);
const isEnd = $ref(item.is_start)
let loading = $ref(false);
let loadError = $ref(false)


function getTitle() {
    return "留言"
}

function onClickReturn() {

    window.movePath("list")
    
}

async function onClickAddStep() {

    addStep(item.id, form.content)

    init();




}


async function init() {

    loading = true;
    loadError = false


    const [err, result] = await to(getStep(item.id));
    if (err) {

        loadError = true
    } else {

        stepList.length = 0;
        stepList.push(...result);

    }

    loading = false;



}



init();


onMounted(() => {

    stepHeight = Math.min(bottonContent.clientHeight - inputContent.clientHeight - 40, stepHeight);


})

</script>

<script lang="ts">
export default {
    title:"会议留言",
    name: "memo"
}
</script>

<style lang="scss">
#meeting-memo {
    overflow: auto;
    


    .declare-view {
        background-color: white;
        position: relative;
        height: 100%;

        padding-top: 5px;
        max-width: 800px;
        padding-bottom: 10px;
        margin: auto;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    padding: 10px;



    }

    button {
        display: block !important;
        width: 100%;
        margin: 0;
        margin-top: 10px;
    }



    textarea {
        height: 80px;
        resize: none;
    }

    .el-form-item {
        margin: 0;
    }


    form{
        padding: 10px;
    }
    .input-content {
        form {
            padding-bottom: 0;
        }
    }

    
}
</style>

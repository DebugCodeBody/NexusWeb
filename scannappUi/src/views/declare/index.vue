<template>
    <div id="declare" class="wh-full">
        <div class="declare_view wh-full relative overflow-hidden flex flex-col">
            <h3 class="title">{{ title }}</h3>
            <div class="flex-1 wh-full mt-10px overflow-auto declare_wrap">

                <tool-collapse v-model="defaultValue" v-for="item in appList" :name="item.name" :key="item.name"
                    :disabled="true">

                    <div class="wh-full overflow-auto form-content p-10px">
                        <app-item v-for="(urlItem) in item.data" :key="urlItem.id" :item="urlItem">
                        </app-item>
                    </div>
                </tool-collapse>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

import { ElForm, FormRules } from 'element-plus'

import appItem from "@/components/appItem.vue"

import { getList } from "@/api"
import to from "await-to-js";

import toolCollapse from "@/components/toolCollapse/index.vue"





const form = $ref({
    data: "",
});

let initError = $ref(false);
let initLoading = $ref(false);
let submitDone = $ref(false);
let submitLoading = $ref(false);

let appList = $ref<groupItem[]>([]);
const defaultValue = $ref(true);


const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
})


async function onClickSubmit() {
    try {
        await formEl.validate();
    } catch {
        return;
    }



    try {

        submitLoading = true;










    } catch {



    } finally {
        submitLoading = false;
    }




}





async function init() {

    try {

        initLoading = true;


        const [err, data] = await to(getList());
        if (err) {
            return;
        }

        appList.push(...data);




    } catch {
        initError = true;
    } finally {
        initLoading = false;
    }

}


init();




</script>

<script lang="ts">

const title = $ref("应用列表");

export default {
    name: "",
    title
}
</script>

<style lang="scss">
#declare {

    .testscrollList {
        background-color: white;
        z-index: 99;
    }


    .declare_view {
        max-width: 800px;
        margin: auto;
    }

    .title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 5px;
        background-color: #66b1ff;
    }

    .form-content {

        form {
            padding: 10px;
            box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);

            .el-form-item {
                &.line-item {
                    flex-direction: column;
                }

                &.mb-0 {
                    margin-bottom: 0;
                }
            }

            textarea {
                height: 100px;
                resize: none;
            }

            .el-checkbox-group .el-checkbox,
            .el-radio-group .el-radio {
                margin-right: 10px;
                margin-bottom: 10px;
                padding: 0 10px;
            }

        }

    }

    .button-block {
        .el-button {
            width: 100%;

            &+.el-button {
                margin-left: 0;
            }
        }
    }


    .el-result {
        background-color: white;

        position: absolute;
        top: 0px;
        width: 100%;
        z-index: 99;

        * {
            user-select: none !important;
        }

    }

    .item__content{
        padding: 0;
    }

    .app-item {
        position: relative;
        width: 120px;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0 0 11px rgb(33 33 33 / 20%);
        cursor: pointer;
        overflow: hidden;
        display: inline-block;

        margin-right: 5px;
        margin-bottom: 5px;

        width: 25%;
        max-width: 84px;

        height: 120px;


        .img {
            padding-bottom: 10px;
            overflow: hidden;

            img {
                display: block;
                width: 90px;
            }
        }

        .name {
            text-align: center;
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 12px;
        }

    }

    .tool-collapse {
        background-color: white;

        &:not(:last-child) {
            margin-bottom: 10px;
        }
    }
}
</style>

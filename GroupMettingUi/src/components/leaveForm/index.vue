<template>
    <el-form class="leave-form" :model="form" :rules="rules" :hide-required-asterisk="true" label-width="auto" ref="formEl">

        <slot></slot>

        <el-form-item label="开始时间" prop="start_time">
            <el-date-picker v-model="form.start_time" type="datetime" placeholder="请选择开始时间"
                :default-time="defaultTime.start" />
        </el-form-item>

        <el-form-item label="结束时间" prop="end_time">
            <el-date-picker v-model="form.end_time" type="datetime" placeholder="请选择结束时间"
                :default-time="defaultTime.end" />
        </el-form-item>
        <el-form-item label="空闲时间" prop="view_time">

            <el-checkbox-group v-model="form.leisure">
                <el-checkbox v-for="item in banList" :key="item.id" :value="item.id" :label="item.id">{{
        item.name }}
                </el-checkbox>
            </el-checkbox-group>

        </el-form-item>

        <el-form-item label="视频会议" prop="is_view" v-if="false">
            <el-switch v-model="form.is_video" active-text="接受" inactive-text="不接受" />
        </el-form-item>

        <el-form-item label="繁忙时间" class="label-top">

            <div class="w-full hectic">
                <tool-collapse v-for="item in form.hectic" :key="item.name" :name="item.name">
                    <el-form-item>
                        <hectic-item :value="item.value" ref="hecticItemList" />
                    </el-form-item>
                </tool-collapse>
            </div>

        </el-form-item>
    </el-form>

    <pop-empty ref="emptyEl" />
</template>

<script setup lang="ts">

import type { FormRules } from 'element-plus'


import hecticItem from "./hecticItem.vue";
import toolCollapse from "@/components/toolCollapse/index.vue";

import popEmpty from "./popEmpty.vue";

import dayjs from "dayjs"


import to from "await-to-js";

import { getLeave, setLeave } from "@/api/leave"


const formEl = $ref<any>();
const emptyEl = $ref<any>();
const hecticItemList = $ref<any[]>();

const defaultTime = $ref({
    start: undefined as any as Date,
    end: undefined as any as Date
})



const banList = $ref([
    {
        name: "早上",
        id: `1`
    },
    {
        name: "下午",
        id: `2`
    },
    {
        name: "晚上",
        id: `3`
    }
])


const rules = reactive<FormRules>({

    start_time: [
        {
            validator(rule, value, callback, source, options) {

                let retErr: Error | undefined = undefined;

                if (form.start_time && form.end_time) {

                    if (dayjs(form.start_time).isAfter(dayjs(form.end_time))) {
                        retErr = new Error("开始时间不允许大于结束时间")
                    }

                }

                callback(retErr);

            }, trigger: 'change'
        }
    ],
    end_time: [
        {
            validator(rule, value, callback, source, options) {

                let retErr: Error | undefined = undefined;


                if (form.start_time && !form.end_time) {
                    retErr = new Error("请填写结束时间")
                }

                callback(retErr);

            },
            trigger: 'change'
        }
    ]

});



const form = $ref({
    /** 用户名 */
    username: "",

    /** 开始时间 */
    start_time: undefined as any as Date,

    /** 结束时间 */
    end_time: undefined as any as Date,

    /** 空闲时间 */
    leisure: [] as string[],

    /** 视频会议 */
    is_video: false,

    hectic: [] as any[]


});


function formatDay(time: string | Date) {
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
}


async function init() {

    const ymdTime = dayjs().format("YYYY-MM-DD");


    defaultTime.end = new Date(`${ymdTime} 21:00`);
    defaultTime.start = new Date(`${ymdTime} 09:00`);


    const { hectic } = form;

    const weekSplit = `一二三四五六`.split("");

    weekSplit.forEach((name) => {

        hectic.push({
            name: `周${name}`,
            value: []
        })

    });

}

init();



defineExpose({

    set(name:string, statusInfo: any) {

        form.username = name;

        if (statusInfo.start_time) {
            form.start_time = new Date(statusInfo.start_time);

        }
        if (statusInfo.end_time) {
            form.end_time = new Date(statusInfo.end_time);

        }


        form.leisure = statusInfo.leisure;
        form.is_video = statusInfo.is_video;


        const { hectic } = form;


        statusInfo.hectic.forEach((item: any) => {

            const findIndex = hectic.findIndex((elem) => elem.name == item.name);

            hecticItemList[findIndex].set(item.value)

        })



    },
    async submit() {

        try {
            await formEl.validate();
        } catch {
            return false;
        }

        const emptyValue = form.hectic.filter((item) => !item.value.length);
        if (emptyValue.length) {

            try {
                await emptyEl.open(emptyValue.map((elem) => elem.name))
            } catch {
                return false;
            }
        }

        const sendData = {
            ...form
        };

        if (sendData.start_time) {
            sendData.start_time = formatDay(sendData.start_time) as any;
        } else {
            sendData.start_time = formatDay(new Date()) as any;
        }

        sendData.end_time = formatDay(sendData.end_time) as any;


        const [err, data] = await to(setLeave(sendData));

        return !err;

    }


})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.leave-form{
    .el-checkbox {
        margin-right: 20px;
        margin-bottom: 5px;
    }

    .hectic .el-date-editor--timerange {
        width: 220px;
    }


}
</style>

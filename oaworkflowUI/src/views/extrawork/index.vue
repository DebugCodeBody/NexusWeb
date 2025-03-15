<template>
    <div class="wh-full relative ">
        <div>
            <vxe-table :border="true" show-overflow :row-config="{ isHover: true }" :data="tableData"
                @cell-click="onClickTableRow" height="400">
                <vxe-column type="seq" title="序号" width="40"></vxe-column>
                <vxe-column field="startDate" title="开始日期" width="80">
                    <template #default="{ row }: { row:RowVO }">
                        {{ dayjs(row.startDate).format("YY-MM-DD") }}
                    </template>
                </vxe-column>
                <vxe-column field="endDate" title="结束日期" width="80">
                    <template #default="{ row }: { row:RowVO }">
                        {{ dayjs(row.endDate).format("YY-MM-DD") }}
                    </template>
                </vxe-column>
                <vxe-column field="time" title="加班时间" width="110">
                    <template #default="{ row }">
                        <span>{{ foramTime(row.time) }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="hour" title="小时" width="80"></vxe-column>
                <vxe-column field="work" title="工作内容" width="150"></vxe-column>
            </vxe-table>
            <div class="p-10px">
                <van-button plain block type="primary" @click="onClickAddFrom">添加加班</van-button>
            </div>
            <div class="p-10px">
                <van-button block type="primary" @click="onSubmit" :disabled="tableData.length == 0">提交申请</van-button>
            </div>
        </div>

        <van-popup v-model:show="showTime" class="w-6/10 select-date">
            <van-tabs v-model:active="timeTabsActive">
                <van-tab title="开始时间">
                    <div class="wh-full flex flex-col my-10px">
                        <van-time-picker v-model="time.temp.start" :filter="filter" />
                    </div>
                </van-tab>
                <van-tab title="结束时间">
                    <div class="wh-full flex flex-col my-10px">
                        <van-time-picker v-model="time.temp.end" :filter="filter" />
                    </div>
                </van-tab>
            </van-tabs>

            <div class="px-20px py-10px flex justify-end cancellation">
                <van-button plain type="primary" size="small" @click="showTime = false">取消</van-button>

                <van-button plain type="danger" size="small" class="confirm" @click="onClickConfirmTime"
                    v-if="timeTabsActive == 0">下一步</van-button>
                <van-button plain type="primary" size="small" class="confirm" @click="onClickConfirmTime"
                    v-else>确定</van-button>
            </div>
        </van-popup>

        <van-calendar type="range" first-day-of-week="1" v-model:show="showDate" :default-date="calendarDefault"
            :min-date="minDate" :allow-same-day="true" :max-date="maxDate" @select="onSelectDate"
            @confirm="onCalendarConfirm">

            <template #title>
                <div>
                    <div class="flex justify-center items-center">
                        加班时间：从 <van-tag type="primary" class="mx-5px">{{ selectTempDate.start }}</van-tag> 开始，
                        <van-tag type="primary" class="mx-5px" v-if="selectTempDate.end">{{ selectTempDate.end }}</van-tag>
                        <van-tag type="danger" class="mx-5px" v-else>未选中</van-tag>
                        结束
                    </div>
                </div>
            </template>


        </van-calendar>



        <van-popup v-model:show="formshow" @closed="onFormPopupClosed" class="p-10px form">

            <van-form @submit="onFromSubmit" @failed="onFromSubmit" ref="formEl">
                <van-cell-group inset>
                    <van-field v-model="formData.startDate" label="开始日期" @click="onStartDateFocus" readonly
                        :rules="[{ required: true, message: '请选择开始日期' }]" />
                    <van-field v-model="formData.endDate" label="结束日期" @click="onEndDateFocus" readonly
                        :rules="[{ required: true, message: '请选择结束日期' }]" />
                    <van-field v-model="startTime" label="开始时间" readonly @click="onClickTime"
                        :rules="[{ required: true, message: '请选择加班时间' }]">
                    </van-field>

                    <van-field v-model="endTime" label="结束时间" readonly @click="onClickEndTime"
                        :rules="[{ required: true, message: '请选择加班时间' }]">
                        <template #input>
                            <span>{{ endTime }}</span>
                        </template>
                    </van-field>
                    <van-field v-model="formData.hour" label="小时"
                        :rules="[{ required: true, validator: hourValidator, message: '请填写小时数' }]" />
                    <van-field v-model="formData.work" label="工作内容" :rules="[{ required: true, message: '请填写工作内容' }]" />

                </van-cell-group>
                <div class="m-16px flex justify-between">
                    <div>
                        <van-button type="danger" @click="onClickFromDel" v-if="!isAdd" size="small">删除</van-button>
                        <van-button @click="onClickFromCancel" v-else size="small">取消</van-button>
                    </div>
                    <van-button type="primary" native-type="submit" size="small">确定</van-button>
                </div>
            </van-form>

        </van-popup>

        <div class="wh-full absolute top-0 flex flex-col justify-center items-center z-11 " style="background-color:white"
            v-if="SubmitDone">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="w-64px h-64px" style="color: #67c23a;">
                <path fill="currentColor"
                    d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z">
                </path>
            </svg>
            <div class="mt-10pxz">
                <van-button plain type="primary">提交成功</van-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VxeTable, VxeColumn, VxeTableEvents, VxeTableDefines, v } from 'vxe-table'
import 'vxe-table/lib/style.css'
import { showDialog } from 'vant';

import dayjs, { Dayjs } from "dayjs";
import zhCnLocale from 'dayjs/locale/zh-cn';

import { arrayMapToNumber, getDayjsYMD } from "@/utils/other"
import { createOvertime } from "@/api"
import { to } from "await-to-js";

window.dayjs = dayjs;


/** 效验小时字段 */
function hourValidator(val: string) {
    if (!val) {
        return Promise.reject("请填写加班小时数")
    } else {
        const intVal = parseInt(val);
        if (intVal == null || intVal <= 0) {
            return "请输入大于0的内容"
        }
    }

    return true;
}

function isWeekendRange(start: string[], end: string[]) {
    const dayjsStart = dayjs(start.join("-"));
    const dayjsEnd = dayjs(end.join("-"));
    const diffDay = dayjsEnd.diff(dayjsStart, "day");

    const weekArr: number[] = [];
    const workArr: number[] = [];
    if (diffDay > 0) {

        for (let index = 0; index <= diffDay; index++) {
            const day = dayjsStart.add(index, "day").day();
            if ((day == 0 || day == 6)) {
                weekArr.push(1);
            } else {
                workArr.push(1);
            }
        }

    }

    return workArr.length > 0 && weekArr.length > 0;

}

function getDiffDay(start: string[], end: string[]) {

    const dayjsStart = dayjs(start.join("-"));
    const dayjsEnd = dayjs(end.join("-"));
    return dayjsEnd.diff(dayjsStart, "day");
}


function foramTime(timeArr?: string[][]) {

    if (timeArr && !Array.isArray(timeArr)) {

        const splitArr = `${timeArr}`.split(",")
        timeArr = [[splitArr[0], splitArr[1]], [splitArr[2], splitArr[3]]];
    }

    if (timeArr) {
        return `${timeArr[0].join(":")} ~ ${timeArr[1].join(":")}`
    } else {
        return ""
    }

}


interface RowVO {
    startDate: string,
    endDate: string
    work: string
    hour: number
    time: string[][]
}

let selectTableData: RowVO;
const tableData = $ref<RowVO[]>([

]);

let formData = $ref<RowVO>({} as RowVO);

const startTime = $computed(() => {
    return time.result.start.join(":");

})
const endTime = $computed(() => {
    return time.result.end.join(":");
})


/** 设置每一周第一天为周一 */
dayjs.locale('zh-cn', Object.assign(zhCnLocale, {
    weekStart: 1
}));







let isAdd = $ref(false);
const nowTime = dayjs();
let startMonth = nowTime.startOf("month");
const endMonth = startMonth.endOf("month");


const weekArr: Dayjs[][] = [];



for (let index = 0; index < 6; index++) {


    const thisWeek = startMonth.endOf("week");

    let startWeek = startMonth;
    let endWeek = thisWeek;


    startMonth = thisWeek.add(1, "day");

    if (startMonth.diff(endMonth, "day") > 0) {
        index = 100;
        endWeek = endMonth;
    }


    let dayDiff = endWeek.diff(startWeek, "day");
    const thisWeekArr: Dayjs[] = [];

    for (let i = 0; i <= dayDiff; i++) {

        const dayThis = startWeek.add(i, "day");


        if (dayThis.day() != 0) {
            thisWeekArr.push(dayThis);
        }
        // console.log(, dayThis.format("YYYY-MM-DD"))

    }

    if (thisWeekArr.length > 0) {
        weekArr.push(thisWeekArr);
    }


}

const jiabanArr = [];


const jiabanTable = weekArr.map((weekElem) => {


    const noWeekEnd: Dayjs[] = [];
    const weekEnd: Dayjs[] = [];



    const retVal = weekElem.map((dayElem) => {

        let retWork = "";
        if (dayElem.day() < 6) {

            noWeekEnd.push(dayElem);
            retWork = "19:00 ~ 21:00"
        } else {
            weekEnd.push(dayElem);
            retWork = "9:00 ~ 21:00"
        }

        return retWork;

    })



    if (noWeekEnd.length > 0) {

        tableData.push({
            startDate: noWeekEnd[0].format("YYYY-MM-DD"),
            endDate: noWeekEnd[noWeekEnd.length - 1].format("YYYY-MM-DD"),
            work: "写程序",
            hour: noWeekEnd.length * 2,
            time: [["19", "00"], ["21", "00"]]

        })

    }

    if (weekEnd.length > 0) {

        tableData.push({
            startDate: weekEnd[0].format("YYYY-MM-DD"),
            endDate: weekEnd[0].format("YYYY-MM-DD"),
            work: "写程序",
            hour: 10,
            time: [["09", "00"], ["21", "00"]]

        })

    }




    return retVal;


})



let minDate: Date;

if (nowTime.month() == 0) {
    minDate = new Date(nowTime.year() - 1, 11, 1);
} else {
    minDate = new Date(nowTime.year(), nowTime.month() - 1, 1);
}

const maxDate = new Date(nowTime.endOf("month").format("YYYY-MM-DD"));


const formEl = $ref<any>();
let formshow = $ref(false);
function onFromSubmit(values: any) {

    if (values.errors && values.errors.length > 0) {
        return;
    }


    if (!Array.isArray(formData.time)) {

        const splitArr = `${formData.time}`.split(",")
        formData.time = [[splitArr[0], splitArr[1]], [splitArr[2], splitArr[3]]];
    }

    formshow = false;
    if (isAdd) {
        tableData.push({
            ...formData
        });
    } else {
        Object.assign(selectTableData, formData);
    }

    return false;

}

let SubmitDone = $ref(false);

let timeTabsActive = $ref(0);
let showTime = $ref(false);
const time = $ref<{
    temp: {
        start: string[],
        end: string[]
    },
    result: {
        start: string[],
        end: string[]
    },
}>({
    temp: {
        start: [],
        end: []
    },
    result: {
        start: [],
        end: []
    }

})

let dateTabActive = $ref(0);

let selectTempDate = $ref<{
    start: string,
    end: string
}>({
    start: "",
    end: "",
})

let startCurrentDate = $ref<string[]>([]);
let endCurrentDate = $ref<string[]>([]);
let calendarDefault = $ref<Date[]>([]);

let showDate = $ref(false);
function onClickFromDel() {

    showDialog({
        message: '确定删除此加班申请？',
        showCancelButton: true
    }).then(() => {

        tableData.splice(tableData.indexOf(selectTableData), 1);
        formshow = false;

    });

}

function onClickAddFrom() {
    formData = {} as any;
    formshow = true;
    isAdd = true;

    time.result.start = [];
    time.result.end = [];

}


function onClickFromCancel() {
    formshow = false;
}

function onFormPopupClosed() {
    formEl.resetValidation();
}


function onClickTableRow({ row }: VxeTableDefines.CellClickEventParams<RowVO>) {

    selectTableData = row;
    Object.assign(formData, row);


    time.temp.start = [...formData.time[0]];
    time.temp.end = [...formData.time[1]];

    time.result.start = [...formData.time[0]];
    time.result.end = [...formData.time[1]];

    formshow = true;
    isAdd = false;

}

function onStartDateFocus() {

    dateTabActive = 0;
    setDefaultDatePicker();
    nextTick(() => {
        showDate = true;
    })

}
function onEndDateFocus() {

    dateTabActive = 1;
    setDefaultDatePicker();
    nextTick(() => {
        showDate = true;
    })

}


function onClickTime() {
    showTime = true;
    timeTabsActive = 0;
    time.temp.start = []
    time.temp.end = [];
    setDefaultDateTime();
}
function onClickEndTime() {
    showTime = true;
    timeTabsActive = 1;
    time.temp.end = [];
    setDefaultDateTime();
}



function onSelectDate(selectDate: Date[]) {
    const { length } = selectDate;

    selectTempDate.start = dayjs(selectDate[0]).format("MM-DD")
    if (length == 1) {
        selectTempDate.end = "";
    } else {
        selectTempDate.end = dayjs(selectDate[1]).format("MM-DD");
    }

}

/** 确定日历 */
function onCalendarConfirm(selectDAte: Date[]) {

    startCurrentDate = getDayjsYMD(dayjs(selectDAte[0])).split("-");
    endCurrentDate = getDayjsYMD(dayjs(selectDAte[1])).split("-");
    onDatePickerConfirm();

}

/** 确定日期 */
function onDatePickerConfirm() {
    const start = arrayMapToNumber(startCurrentDate);
    const end = arrayMapToNumber(endCurrentDate);


    if (start[0] != end[0]) {
        showDialog({ message: '开始日期和结束日期年份必须一致' });
        return;
    }
    if (start[1] != end[1]) {
        showDialog({ message: '开始日期和结束日期月份必须一致' });
        return;
    }
    if (start[2] > end[2]) {
        showDialog({ message: '开始日期不允许大于结束日期' });
        return;
    }

    // if (isWeekendRange(startCurrentDate, endCurrentDate)) {
    //     showDialog({ message: '工作日不能与周末混合选择' });
    //     return;
    // }


    formData.startDate = startCurrentDate.join("-");
    formData.endDate = endCurrentDate.join("-");
    showDate = false;


}


/** 确定时间 */
function onClickConfirmTime() {


    if (timeTabsActive == 0) {
        timeTabsActive = 1;
        return;
    }


    const start = arrayMapToNumber(time.temp.start);
    const end = arrayMapToNumber(time.temp.end);

    if (start[0] > end[0]) {
        showDialog({ message: '开始时间不允许大于结束时间' });
        return;
    }
    if (start[0] == end[0] && start[1] == end[1]) {
        showDialog({ message: '开始时间不允许等于结束时间' });
        return;
    }


    time.result.start = [...time.temp.start];
    time.result.end = [...time.temp.end];


    const startArr = [...time.temp.start];
    const endArr = [...time.temp.end];

    formData.time = [startArr, endArr];
    showTime = false;


    /**
     * 
     * 根据天数和小时数来确定加班小时
     * 如果当前时间包含 12:00 - 13:30 需要减去1.5小时
     * 如果当前时间包含 17:30 - 18:00 需要减去0.5小时
     * 
     */
    const ymd = dayjs().format("YYYY-MM-DD");
    const startTimeDay = dayjs(`${ymd} ${time.temp.start.join(":")}`);
    const endTimeDay = dayjs(`${ymd} ${time.temp.end.join(":")}`);


    let diffminute = endTimeDay.diff(startTimeDay, "m"); 
    
    
    

    if(dayjs(`${ymd} 12:00`).isAfter(startTimeDay)  && endTimeDay.isAfter(dayjs(`${ymd} 13:30`))){
        diffminute -= 90;
    }
    if(dayjs(`${ymd} 17:30`).isAfter(startTimeDay) && endTimeDay.isAfter(dayjs(`${ymd} 18:00`))){
        diffminute -= 30;
    }

    formData.hour = diffminute / 60
}


async function onSubmit() {


    const { length } = tableData;

    for (let i = 0; i < length; i++) {
        const element = tableData[i];

        const thisDate = element.startDate + element.endDate;

        for (let ii = i + 1; ii < length; ii++) {
            const diffElem = tableData[ii];

            if (thisDate === diffElem.startDate + diffElem.endDate) {
                showDialog({
                    message: `第${i + 1}行和第${ii + 1}行日期重复，请确认`
                });
                return;
            }

        }

    }


    const sendData: RowVO[] = [];

    for (let i = 0; i < length; i++) {

        const element = tableData[i];

        sendData.push({
            startDate: element.startDate,
            endDate: element.endDate,
            hour: parseFloat(element.hour as any),
            time: element.time,
            work: element.work
        })

    }

    const [err, result] = await to(createOvertime({
        time: sendData
    }));

    if (err) {
        showDialog({ message: err.message });
    } else {
        SubmitDone = true;
    }


}




function setDefaultDatePicker() {

    startCurrentDate = [];
    endCurrentDate = [];

    if (startCurrentDate.length == 0) {
        startCurrentDate = (formData.startDate || getDayjsYMD(dayjs())).split("-");
    }
    if (endCurrentDate.length == 0) {
        endCurrentDate = (formData.endDate || getDayjsYMD(dayjs())).split("-");
    }


    calendarDefault = [new Date(startCurrentDate.join("-")), new Date(endCurrentDate.join("-"))]
    onSelectDate(calendarDefault)

}

function setDefaultDateTime() {

    const splitArr = formData.time && [[...formData.time[0]], [...formData.time[1]]] || [[], []];


    if (time.temp.start.length == 0) {
        time.temp.start = (splitArr[0].length && splitArr[0]) || ["9", "00"]
    }
    if (time.temp.end.length == 0) {
        time.temp.end = (splitArr[1].length && splitArr[1]) || ["21", "00"]
    }

}

/** 时间选择器，把分钟设置成整数 */
function filter(type: any, options: any) {
    if (type === 'minute') {
        return options.filter((option: any) => Number(option.value) % 10 === 0);
    }
    return options;
}

watch($$(dateTabActive), (value) => {
    setDefaultDatePicker();
})
watch($$(timeTabsActive), (value) => {
    setDefaultDateTime();
})



</script>

<script lang="ts">
export default {
    name: "",
    title: "加班申请"
}
</script>

<style lang="scss">
.hairline-unset {
    position: absolute;
    width: 100%;
    height: 44px;
    top: 50%;
    transform: translateY(-50%);
    border: 1px solid #ebedf0;
    border: 1px solid red;
    border-width: 1px 0;
    pointer-events: none;
}



.van-popup {
    border-radius: 10px;
}

.van-popup.select-date {
    width: 70% !important;
    border-radius: 10px;

    // .title {
    //     font-size: 14px;
    //     font-weight: bold;
    // }

    // .cancellation button:last-child {
    //     margin-left: 10px !important;
    // }

    // .van-picker__mask {
    //     display: none;
    // }

    // .van-hairline-unset--top-bottom:after {
    //     border-color: black;
    // }


    // .el-time-spinner {
    //     .el-time-spinner__wrapper {
    //         width: 50% !important;
    //     }

    //     .el-time-spinner__wrapper:last-child {
    //         display: none;
    //     }
    // }


    .van-tabs__content {
        padding: 20px 0;
    }

    .van-picker__toolbar {
        display: none !important;
    }

    .cancellation .confirm {
        margin-left: 10px !important;
    }

}

.van-popup.form {
    width: 80%;
}
</style>

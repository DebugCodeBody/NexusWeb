<template>
    <div id="declare">
        <div class="declare-view">
            <h3 class="title">材多送料</h3>

            <el-form :model="form" label-width="auto" :disabled="startIng">
                <el-form-item class="time-input" v-if="false">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="成功间隔">
                                <el-input v-model="form.then" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="失败间隔">
                                <el-input v-model="form.catch" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>

                <template v-if="nowMoid">
                    <el-form-item label="扫描订单" v-if="nowMoid.orderid">
                        <span>{{ nowMoid.orderid }}</span>
                    </el-form-item>
                    <el-form-item label="扫描结果" class="result">
                        <el-tag v-if="nowMoid.success" type="success">{{ nowMoid.result }}</el-tag>
                        <el-tag v-else type="danger">{{ nowMoid.result }}</el-tag>
                    </el-form-item>
                </template>

                <el-form-item label="扫描结果" v-if="isDev">
                    <el-input v-model="form.value" @input="onValueInput" />
                </el-form-item>

                <el-form-item label="剩余时间">
                    <el-tag v-if="startIng">{{ nextTime / 1000 }} 秒</el-tag>
                    <el-tag type="warning" v-else>未开始</el-tag>
                </el-form-item>

                <el-result icon="error" title="本应用仅支持移动端" v-if="noMobile"></el-result>

            </el-form>
            <div class="button-area" v-if="!noMobile">

                <template v-if="!startIng">
                    <el-button type="primary" @click="onStartScann" v-if="!manual">开始扫描</el-button>
                    <el-button type="primary" @click="pushSubmit" v-else>提交</el-button>
                </template>

                <el-button type="warning" v-else @click="onStopScann">停止</el-button>
            </div>

            <div class="scann-table" ref="scannTable">
                <el-table :data="tableData" border :height="tableHeight" style="width: 100%" size="default">
                    <!-- <el-table-column prop="moid" label="工单号" align="center" /> -->
                    <el-table-column prop="orderid" label="订单号" align="center" />
                    <el-table-column prop="address" label="状态" align="center">
                        <template #default="{ row }">
                            <el-tag type="success" v-if="row.success">成功</el-tag>
                            <el-tag type="danger" v-else>{{ row.result }}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>


        </div>
    </div>
</template>

<script setup lang="ts">
import to from "await-to-js"
import { scanning } from "@/utils/other"
import { submit } from "@/api"

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'


let noMobile = false;
if (process.env.NODE_ENV == "production") {
    noMobile = ["pc", "notInDingTalk"].indexOf(dd.env.platform) > -1;
}


const form = $ref({
    then: 3,
    catch: 5,
    value: ""
})


let isDev = process.env.NODE_ENV != "production";
let audio = document.createElement("audio");
let scannTable = $ref<HTMLDivElement>();

let tableHeight = $ref(0);
let manual = $ref(false);
let nextTime = $ref(0);
let startIng = $ref(false);
let Interval = 0;

const thenTime = $computed(() => {
    return form.then * 1000;
})

const catchTime = $computed(() => {
    return form.catch * 1000;
})

const tableData = $ref<any[]>([]);
const nowMoid = $computed(() => {
    calculateTable();

    return tableData[0];
})


async function loagding(callBack: any) {

    const loading = ElLoading.service({
        lock: true,
        text: '正在提交',
        background: 'rgba(0, 0, 0, 0.7)',
    })

    try {
        await callBack();
    } finally {
        loading.close();
    }

}



async function pushSubmit() {


    return new Promise((resolve, reject) => {


        loagding(async () => {
            const moid = form.value;


            let errorMessage = "";
            const [err, data] = await to(submit(moid))

            if (err) {
                errorMessage = (err as any).msg || err.message || "扫描失败，请重试";
            } else {
                if (!data.success) {
                    data.orderid = moid;
                    errorMessage = data.result
                } else {
                    audio.play();
                }
                tableData.unshift(data)
            }

            if (errorMessage) {
                ElMessageBox.confirm(
                    errorMessage,
                    '错误',
                    {
                        confirmButtonText: '确定',
                        type: 'error',
                        center: true,
                        "showCancelButton": false,
                        "customClass": "mobile-Message-box"
                    }
                ).then(resolve)

            } else {
                resolve();
            }

        })

    })



}

function onValueInput(value: string) {
    manual = !!value;
}

function timeScann(time: number) {

    return new Promise<string>((resolve, reject) => {

        function runIng() {
            scanning().then(resolve).catch(reject);
        }

        if (time == 0) {
            runIng();
        } else {
            nextTime = time;
            time = time - 1000;

            Interval = setInterval(() => {
                if (time == 0) {
                    clearInterval(Interval);
                    runIng();
                } else {
                    nextTime = time;
                    time = time - 1000;
                }
            }, 1000)

        }

    })
}

function thenScan(value: string) {


    dd.device.notification.vibrate({
        duration: 300,
        onSuccess: function () {
        },
        onFail: function () { }
    })
    form.value = value;


    pushSubmit().then(() => {
        timeScann(thenTime).then(thenScan).catch(catchScan);
    })

}

function catchScan() {
    timeScann(catchTime).then(thenScan).catch(catchScan)
}

function onStartScann() {
    manual = false;

    setTimeout(() => {
        startIng = true;
    })
    timeScann(0).then(thenScan).catch(catchScan);
}

function onStopScann() {
    clearInterval(Interval);
    startIng = false;
}

function calculateTable() {
    tableHeight = 0;
    setTimeout(() => {
        tableHeight = scannTable.clientHeight;
    })
}

onMounted(() => {

    calculateTable();

    const source = document.createElement("source");


    if (process.env.NODE_ENV == "production") {
        source.src = "../../media/voice/scann_succeed.wav"
    } else {
        source.src = "./media/voice/scann_succeed.wav"
    }

    audio.appendChild(source);



})

</script>

<script lang="ts">
export default {
    name: "",
    title: "材多送料"
}
</script>

<style lang="scss">
.el-overlay.is-message-box .el-overlay-message-box{
    display: flex;
    justify-content: center;
    align-items: center;

    .el-message-box{
        width: 80%;
    }
}

#declare {
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

        padding-top: 5px;
        max-width: 800px;
        padding-bottom: 10px;
        margin: auto;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;


    }

    .el-result {
        max-width: 800px;
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        position: relative;
        padding: 10px;
        height: 300px;

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

    form {
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        position: relative;
        padding: 10px;

        &.grouperror {
            height: 350px;
        }

        .el-result {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(255, 255, 255);
        }

        .el-select {
            * {
                user-select: none;
            }
        }

        .time-input {
            &>.el-form-item__label-wrap {
                display: none;
            }
        }

        .result .el-tag__content {
            font-size: 20px;
        }
    }

    .fun-area {
        .el-button {
            margin: auto;
            display: inherit;
            margin-top: 20px;
            width: 100%;
            height: 100%;
        }
    }


    .upload {

        .el-upload,
        .el-upload-list__item-actions,
        .el-upload-list li {
            height: 80px;
            width: 80px;
            line-height: 80px;
        }

        .el-icon-plus {
            font-size: 20px;
        }
    }

    textarea {
        height: 100px;
        resize: none;
    }

    .el-result {
        z-index: 999;
    }

    .button-area {
        margin: 10px 0px;
        display: flex;

        button {
            width: 100%;
        }
    }


    .scann-table {
        flex: 1;
    }


}
</style>

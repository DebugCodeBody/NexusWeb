<template>
    <div id="preview"></div>

    <div id="addres-container" ref="addresContainer" v-if="custid">
        <div class="content">
            <el-form label-width="auto" :hide-required-asterisk="true">
                <el-form-item label="客户：" v-if="name">
                    <div style="display:flex;width:100%;">
                        <div style="flex:1"><span>{{ name }}</span></div>
                        <div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="客户地址：" v-if="sndaddr">
                    <span>{{ sndaddr }}</span>
                </el-form-item>
                <el-form-item label="收获地址：" v-if="taxsendaddr">
                    <span>{{ taxsendaddr }}</span>
                </el-form-item>
                <el-form-item label="当前定位：">
                    <div class="position">
                        <span>{{ formattedAddress }}</span>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div style="display:flex; justify-content: flex-end; width: 100%">
                        <el-button type="primary" class="submit-button" :disabled="!formattedAddress"
                            :loading="submitLoading" @click="onClickEditAddress"
                            v-if="!positionError && !done">提交地址</el-button>


                        <el-tag type="danger" v-if="positionError">定位失败</el-tag>
                    </div>
                </el-form-item>
            </el-form>

        </div>
    </div>

    <div class="result-container" v-if="done">
        <el-result icon="success" title="成功" sub-title="修改地址成功">
            <template #extra>
                <el-button type="success" class="submit-button" @click="done = false">重新修改</el-button>
            </template>
        </el-result>
    </div>
</template>

<script setup lang="ts">
import to from "await-to-js"

import { getKey, editCustInfo } from "@/api"

import baiduMap from "@/mapSdk/baidu"
import gaodeMap from "@/mapSdk/gaode"
import tencentMap from "@/mapSdk/tencent"
import getSearch from "@/utils/urlSearch"
import SparkMD5 from 'spark-md5'

import { ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'

import { MessageBoxWarning, MessageBoxError, messageError } from "@/utils/elementLib"





const mapViewTable: Record<string, any> = {
    "gaode": gaodeMap as any,
    "baidu": baiduMap as any,
    "tencent": tencentMap as any,
}

const addresContainer = $ref<any>();
let type = getSearch("type");
if (process.env.NODE_ENV != "production") {
    if (!type) {
        type = "gaode";
    }
}



let mapNewView = mapViewTable[type];
if (!mapNewView) {
    type = "gaode";
    mapNewView = mapViewTable[type];
}

let setting = $ref(false);

const formEl = $ref<FormInstance>();
const form = $ref({
    lat: "",
    lan: ""
});
const name = getSearch("name");
const sndaddr = getSearch("sndaddr");
const taxsendaddr = getSearch("taxsendaddr");
const toUrl = getSearch("to");
const custid = getSearch("id")
const token = getSearch("token")
const time = getSearch("time")

let phone = getSearch("phone");
let reqid = getSearch("reqid");


let positionError = $ref(false);
let submitLoading = $ref(false);
let done = $ref(false)


let formattedAddress = $ref("");

const mapView = (new mapNewView) as InstanceType<typeof gaodeMap>;

/** 经纬度坐标 */
let mapPosition: any;

async function onClickEditAddress() {
    let [err] = await to(MessageBoxWarning("确定修改客户地址信息？"));
    if (err) {
        return;
    }
    const sendData = {
        id: custid,
        address: formattedAddress,
        origin: [mapPosition.lat, mapPosition.lng].join(","),
        time,
        token,
        km: 0
    }

    submitLoading = true;

    AMap.plugin('AMap.GeometryUtil', async () => {

        var distance = AMap.GeometryUtil.distance([mapPosition.lng, mapPosition.lat], [113.760532, 22.769619]);

        sendData.km = distance / 1000;

        const [sendErr] = await to(editCustInfo(sendData));
        if (sendErr) {
            submitLoading = false;
            return;
        }

        ElMessageBox.confirm(
            '修改成功',
            '成功',
            {
                showConfirmButton: false
            }
        )

        done = true
        submitLoading = false;

    });

}


async function init() {
    let start = getSearch("start");

    const [error, response] = await to(getKey(type));
    if (error) {
        ElMessageBox.confirm(
            '获取key错误，联系管理员',
            '错误',
            {
                type: 'error',
                showConfirmButton: false
            }
        )
        return;
    }
    if (!start) {
        start = response.location;
    }




    function moveAmapControl() {
        setTimeout(() => {
            document.querySelector<HTMLDivElement>(".amap-control")!.style.bottom = `${(25 + addresContainer.clientHeight)}px`;
        })
    }

    function setZoomAndCenter(position: any) {


        moveAmapControl();
        mapPosition = position;
        mapView.setZoomAndCenter(position);
        mapView.getAddress(position).then((result: any) => {

            positionError = false;

            formattedAddress = result.formattedAddress;
            moveAmapControl();

        }).catch(() => {
            positionError = true;

            moveAmapControl();
            alert("获取地址失败")
        })
    }

    mapView.init(response).then(() => {

        mapView.create("preview");
        mapView.Geolocation(setZoomAndCenter, (error: string) => {
            if (error == "User denied Geolocation") {
                positionError = true;
                alert("您已拒绝定位权限，无法获取地址")
            } else {
                alert("定位失败：" + error)
            }
            moveAmapControl();
        })

        mapView.onClick(setZoomAndCenter);

    }).catch((err) => {

        ElMessageBox.confirm(
            '获取地图SDK错误，请重试',
            '错误',
            {
                type: 'error',
                showConfirmButton: false
            }
        )

    })

}

function getDiffDay() {
    // 获取当前日期
    const today = new Date();
    // 获取1899-12-30的日期
    const baseDate = new Date(1899, 11, 30);
    // 计算两个日期之间的毫秒数差值
    const timeDiff = today.getTime() - baseDate.getTime();
    // 计算天数
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
}


if (process.env.NODE_ENV != "production") {

    init();

} else {

    if (custid && token && time) {


        if (getDiffDay() - parseInt(time) > 3 || token != SparkMD5.hash(custid)) {

            ElMessageBox.confirm(
                '信息校验失败，请联系管理员',
                '错误',
                {
                    type: 'error',
                    showConfirmButton: false,
                    center: true
                }
            )

        } else {
            init();
        }



    } else {

        ElMessageBox.confirm(
            '不允许直接访问本网页',
            '错误',
            {
                type: 'error',
                showConfirmButton: false,
                center: true
            }
        )

    }

}



</script>

<script lang="ts">
export default {
    name: "",
    title: "修改客户地址"
}
</script>

<style lang="scss">
#preview,
.el-row,
.el-col {
    height: 100%;
}

#addres-container {
    position: absolute;
    bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .content {
        width: 95%;
        background-color: white;
        padding: 10px;
        border-radius: 5px;
        box-sizing: border-box;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }

    .el-form-item--large {
        margin-bottom: 5px;
    }

    .el-form-item--large .el-form-item__label {
        height: auto;
    }

    .el-form-item__label {
        padding-right: 0;
    }

    .el-form-item__label,
    .el-form-item__content {
        line-height: 20px;
    }

    .position {
        justify-content: center;
        width: 100%;

        .address {
            flex: 1;
        }

        button {
            margin-left: 10px;
        }
    }

    .submit-button {
        margin-top: 10px;
    }


}

#preview {

    .amap-logo,
    .amap-copyright {
        display: none !important;
    }

}

.result-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
}
</style>

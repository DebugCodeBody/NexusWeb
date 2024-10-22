<template>
    <div id="preview"></div>

    <div id="addres-container" ref="addresContainer">
        <div class="content">
            <el-form label-width="auto" :hide-required-asterisk="true">

                <el-form-item label="客户名：">
                    <span>{{ custName }}</span>
                </el-form-item>
                <el-form-item label="订单号：" v-if="orderid">
                    <span>{{ orderid }}</span>
                </el-form-item>
                <el-form-item label="送货定位：">
                    <div class="position">
                        {{ formattedAddress }}
                    </div>
                </el-form-item>
                <el-form-item label="输入定位：">
                    <div class="position">
                        <el-input v-model="inputAddress"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="手机号码：">
                    <div class="position phone">
                        <el-input v-model="phone"></el-input>
                    </div>
                </el-form-item>


                <el-form-item>
                    <div style="display:flex; justify-content: flex-end; width: 100%">
                        <el-button type="primary" class="submit-button" :disabled="!formattedAddress && !inputAddress"
                            :loading="submitLoading" @click="onClickEditAddress"
                            v-if="!positionError && !done">提交地址</el-button>

                        <el-tag type="danger" v-if="positionError">定位失败</el-tag>
                    </div>
                </el-form-item>
            </el-form>

        </div>
    </div>

    <div class="edituser search" v-if="showSearch">

        <div class="flex">
            <el-input v-model="searchInput" :prefix-icon="Search" placeholder="搜索地点" clearable
                ref="SearchInputEl"></el-input>
            <el-select v-model="searchCity" :popper-class="'edituser_search-pop'">
                <el-option v-for="item in modelArr" :key="item.label" :label="item.label" :value="item.city" />
            </el-select>
        </div>
        <div id="search-list">

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
import { Search } from '@element-plus/icons-vue'

import to from "await-to-js"

import { getKey, editUserInfo, getCustName } from "@/api"

import baiduMap from "@/mapSdk/baidu"
import gaodeMap from "@/mapSdk/gaode"
import tencentMap from "@/mapSdk/tencent"
import getSearch from "@/utils/urlSearch"

import { ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'

import { MessageBoxWarning, messageError } from "@/utils/elementLib"
import { debounce } from "@/utils/other"






const mapViewTable: Record<string, any> = {
    "gaode": gaodeMap as any,
    "baidu": baiduMap as any,
    "tencent": tencentMap as any,
}

const addresContainer = $ref<any>();
let type = getSearch("type");
let reqid = getSearch("reqid");

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


const SearchInputEl = $ref<any>();
const userid = getSearch("userid");
const custid = getSearch("custid");
const orderid = getSearch("orderid");

const phone = $ref(getSearch("phone"));


let custName = $ref("");


let positionError = $ref(false);
let submitLoading = $ref(false);
let done = $ref(false)


let formattedAddress = $ref("");
let inputAddress = $ref("");

const mapView = (new mapNewView) as InstanceType<typeof gaodeMap>;


/** 经纬度坐标 */
let mapPosition: any;

let modelArr = $ref([
    {
        label: "东莞",
        city: "0769"
    }, {
        label: "深圳",
        city: "0755"
    }, {
        label: "广州",
        city: "020"
    }]);


let showSearch = $ref(false);
let searchInput = $ref("");
let searchCity = $ref(modelArr[0].city);


let start = getSearch("start");


const onSearch = debounce((value: string) => {


    if (!value) {
        mapView.clearPlaceSearch();
        return;
    }

    mapView.placeSearch(mapView.createPoint(start), value, searchCity);

}, 500);

watch($$(searchInput), onSearch);
watch($$(searchCity), () => {
    onSearch(searchInput);
});



async function onClickEditAddress() {
    let [err] = await to(MessageBoxWarning("确定修改客户地址信息？"));
    if (err) {
        return;
    }

    


    const sendData = {
        address: inputAddress || formattedAddress,
        origin: [mapPosition.lat, mapPosition.lng].join(","),
        userid,
        custid,
        orderid,
        km: 0,
        phone,
        reqid
    }

    submitLoading = true;

    AMap.plugin('AMap.GeometryUtil', async () => {

        var distance = AMap.GeometryUtil.distance([mapPosition.lng, mapPosition.lat], [113.760532, 22.769619]);

        sendData.km = distance / 1000;

        const [sendErr] = await to(editUserInfo(sendData));
        if (sendErr) {
            submitLoading = false;
            return;
        }



        done = true
        submitLoading = false;

    });

}


async function init() {
    const end = getSearch("end");
    const origin = getSearch("origin") || "7";

    getCustName(custid).then(({ name }) => {
        custName = name;
    })


    const [error, response] = await to(getKey(type, origin));
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
            alert("获取地址失败");

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
        }, false)


        if (end) {
            mapView.driving(start, end).then(() => {
            })
        } else {
            setTimeout(() => {
                mapView.setZoomAndCenter(mapView.createPoint(start));
            })
        }

        mapView.onClick(setZoomAndCenter);


        mapView.placeClick = (item: any) => {

            setZoomAndCenter(item.location);


        };


        setTimeout(() => {
            moveAmapControl();
            showSearch = true;


        })

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


init();


// watch($$(showSearch), () => {
//     nextTick(() => {
//         const id = "SearchInputEl";
//         SearchInputEl.$refs.input.id = id;

//         mapView.initAutoComplete(id);
//     })
// })


onMounted(() => {






})



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

    .phone.position {
        width: 180px;
    }

    .el-input__inner {
        line-height: 32px;
        height: 32px;
    }


}

#preview {

    .amap-logo,
    .amap-copyright {
        display: none !important;
    }

}



.edituser.search {
    width: 400px;

    .flex {
        display: flex;
    }

    .el-select {
        margin-left: 5px;
    }
}

.edituser_search-pop {
    z-index: 9999 !important;
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

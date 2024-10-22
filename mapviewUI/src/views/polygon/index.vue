<template>
    <div id="preview">

    </div>

    <div class="polygon-content flex" ref="addresContainer">
        <!-- <el-icon @click="onClickTest">
            <Search />
        </el-icon> -->

        <div class="content">
            <el-button @click="onClickNewRange" size="default" :disabled="polygonData.isEdit"
                v-if="!polygonData.isAdd">新建范围</el-button>
            <el-button @click="onClienEndRange" size="default" type="warning" v-else>取消新建</el-button>

            <el-button @click="onEndEditor" size="default" v-if="polygonData.isEdit">完成编辑</el-button>
            <el-button @click="onStartEditor" size="default" :disabled="true" v-else>编辑</el-button>

            <el-button @click="onDelete" size="default" :disabled="!polygonData.isEdit">删除</el-button>
        </div>
    </div>



    <div class="search" v-if="showSearch">
        <el-input v-model="searchInput" :prefix-icon="Search" placeholder="搜索地点" clearable></el-input>
        <div id="search-list">

        </div>
    </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

import to from "await-to-js"

import { getKey } from "@/api"

import baiduMap from "@/mapSdk/baidu"
import gaodeMap from "@/mapSdk/gaode"
import tencentMap from "@/mapSdk/tencent"
import getSearch from "@/utils/urlSearch"


import { ElMessageBox } from 'element-plus';

import { MessageBoxWarning } from "@/utils/elementLib"
import { debounce } from "@/utils/other"
import CURD from "@/utils/CURD"
import { getList, add, edit, del } from "@/api/polygon"



const mapViewTable: Record<string, any> = {
    "gaode": gaodeMap as any,
    "baidu": baiduMap as any,
    "tencent": tencentMap as any,
}

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


let showSearch = $ref(false);
let searchInput = $ref("");
let actio = $ref(getSearch("actio"));

let startPoint = "";
const end = getSearch("end");

const mapView = (new mapNewView) as InstanceType<typeof gaodeMap>;
let polyEditor: any;
let mapPosition: any;
let positionError: any;
let formattedAddress: any;
const addresContainer = $ref<HTMLDivElement>()
const polygonData = $ref(new CURD());



async function init() {
    let start = getSearch("start");
    const origin = getSearch("origin") || "7";

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


    function setZoomAndCenter(position: any) {


        mapPosition = position;
        mapView.setZoomAndCenter(position);
        mapView.getAddress(position).then((result: any) => {

            positionError = false;
            formattedAddress = result.formattedAddress;

        }).catch(() => {
            positionError = true;
            alert("获取地址失败")
        })
    }



    startPoint = start;
    mapView.init(response).then(() => {



        mapView.create("preview");
        mapView.Geolocation(setZoomAndCenter, (error: string) => {

            // if (error == "User denied Geolocation") {
            //     positionError = true;
            //     alert("您已拒绝定位权限，无法获取地址")
            // } else {
            //     alert("定位失败：" + error)
            // }

        })


        polyEditor = window.polyEditor = new AMap.PolyEditor(window.map, new AMap.Polygon());


        getList().then((data: any[]) => {

            data.forEach((item: any) => {
                createPolygon(item.polygon, item.id);
            })

            polygonData.setData(data);

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



const rangeMarker: any[] = [];
const rangePosition: any[] = [];

async function onClickNewRange() {

    const [err] = await to(ElMessageBox.confirm(
        '请在地图上选中三个位置构成一个范围',
        '提示',
        {
            center: true
        }
    ))
    if (err) {
        return;
    }


    rangePosition.length = 0;
    rangeMarker.length = 0;

    polyEditor.close();
    polygonData.startAdd();


    mapView.onClick((position: any) => {

        const marker = mapView.addMarker(position);

        rangePosition.push(position);
        const length = rangeMarker.push(marker);

        if (length >= 3) {



            mapView.removeMarker(rangeMarker);

            onClienEndRange();
            add(rangePosition).then((data) => {

                createPolygon(data.polygon, data.id);


            })


        }

    })

}

async function onClienEndRange() {

    polygonData.endAdd();
    polyEditor.close();
    mapView.removeMarker(rangeMarker);
    mapView.onClick(undefined);


}


function onStartEditor(item: any) {
    polyEditor.setTarget(item.polygon);
    polygonData.startEdit(item);
    window.polyEditor.open();

}


function onEndEditor() {
    polyEditor.close();
    polygonData.endEdit();


    edit(polygonData.editData.id, polygonData.editData.polygon.getPath()).then(() => {

    }).catch(() => {

    })

}


async function onDelete() {

    let [err] = await to(ElMessageBox.confirm(
        '确定要删除此范围？',
        '提示',
        {
            type: 'warning',
            center: true
        }
    ));
    if (err) {
        return;
    }


    del(polygonData.editData.id).then(() => {

        polyEditor.close();
        polygonData.endEdit();
        polygonData.editData.polygon.remove();


    }).catch(() => {

    })

}



function createPolygon(path: any, id?: number) {


    const newPolygon = new AMap.Polygon({
        path: path,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
        zIndex: 50,
    });


    newPolygon.on('dblclick', () => {
        if (polygonData.isEmpty) {
            onStartEditor({
                polygon: newPolygon,
                id
            });
        }
    })

    mapView.map.add(newPolygon);
    mapView.map.setFitView();
    polyEditor.setTarget(newPolygon);


    return newPolygon;


}



watch($$(searchInput), debounce((value: string) => {

    if (!value) {
        mapView.clearPlaceSearch();
        return;
    }

    mapView.placeSearch(mapView.createPoint(startPoint), value);

}, 500))



init();



</script>

<script lang="ts">
export default {
    name: "",
    title: "地图规划路线"
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
    justify-content: center;

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



}

#preview {

    .amap-logo,
    .amap-copyright {
        display: none !important;
    }

}

div.search {
    position: absolute;
    left: 15px;
    top: 15px;
    width: 360px;

}

.polygon-content {
    position: absolute !important;
    z-index: 99;
    // border-radius: 50%;

    // height: 32px !important;
    // width: 32px !important;

    // background-color: white;
    // box-shadow: 0 0 5px silver;

    cursor: pointer;

    // bottom: 20px;


    display: flex;

    width: 100%;
    bottom: 20px;
    box-sizing: border-box;

    .content {
        margin: 0 10px;
        padding: 10px;
        width: 100%;
        background-color: white;
        box-shadow: 0 0 5px silver;
        border-radius: 5px;

        .el-button {
            margin-left: 0;
            margin-right: 10px;

            &:last-child {
                margin-right: 0;
            }
        }

    }
}

.amap-control {
    bottom: 15% !important;
}
</style>

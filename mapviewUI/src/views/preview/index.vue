<template>
    <div id="preview">

    </div>

    <!-- <el-icon class="icon-search" @click="onClickTest">
        <Search />
    </el-icon> -->

    <div class="preview-search" v-if="showSearch">
        <el-input v-model="searchInput" :prefix-icon="Search" placeholder="搜索地点" clearable></el-input>
        <div id="search-list">
        </div>
    </div>

    <div class="preview-features" v-if="toAppPlan.length">
        <el-button type="primary" plain >
            <a :href="`amapuri://route/plan/?dlat=${toAppPlan[0]}&dlon=${toAppPlan[1]}&dev=0&t=0`">打开地图</a>
        </el-button>
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

import popDialog from "global@/popDialog/index.vue"

import { ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'

import { MessageBoxWarning } from "@/utils/elementLib"
import { debounce } from "@/utils/other"



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
const mapView = (new mapNewView) as InstanceType<typeof gaodeMap>;

/** 跳转app的坐标 */
let toAppPlan = $ref<string[]>([]);


async function init() {
    let start = getSearch("start");
    const end = getSearch("end");
    const origin = getSearch("origin") || "7";


    if (!origin) {
        ElMessageBox.confirm(
            '请填写起点ID再访问本页面！',
            '错误',
            {
                type: 'error',
                showConfirmButton: false
            }
        )
        return;
    }

    if (start == "" && end == "") {
        ElMessageBox.confirm(
            '请填写经纬度再访问本页面！',
            '错误',
            {
                type: 'error',
                showConfirmButton: false
            }
        )
        return;
    }


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

    startPoint = start;
    mapView.init(response).then(() => {



        const endPoint = mapView.createPoint(end);


        toAppPlan = [endPoint.lat, endPoint.lng];



        // //gaode
        // mapView.driving("113.771872,22.788057","113.774992,22.791545");
        // type=gaode&start=113.771872%2C22.788057&end=113.774992%2C22.791545


        // baidu
        // mapView.driving("113.77818963880439,22.794252351960615","113.781183,22.811404");
        // start=113.77818963880439%2C22.794252351960615&end=113.781183%2C22.811404

        // tencent
        // mapView.driving("22.788019,113.771759","113.772929,22.787859");
        // start=22.788019%2C113.771759&end=22.787859%2C113.772929

        mapView.create("preview");
        mapView.driving(start, end).then(() => {

            showSearch = true;

            const toMarker = document.querySelector(".amap-lib-marker-to")!;


            toMarker.addEventListener("click", () => {

                ElMessageBox.confirm(
                    '是否需要跳转到高德APP',
                    '提示',
                    {
                        type: 'warning',
                        center: true
                    }
                )


            }, true)




        }).catch(() => {

            ElMessageBox.confirm(
                '线路图绘制失败，请重试！\r\n如果多次出现请联系管理员',
                '错误',
                {
                    type: 'error',
                    showConfirmButton: false
                }
            )

        });


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



function onClickTest() {

    var path = [
        [116.403322, 39.920255],
        [116.410703, 39.897555],
        [116.402292, 39.892353],
        [116.389846, 39.891365]
    ]
    var polygon = new AMap.Polygon({
        path: path,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
        zIndex: 50,
    })
    window.map.add(polygon);
    window.map.setFitView([polygon]);
    const polyEditor = window.polyEditor = new AMap.PolyEditor(window.map, polygon)

    debugger;
    polyEditor.on('addnode', function (event: any) {
        console.log('addnode', event)
    })

    polyEditor.on('adjust', function (event: any) {
        console.log('adjust', event)
    })

    polyEditor.on('removenode', function (event: any) {
        console.log('removenode', event)
    })

    polyEditor.on('end', function (event: any) {
        console.log('end', event)
    })


    polyEditor.open();
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

div.preview-search {
    position: absolute;
    z-index: 6201;
    left: 15px;
    top: 15px;
    width: 80%;
    max-width: 360px;


}

.preview-features {
    position: absolute;
    bottom: 15px;
    left: 15px;

    a {
        color: inherit;
        text-decoration: inherit;
    }

}

.icon-search {
    position: absolute !important;
    z-index: 99;
    border-radius: 50%;
    height: 32px !important;
    width: 32px !important;
    background-color: white;
    box-shadow: 0 0 5px silver;
    cursor: pointer;
    right: 20px;
    bottom: 20px;
}
</style>

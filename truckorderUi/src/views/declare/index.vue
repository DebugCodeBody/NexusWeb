<template>
    <div class="w-full h-full flex flex-col truck-ord">

        <div class="w-full mb-10px ">
            <el-card class="box-card text-14px">
                <div class="w-full h-full flex justify-between items-center">
                    <span>
                        订单数：{{ orderItems.length }}
                    </span>
                    <span>
                        <el-button type="success" size="small" @click="loadInit">刷新</el-button>
                    </span>
                </div>
            </el-card>
        </div>

        <div class="flex-1 p-10px pt-0 overflow-auto">
            <template v-if="orderClassItems.length > 0">

                <div class="mb-10px " v-for="(item, index) in orderClassItems" :key="index">

                    <el-card class="box-card">
                        <template #header>

                            <div class="flex justify-between header" v-for="orderInfo in item" :key="orderInfo.orderid">
                                <div class="title font-bold">
                                    {{ orderInfo.orderid }}
                                    <span class="direction" v-if="orderInfo.deli_direction">
                                        {{ (orderInfo.deli_direction || "").slice(0, 4) }}
                                    </span>
                                </div>
                                <el-button type="primary" size="small" @click="onClickDone(orderInfo)">完成</el-button>
                            </div>

                            <el-button class="button_open-map-app" type="primary" plain size="small"
                                v-if="item[0].sndname"><a :href="gaodeUrl(item[0])">打开地图</a></el-button>



                        </template>

                        <el-form :model="item" label-width="auto" :hide-required-asterisk="true">
                            <el-form-item label="客户：" v-if="item[0].custname || item[0].phone">
                                <span class="mr-10px" v-if="item[0].custname">{{
                                    getCustName(item[0].custname, item[0].phone)
                                }}</span>
                                <span class="phone">
                                    <a :href="'tel:' + item[0].phone">{{ item[0].phone }}</a>
                                </span>
                            </el-form-item>
                            <el-form-item label="定位：" v-if="item[0].sndname">
                                <div>{{ item[0].sndname }}</div>
                            </el-form-item>

                            <!-- 如果有收获地址，那就不显示客户地址 -->
                            <el-form-item label="客户地址：" v-if="!item[0].taxsendaddr && item[0].sndaddr">
                                <div>{{ item[0].sndaddr }}</div>
                            </el-form-item>

                            <el-form-item label="收货人：" v-if="item[0].taxsendman">
                                <div class="mr-10px" v-if="item[0].taxsendman">
                                    {{ getCustName(item[0].taxsendman, item[0].receivephone) }}
                                </div>
                                <span class="phone">
                                    <a :href="'tel:' + item[0].receivephone">{{ item[0].receivephone }}</a>
                                </span>
                            </el-form-item>
                            <el-form-item label="收货地址：" v-if="item[0].taxsendaddr">
                                <div>
                                    {{ item[0].taxsendaddr }}
                                </div>
                            </el-form-item>

                            <div style="position: relative;">
                                <div style="display:flex; justify-content: space-between; width: 100%;">
                                    <el-button size="small" @click="onClickEditInfo(item[0])">修改定位信息</el-button>
                                    <el-button type="danger" size="small" @click="onClickDoneAll(item)"
                                        v-if="item.length > 1">全部完成</el-button>
                                </div>
                                <el-button class="carexpense" size="small" type="warning"
                                    @click="onClickToCarexpense(item[0])" v-if="iscomppay(item)">出车报销</el-button>

                            </div>
                        </el-form>


                    </el-card>
                </div>

            </template>
            <el-empty description="暂无数据" v-else />
        </div>


    </div>
</template>

<script setup lang="ts">
import to from "await-to-js"
import { getList, submitDone } from "@/api"

import { copyText } from "@/utils/other"
import { MessageBoxWarning, messageSuccess,  } from "@/utils/elementLib";
import { loadService } from "@/utils/elementLib"
import dayjs from 'dayjs'
import SparkMD5 from 'spark-md5'






const orderItems = $ref<tackOrdItem[]>([])

const orderClassItems = $ref<tackOrdItem[][]>([])

const loadSubmit = loadService(submitDone);



/**
 * 把字符串上的手机号码给过滤掉
 * @param str 客户名字
 * @param phone 客户电话
 */
function getCustName(str: string, phone: string) {

    str = str || "";
    phone = phone || "";

    return str.replace(phone, "").trim();
}




async function onClickDone(item: tackOrdItem) {

    const [err] = await to(MessageBoxWarning(`确定要提交 <strong>${item.orderid}</strong> 此订单？`, "提示", true, {
        dangerouslyUseHTMLString: true,
    }));

    if (err) {
        return;
    }

    const [submitErr] = await to(loadSubmit(item.orderid));
    if (submitErr) {
        return;
    }

    messageSuccess("提交成功");
    loadInit();

}

async function onClickDoneAll(item: tackOrdItem[]) {

    const orderS = item.map((elem) => elem.orderid);


    const [err] = await to(MessageBoxWarning(`确定要提交 ${orderS.map((elem) => `<strong>${elem}</strong>`).join(", ")} 此订单？`, "提示", true, {
        dangerouslyUseHTMLString: true,
    }));

    if (err) {
        return;
    }

    const [submitErr] = await to(loadSubmit(orderS.join(",")));
    if (submitErr) {
        return;
    }

    messageSuccess("提交成功");
    loadInit();
}

async function onClickEditInfo(item: tackOrdItem) {

    // const [err] = await to(MessageBoxWarning(`确定要修改此用户的定位信息？`, "提示", true));

    // if (err) {
    //     return;
    // }



    const paramsObj: {
        [key: string]: string
    } = {
        "path": "editcust",
        "id": `${item.custid}`,
        "name": item.custname,
        "token": SparkMD5.hash(`${item.custid}`),
        "time": `${dayjs().startOf("days").diff(dayjs("1899-11-30").startOf("days"), "days")}`
    };

    if (item.taxsendaddr) {
        paramsObj.sndaddr = item.taxsendaddr;
    } else if (item.sndaddr) {
        paramsObj.sndaddr = item.sndaddr;
    }

    paramsObj.to = location.href;

    const parasmsArr = [];
    for (const [key, value] of Object.entries(paramsObj)) {
        parasmsArr.push(`${key}=${encodeURIComponent(value)}`)
    }

    location.href = `../../mapview?${parasmsArr.join("&")}`;


}

/** 跳转到出车审核 */
function onClickToCarexpense(item: tackOrdItem) {

    const { href } = location;


    const index = href.indexOf("/ding/");

    if (index == -1) {
        MessageBoxWarning("当前页面地址错误");
        return;
    }


    location.href = `${href.slice(0,21)}/nexus/carexpense/index.html?path=truckorder&orderid=${item.orderid}`

}





function iscomppay(item: tackOrdItem[]) {

    return !!item.find((elem) => (!!elem.iscomppay));

}

function onClickCopy(text: string) {
    copyText(text);
    messageSuccess("复制成功");
}



async function init() {
    const [respErr, response] = await to(getList());
    if (respErr) {
        return;
    }

    const addList: any[] = [];
    const sndaddrClass: any = {};
    response.forEach((elem: any) => {

        const classText = `${elem.sndname || ""}${elem.sndaddr || ""}${elem.receivephone || ""}${elem.custname || ""}`;
        sndaddrClass[classText] = sndaddrClass[classText] || [];
        sndaddrClass[classText].push(elem);

    })

    if (sndaddrClass[""]) {
        sndaddrClass[""].forEach((elem: any) => {
            addList.push([elem]);
        })
        delete sndaddrClass[""];
    }

    Object.values(sndaddrClass).forEach((elem: any) => {
        addList.push(elem);
    })


    orderClassItems.splice(0, orderClassItems.length, ...addList);

    orderItems.splice(0, orderItems.length, ...response);

}




const loadInit = loadService(init)


loadInit();



function getGCJ02_2(lng: number, lat: number) {
    var PI = Math.PI * 3000.0 / 180.0;
    var x = lng - 0.0065;
    var y = lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
}

function gaodeUrl(item: tackOrdItem) {

    if (item.sndlocate) {
        const split = item.sndlocate.split(",");
        if (split.length == 2 && split[0] && split[1]) {

            let parseArr = [parseFloat(split[0]), parseFloat(split[1])];


            // // 先把高德暂停
            // if (item.sndmap == 2) {
            //     parseArr = getGCJ02_2(parseFloat(split[0]), parseFloat(split[1]));
            // }

            return `amapuri://route/plan/?dlat=${parseArr[0]}&dlon=${parseArr[1]}&dev=0&t=0`
        }
    }

    return `amapuri://route/plan/?dname=${item.sndname}&dev=0&t=0`

}


</script>

<script lang="ts">


export default {
    name: "",
    title: "送货订单"
}
</script>

<style lang="scss">
.truck-ord {

    div.el-card__header,
    div.el-card__body {
        padding: 10px;
    }

    div.el-form-item {
        margin-bottom: 10px;

        .el-form-item__label {
            padding-right: 0;
        }

        .el-form-item__label,
        .el-form-item__content {
            line-height: 20px;
            height: 20px;
        }

        .el-form-item__content {
            height: auto;
        }
    }

    .phone {
        a {
            color: rgb(0, 0, 238);
            text-decoration: underline;
        }
    }

    .direction::before {
        content: "(";
    }

    .direction::after {
        content: ")";
    }

    .el-card__header {
        position: relative;

        .header {
            margin-bottom: 5px;
        }
    }

    .button_open-map-app,
    .carexpense {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .button_open-map-app {
        top: 12px;
    }

    .carexpense {
        top: 0 !important;
    }


}
</style>

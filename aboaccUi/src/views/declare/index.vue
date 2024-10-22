<template>
    <div class="h-full overflow-hidden no-md">
        <div class="mb-10px flex flex-col">
            <div class="flex">
                <div class="flex mr-10px">
                    <el-button type="danger" @click="onClickCance">注销登录</el-button>
                </div>
                <div>
                    <el-radio-group v-model="tableArr.value" @change="onRadioChange">
                        <el-radio 
                            v-for="(item, index) in tableArr.list" 
                            :key="item.label" 
                            :label="index"
                            :disabled="item.disabled"
                            :value="index">{{ item.label
                            }}</el-radio>
                    </el-radio-group>
                </div>
            </div>
        </div>

        <div class="flex-1 border p-10px">

            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>

        </div>

    </div>
</template>

<script setup lang="ts">

import 'element-plus/theme-chalk/display.css'


import { MessageBoxWarning } from "@/utils/elementLib"
import { wxCancel } from "@/api/user"


import { useRoute, useRouter } from 'vue-router'

import selectItem  from "@/store/data"



const router = useRouter();
const route = useRoute()



const tableArr = $ref<any>({
    value: 0,
    list: [
        {
            label: "待结账单表",
            path: "/head/check",
            disabled: false
        },
        {
            label: "待结明细",
            path: "/head/detail",
            disabled: true
        },
        {
            label: "下单明细表",
            path: "/deal/check",
            disabled: false
        },
        {
            label: "下单明细",
            path: "/deal/detail",
            disabled: true
        },

    ]
});

watch(() => route.path, (value) => {

    tableArr.value = tableArr.list.findIndex((elem: any) => elem.path === value);

}, {
    immediate: true
})


let md = $ref(false);

function onClickCance() {

    MessageBoxWarning("确定是要注销登录？").then(() => {

        wxCancel().finally(() => {
            location.href = `/ding/auth/wxapp/index.html?path=qrlogin&type=2&redirect=${encodeURIComponent(location.origin + location.pathname)}`
        })

    })


}




function onRadioChange(value: number) {

    const { path } = tableArr.list[value];

    router.push({
        path
    });

}


function getIsMd() {
    return window.innerWidth >= 992;
}


window.addEventListener("resize", () => {
    md = getIsMd();
});



window.headDetail = function (item: any) {

    selectItem.head.item = item;


    tableArr.list[1].disabled = false;


    const { path } = tableArr.list[1];

    router.push({
        path
    });

};

window.showDetail = function (item: any) {

    selectItem.deal.item = item;


    tableArr.list[3].disabled = false;

    const { path } = tableArr.list[3];

    router.push({
        path
    });

};


</script>

<script lang="ts">
export default {
    name: "",
    title: "精板对账"
}
</script>

<style scoped lang="scss">
.ba-data-table :deep(.el-button + .el-button) {
    margin-left: 6px;
}

.ba-data-table :deep(.table-header-cell) .cell {
    color: var(--el-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

}

.ba-data-table :deep(.el-table__row.urgent) .cell {
    color: red;

}


.el-col {
    height: 100%;
}

.col-table-wrap {

    display: flex;
    flex-direction: column;
    height: 100%;

    .title {
        font-size: 16px;
        text-align: center;
        margin-bottom: 10px;
        display: none;
    }

    .table-wrap {
        flex: 1;
        overflow: hidden;
    }


    .el-table {
        height: 100% !important;
    }
}

.no-md {

    display: flex;
    flex-direction: column;

    .el-row {
        flex: 1;

        overflow: hidden;


        .el-col {
            margin-bottom: 20px;
        }

    }



    .title {
        text-align: left;
    }

}
</style>

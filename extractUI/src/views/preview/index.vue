<template>
    <div id="preview">
        <el-tabs v-model="activeName" type="border-card" class="demo-tabs" @tab-change="onTabsChange" ref="tabsEl">

            <el-tab-pane v-for="item in tabList" :label="item.name" :name="item.id" :key="item.id"></el-tab-pane>

            <el-scrollbar>

                <template v-if="!loadError">
                    <template v-if="presentData.length || selectTag == 3">

                        <template v-if="selectTag == 10">
                            
                            <extract :data="presentData" />

                        </template>

                        <template v-else-if="selectTag == 20">
                            <undo :data="presentData" @clickItem="onClickExtract" />
                        </template>

                        <template v-else-if="selectTag == 3">
                            <cddun :tableData="cddunData"></cddun>
                        </template>
                        
                        <template v-else-if="selectTag == 40">
                            <not-yet-due :data="presentData" />
                        </template>

                        <template  v-else-if="selectTag == 50">
                            <out :data="presentData" />
                        </template>

                    </template>

                    <el-empty v-else description="暂无数据可操作"></el-empty>
                </template>

                <el-result v-else icon="error" subTitle="获取数据失败">
                    <template #extra>
                        <el-button type="primary" size="medium" @click="onTabsChange(activeName)">重试</el-button>
                    </template>
                </el-result>

            </el-scrollbar>

        </el-tabs>

        <extractDialog v-if="extractDialogShow" :extract="isExtract" />
        <allExtractDialog v-if="allExtractDialogShow" :extract="isExtract" />

        <el-button type="primary" :icon="Search" size="small" class="search-pane" ref="searchPane" v-if="false" />
    </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

import extract from "./extract/index.vue"
import undo from "./undo/index.vue"
import out from "./out/index.vue"
import notYetDue from "./notYetDue/index.vue"

import extractDialog from "./extractDialog.vue"
import allExtractDialog from "./allExtractDialog.vue"
import cddun from "./cddun.vue"

// @ts-ignore
import Hammer from "hammerjs";




import { localActive } from "@/store/data"
import { selectItem, extractDialogShow, allExtractDialogShow, getData, presentData } from "@/store/data"

const el = $ref(useCurrentElement());

const tabsEl = $ref<any>();
const searchPane = $ref<any>();



let selectTag = $ref(parseInt(localActive.get()));
let activeName = $ref(selectTag);
let loadError = $ref(false);
let tagIndex = 0;

const tabList = $ref([
    {
        name: "待提货",
        id: 10
    },
    {
        name: "已提货",
        id: 20
    },
    {
        name: "未到期",
        id: 40
    },
    {
        name: "缺货",
        id: 50
    },
    {
        name: "卸货仓库",
        id: 3
    }
])

const cddunData = $computed(() => {

    if (`${selectTag}` == "3") {

        const tableData = presentData.value.map((elem: any) => {
            return elem.value.map((item: any) => {

                return {
                    orderid: item.orderid,
                    mat_name: item.mat_name,
                    bcount: item.bcount,
                    bspec: item.bspec,
                    cutstorename: item.cutstorename
                }
            })
        })

        return [].concat(...tableData);


    } else {
        return []
    }
})

const isExtract = $computed(() => {
    return `${selectTag}` == "10";
})


function onTabsChange(value: string | number) {
    localActive.set(value);
    getData(value).then(() => {
        loadError = false;
        selectTag = value as any;
    }).catch(() => {
        loadError = true;
    })
}

function onClickExtract(item: any, all: boolean) {
    if (all) {
        allExtractDialogShow.value = true;
    } else {
        extractDialogShow.value = true;
    }
    selectItem.value = item;
}


function onSwipe(value: number) {

    tagIndex += value;

    if (tagIndex >= tabList.length) {
        tagIndex = 0
    } else if (tagIndex < 0) {
        tagIndex = tabList.length - 1;
    }

    activeName = tabList[tagIndex].id;


}




onMounted(() => {

    tagIndex = tabList.findIndex((item) => item.id == activeName);
    if (tagIndex == -1) {
        tagIndex = 0;
        activeName = tabList[0].id;
    }




    onTabsChange(activeName);

    if (searchPane) {
        nextTick(() => {
            document.querySelector(".el-tabs__nav")!.appendChild(searchPane.$el)
        })
    }

    // @ts-ignore
    const hammertime = new Hammer(el);
    function switchTag(value: number) {

        return () => {

            onSwipe(value);

        }

    }


    hammertime.on('swiperight', switchTag(-1));
    hammertime.on('swipeleft', switchTag(1));



})







</script>

<script lang="ts">
export default {
    name: "",
    title: "采购提货"
}
</script>

<style lang="scss">
#preview,
.el-tabs {
    height: 100%;
}


#preview {

    .el-tabs__nav {
        width: 100%;

        .search-pane {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
        }
    }




    .el-tabs {
        margin: auto;
        max-width: 1000px;
        display: flex;
        flex-direction: column;

        .el-tabs__content {
            flex: 1;
        }

        .el-tabs__content {
            padding: 10px;
            box-sizing: border-box;
        }

        .el-tab-pane {
            overflow: hidden;
        }

    }

    .el-card.box-card {
        margin-bottom: 10px;

        .el-card__header {
            padding: 10px;
        }



        .card-header {
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;



            .num {
                margin-left: 5px;
                font-weight: bold;
            }


            .map-button{
                position: absolute;

                left: 50%;

            }
        }

        .card-header-two{
            text-align: right;
            margin-top: 10px ;
        }

        .el-card__body .box-item-card .el-card__body {
            font-size: 12px;
            padding: 0px;


            div.item {
                padding: 10px;
                border-bottom: 1px solid #ddd;
                box-sizing: border-box;

                span {
                    width: 50%;
                    display: inline-block;
                }
            }

            div.operation {
                padding: 10px;
                display: flex;
                justify-content: flex-end;
            }


            .el-form-item {
                margin-bottom: 0;
                padding: 5px 0;
                border-bottom: 1px solid #ddd;

                .el-form-item__label {
                    padding: 0;
                    padding-left: 10px;
                }

                // .el-form-item__label-wrap{
                //     margin-left: 0 !important;
                // }

                &>.el-form-item__content {
                    .el-form-item {
                        width: 50%;
                        border-bottom: none;
                    }
                }

            }

        }

        .el-card__body {
            padding: 10px;

            .box-item-card {
                margin-bottom: 10px;
            }
        }


        &.hide {

            .el-card__body {
                padding: 0;
                height: 0;
            }

        }

    }

    .el-scrollbar__wrap--hidden-default {
        touch-action: pan-y !important;
    }

}
</style>

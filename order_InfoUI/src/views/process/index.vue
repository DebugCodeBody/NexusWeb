<template>
    <el-row :gutter="10" style="height: 100%;" class="tab_process" v-loading="loading" element-loading-text="正在加载">
        <template v-if="loadErr">
            <el-col :span="24" class="error">
                <el-result icon="error" title="获取失败" :sub-title="errorSubTitle">
                </el-result>
            </el-col>
        </template>

        <template v-else>
            <div style="width: 100%; margin-bottom: 10px;" ref="topOrderImg"></div>

            <el-col :span="leftSpan" :xs="24" class="left">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </el-col>
            <el-col :span="rightSpan" :xs="24" class="right">

                <beiliao-log v-if="isBeiliao" />
                <process-info-el v-else/>

            </el-col>


        </template>


    </el-row>
</template>



<script setup lang="ts">
import { getProcess } from "@/api"


import "viewerjs/dist/viewer.css";

import { orderStore } from "@/store/order"
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { getOrderUrl } from "@/utils/order"
import { returnStatement } from "@babel/types";

import processInfoEl from "@/layout/processInfo.vue"
import beiliaoLog from "@/layout/beiliaoLog.vue"



const { order } = orderStore();

const orderPath = order.split("-")[0]
const orderImg = $ref<HTMLDivElement>()
const topOrderImg = $ref<HTMLDivElement>()

const route = useRoute();


const el = $ref(useCurrentElement());
let loading = $ref(true);
let loadErr = $ref(false);
let errorSubTitle = $ref("");





let processInfo = ref<workInfo>({} as workInfo);
let tableData = $ref<Array<Process>>([]);


provide("info", processInfo);
provide("order", order);
provide("tableData", tableData);
provide("orderPath", orderPath);









const isBeiliao = $computed(()=>{

    return route.path == "/process/beiliao"

})

const leftSpan = computed(() => {

    return isBeiliao ? 16 : 12;

})

const rightSpan = computed(() => {

    return isBeiliao ? 8 : 12;

})


getProcess(order).then((data) => {


    data.samedoc = data.samedoc || [];

    processInfo.value = data;
    tableData.push(processInfo.value.proces);


    /** 这里的滚动不能够很好的控制，暂时先不管了 */
    // nextTick(() => {
    //     setTimeout(() => {

    //         let deltaY = 0;

    //         const table = tableEl.$el.querySelector(".el-scrollbar");
    //         const scrollbarEl = tableEl.$el.querySelector(".el-scrollbar__thumb");

    //         const scrollBarRef = tableEl.$refs.scrollBarRef! as any;

    //         tableEl.$el.addEventListener("mousewheel", (event: WheelEvent) => {
    //             const scrollWidth = parseInt(scrollbarEl.style.width);
    //             const maxWidth = table.scrollWidth - scrollWidth;

    //             deltaY += event.deltaY;
    //             if (deltaY <= 0) {
    //                 deltaY = 0;
    //             } else if (deltaY > scrollWidth) {
    //                 deltaY = scrollWidth
    //             }

    //             scrollBarRef.setScrollLeft(deltaY);
    //         });

    //     })
    // })

}).catch((error: any) => {
    
    loadErr = true;

    errorSubTitle = error.msg || error.message || "其他错误，请联系管理员";

}).finally(() => {
    loading = false;
})









function onResizeEvent() {
    
    if (window.innerWidth > 768 || !("ontouchend" in document)) {
        return;
    }


    topOrderImg.appendChild(orderImg);

}



window.addEventListener("resize", (event) => {
    onResizeEvent();
})


onMounted(() => {

    onResizeEvent();

})


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.tab_process {
    padding: 10px;
    overflow: auto;

    .el-card__header,
    .el-card__body {
        padding: 10px;
    }

}

.el-tabs__content {
    display: flex;
    flex-direction: column;

    .tab_process {
        flex: 1;
        overflow: hidden;
    }
}


.tab_process {

    .left,
    .right {
        height: 100%;
    }
}


.tab_process .left {}

.tab_process .right {

    width: 100%;
    height: 100%;


   
}


.tab_process .order-img {
        box-sizing: border-box;
        flex: 1;
        height: 100%;
        overflow: hidden;

        .el-card {
            box-sizing: border-box;
        }

        .el-card,
        .el-card__body {
            height: 100%;
        }

        .el-card__body {
            padding: 0;
            min-width: 300px;
            min-height: 300px;
        }

        img {
            width: 100%;
            height: auto;
        }


        .el-image {
            height: 100%;

        }

        .el-image__wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 30px 0;
            text-align: center;
            border-right: solid 1px var(--el-border-color);
            width: 100%;
            box-sizing: border-box;
            vertical-align: top;
        }

        .image-slot {
            width: 150px;
            height: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: var(--el-fill-color-light);
            color: var(--el-text-color-secondary);
            font-size: 30px;
        }

        .load-slot {
            font-size: 20px;
        }

        .error-slot {
            margin-top: 10px;
        }



    }

@media only screen and (max-width: 768px) {
    .preview_tab_view .el-tabs .el-tabs__header {
        .is-left {
            display: none;
        }
    }

    .tab_process {
        overflow: auto !important;
    }

    .tab_process {

        .left,
        .right {
            height: auto;
        }



        .right {
            margin-top: 10px;


            a[target="downloadFile"] {
                display: none;
            }

        }

        .outbound .file-table {
            min-height: 300px;
        }

    }

    .el-dialog {
        width: 90%;
        margin-top: 5% !important;
    }

}

@media only screen and (max-width: 640px) {
    .order-info .el-col.el-col-12 {
        max-width: 100%;
        flex: 0 0 100%;
        margin-bottom: 10px;

    }

}
</style>

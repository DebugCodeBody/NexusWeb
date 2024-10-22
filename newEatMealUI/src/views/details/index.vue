<template>
    <div id="details" class="h-full flex flex-col overflow-hidden ">

        <item-collapse :data-list="dataList" ref="collapse">
            <template #header>
                <div class="p-10px pl-5px bg-white">
                    <span>本月已消费：{{ amount }}</span>
                </div>
            </template>

            <template #default="{ item }">
                <collapse-item :data="item" :list-class="'details-list'" v-if="item.length">
                    <template #default="{ foodItem }">
                        <div class="content">
                            <div>{{ foodItem.name }}</div>
                            <div class="mt-5px">
                                <span>{{ foodItem.weight }}</span>
                                <span class="ml-5px"><van-tag plain type="primary"
                                        v-if="foodItem.pack">打包</van-tag></span>
                            </div>
                        </div>
                    </template>
                </collapse-item>
            </template>

            <template #empty>
                <van-empty description="本周暂未点餐" > </van-empty>
            </template>

            <template #footer>
                <van-action-bar class="px-10px">
                    <van-action-bar-button type="danger" text="返回" @click="view.toView('declare')" />
                </van-action-bar>
            </template>
        </item-collapse>

    </div>
</template>

<script setup lang="ts">
import itemCollapse from "@/views/components/itemCollapse.vue"
import collapseItem from "@/views/components/collapseItem.vue"
import { viewStore, cartStore, timeStore } from "@/store";
import { getTotleCost, getWeekOrder } from "@/api"

const view = viewStore();
const time = timeStore();

let amount = $ref("");
const collapse = $ref<InstanceType<typeof itemCollapse>>();


const dataList = $ref<any[]>([]);
async function init() {

    try {

        const allResult = await Promise.all([getTotleCost(), getWeekOrder(time.getActiveWeekDateYMD)]) as any;

        amount = (allResult[0] as any).cost;

        time.getActivaWeekTime.forEach((elem) => {
            if(allResult[1][elem.YMD]){
                dataList.push([elem, allResult[1][elem.YMD]]);
            }
        })

        nextTick(() => {
            collapse.toggleAll();
        })


    } catch (error) {
        console.log(error);

    }




}


init();




</script>

<script lang="ts">
export default {
    title: "已点详细",
    name: "detail"
}
</script>

<style lang="scss">
#details {
    .details-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .item {

            width: 50%;


            &:nth-child(odd) {
                padding-right: 5px;
            }

            &:nth-child(even) {
                padding-left: 5px;
            }

            .content {

                padding: 5px;
                border: 1px solid #dcdfe6;
                border-radius: 10px;
                color: black;


            }
        }
    }

}
</style>

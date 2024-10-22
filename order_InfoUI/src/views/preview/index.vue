<template>
    <div id="preview">
        <div class="preview_tab_view">
            <el-tabs 
                v-model="order.activeOrder" 
                type="border-card" 
                class="tabs-left-view" 
                tabPosition="left"
                @tab-change="changeOrder">
                <el-tabs v-model="activeName" type="border-card" class="tabs-view" @tab-change="changeTab">
                    <el-tab-pane v-for="item in tabPane" :name="item.name" :label="item.label" :key="item.name">
                    </el-tab-pane>
                </el-tabs>

                <template v-if="orderList.length  == 0">
                    <el-tab-pane label="无订单" name="no" />
                    <el-empty description="这里啥也没有" />
                </template>

                <template v-else>
                    <el-tab-pane v-for="order in orderList" :key="order" :label="order" :name="order" />
                    <template v-for="item in selectOrder" :key="item">
                        <router-view v-show="item == order.activeOrder" />
                    </template>
                </template>

            </el-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { orderStore } from "@/store/order"

const router = useRouter();
const order = orderStore();
const tabPane = [
    { name: "/process/outbound", label: "外发催货" },
    { name: "/process/prodsure", label: "跟单任务" },
    { name: "/process/beiliao", label: "备料信息" },
]



let { orderList, selectOrder  } = order;

let activeName = $ref<string>(order.tabs.value || tabPane[0].name);

function changeOrder(value: string) {

    
    window.selectBeianItem = undefined;
    order.order = value;
    if (!selectOrder.includes(value)) {
        selectOrder.push(value);
    }
}

function changeTab(name: string) {
    router.push(name)
    order.setTabs(name);
}


if (orderList.length == 0) {
    order.activeOrder = "no";
} else {
    order.activeOrder = orderList[0];
}



changeOrder(order.activeOrder);
changeTab(activeName);

</script>

<script lang="ts">
export default {
    name: "",
    title: "工单信息"
}
</script>

<style lang="scss">
#preview {
    height: 100%;
    width: 100%;

    display: flex;


    .tabs-left-view {
        height: 100%;

        .el-tabs__header {
            margin: 0px;
        }

        .el-tabs__content {
            padding: 0px;
            height: 100%;
        }

        .el-tab-pane {
            box-sizing: border-box;
        }
    }

}

.preview_tab_view {
    flex: 1;
    overflow: hidden;
}






.tabs-view {
    background-color: white;

    &.el-tabs--border-card {
        border: 0;
    }
}
</style>

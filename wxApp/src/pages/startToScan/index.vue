<template>

    <view class="overflow-hidden w-full h-full flex flex-col">

        <view class="cu-bar bg-white ">
            <view class="action" @click="onToIndex">
                <text class="text-gray"></text>
                <text>{{ nickname }}</text>
            </view>
            <view class="content text-bold">

            </view>
            <view class="action" @click="onClickLogOut">
                <view style="font-size: 48rpx;">
                    <text class="lg cuIcon-exit" style="color:red"></text>
                </view>
                <view class="ml-5px">
                    注销
                </view>
            </view>
        </view>

        <view class="p-10px flex-1 flex flex-col ">
            <view class=" overflow-hidden flex flex-col table-elem">
                <view class="w-full flex table-header">
                    <view>订单号</view>
                    <!-- <view>件数</view> -->
                    <view>状态</view>
                </view>

                <view class="w-full overflow-hidden flex flex-1 table-item">
                    <view class="w-full h-full overflow-auto">
                        <view class="item" v-for="(item, index) in itemList" :key="item.orderid">
                            <view>{{ item.orderid }}</view>
                            <view>{{ item.count }}</view>
                            <view class="msg">
                                <label :class="{
                                    success: item.success
                                }">{{ item.msg }}</label>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 
                <view class="w-full overflow-hidden flex table-item table-tail">
                    <view class="w-full h-full overflow-auto">
                        <view class="item">
                            <view>汇总</view>
                            <view>{{ Total }}</view>
                            <view></view>
                        </view>
                    </view>
                </view> -->

            </view>

            <view class="flex-1 scan-content">
                <view class="h-full margin-tb-sm text-center flex-1">
                    <button class="w-full h-full cu-btn round bg-blue lg" @click="onClickScan">扫描</button>
                </view>
            </view>

        </view>

    </view>

</template>

<script lang="ts">

import Vue from 'vue';
import { scanCode } from "@/utils/other"
import { sboOrderScan, orderScan } from "@/api"

import { loginCancel } from "@/store/user"
import { showLoading, showToast, showErrorToast, showModal } from "@/utils/other"

import userInfo from "@/store/user"





export default Vue.extend({
    name: "",
    components: {},
    props: {
    },
    beforeCreate() {

    },
    created() { },
    beforeMount() { },
    data() {
        return {
            nickname: userInfo.activeUser.nickname,
            itemList: [

            ] as any[]
        };
    },
    watch: {},
    computed: {
        Total: {
            get() {

                let retVal = 0;
                for (let index = 0; index < this.itemList.length; index++) {
                    const element = this.itemList[index];

                    retVal += element.count;

                }

                return retVal;

            }
        }
    },
    methods: {
        onClickLogOut() {

            showModal('确定是否注销登录？').then(() => {

                loginCancel().then(() => {

                    this.onToIndex();

                }).catch(() => {


                })

            });

        },
        onToIndex() {

            uni.redirectTo({
                url: `/pages/index?uiType=1`,
                params: {
                    test: 1
                }
            });

        },

        onMyCenter() {

            uni.redirectTo({
                url: `/pages/index?uiType=2`,
            });

        },

        onClickScan() {

            scanCode().then((result) => {
                if (!result) {
                    return
                }


                showLoading("正在提交");
                orderScan(result, 1).then(() => {

                    this.itemList.unshift({
                        orderid: result,
                        msg: "扫描成功",
                        success: true
                    })

                }).catch((error: any) => {

                    this.itemList.unshift({

                        orderid: result,
                        msg: error.msg || error.message || "扫描失败",
                        success: true

                    })

                })



            })

        }
    },
    mounted() { },
    beforeDestroy() { },
    destroyed() { }
});

</script>

<style lang="scss" scoped>
$border-color: black;
$border: 1px solid $border-color;

.table-elem {
    border: 1px solid $border-color;
    height: 90%;
    box-sizing: border-box;

}

.table-header {
    display: flex;

    view {

        width: 50%;

        text-align: center;
        font-weight: bold;
        color: #909399;
        padding: 8px 0;
        border-bottom: $border;
        border-right: $border;

        &:last-child {
            border-right: 0;
        }

    }
}

.table-item {
    .item {
        width: 100%;
        border-bottom: 1px solid $border-color;

        display: flex;

        &>view {

            width: 33.33%;
            display: inline-block;
            text-align: center;
            padding: 8px 0;
            border-right: 1px solid $border-color;


            &:last-child {
                border-right: 0;
            }

            &.msg label {


                background-color: #f56c6c;
                color: #fff;
                border-radius: 4px;
                padding: 0 5px;



                &.success {
                    background-color: #409eff;

                }


            }
        }

    }

}

.table-tail {
    .item {

        border-top: $border;
        border-bottom: 0;

    }
}

.scan-content {
    button {
        border-radius: 50%;
        height: 80px;
        width: 80px;
    }
}
</style>

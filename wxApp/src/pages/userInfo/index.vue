<template>

    <view class="flex flex-col ">

        <view class="flex items-center h-70px bg-white mb-10px">
            <view class="cu-avatar lg round margin-left" :style="{
                'background-image': `url(${imgUrl})`
            }">
            </view>
            <view class="ml-10px text-black">
                <h2 class="text-16px" v-if="token">{{ name }}</h2>
                <h2 class="text-16px" v-else @click="onClickLogin">请到功能页登录</h2>
            </view>

        </view>

        <view class="cu-list menu card-menu margin-top mb-10px" v-if="token">
            <view class="cu-list grid col-3 no-border">
                <view class="cu-item" @click="onClickLogOut">
                    <view class="mb-5px">
                        <text class="lg cuIcon-exit" style="color:red"></text>
                    </view>
                    <text>注销</text>
                </view>
                <view class="cu-item" v-if="false">
                    <view>
                        <text class="lg text-gray cuIcon-exit"></text>
                    </view>
                    <text>修改密码</text>
                </view>
            </view>
        </view>

    </view>

</template>

<script lang="ts">
import Vue from 'vue';


import { loginCancel } from "@/store/user"
import { showLoading, hidenLoading, showToast, showModal } from "@/utils/other"


import userInfo from "@/store/user"

export default Vue.extend({
    data() {
        return {
            imgUrl: userInfo.imgUrl,
            name: userInfo.name,
            token: Object.keys(userInfo.activeUser).length > 0

        }
    },
    created() {
    },
    onLoad() {


    },
    computed: {
    },
    methods: {
        onClickLogin() {


        },
        onClickLogOut() {

            const self = this;


            showModal('确定是否注销登录？').then(() => {



                userInfo.type = [1,2].find((elem)=>{
                    return userInfo.user[elem] && userInfo.user[elem].token
                })!;


                loginCancel().then(() => {

                    self.imgUrl = "";
                    self.name = "";
                    self.token = false;

                }).catch(() => {


                })

            })






        }

    }
});
</script>

<style lang="scss">

</style>

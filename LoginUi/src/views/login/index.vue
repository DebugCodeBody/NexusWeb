<template>
    <div id="login" class="wh-full flex flex-center">
        <div class="w-500px border warap">

            <el-tabs v-model="loginModel" @tab-change="onTabsChange">
                <el-tab-pane v-for="item in tabPane" :label="item.label" :name="item.name" :key="item.name">
                    <component :is="item.component" v-if="item.value" />
                </el-tab-pane>
            </el-tabs>

        </div>
    </div>
</template>

<script setup lang="ts">
import phone from "./phone.vue"
import wx from "./wx.vue"
import ding from "./ding.vue"



const tabPane = $ref([
    {
        name: "phone",
        label: "验证码登录",
        component: markRaw(phone),
        value: true
    },
    {
        name: "ding",
        label: "钉钉扫码登录",
        component: markRaw(ding),
        value: true
    },
    {
        name: "wx",
        label: "微信扫码登录",
        component: markRaw(wx),
        value: true
    }
])



function onTabsChange(value: string) {
    tabPane.find((elem) => elem.name == value)!.value = true;
}


const loginModel = $ref(tabPane[0].name);

onTabsChange(loginModel);




</script>

<script lang="ts">
export default {
    name: "Login"
}
</script>

<style lang="scss">
#login {
    padding-top: 50px;


    .el-tabs__nav,
    .el-tabs__item {
        display: flex;
    }

    .el-tabs__item {

        justify-content: center;
    }

    .warap {

        padding: 20px;
        background-color: white;
        height: 500px;
        border-radius: 10px;

        .el-tabs__nav {
            width: 100%;

            .el-tabs__item {
                width: 50%;
            }
        }

    }

    #phone-login {
        padding: 20px;


        .el-form-item.sms {
            .el-input-group__append {
                width: 100px;
            }
        }

    }

}
</style>

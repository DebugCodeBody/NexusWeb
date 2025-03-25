<template>
    <view class="wh-full">
        <web-view class="wh-full" v-if="src" :src="src">
        </web-view>
    </view>
</template>

<script lang="ts">
import Vue from 'vue';
import { getAuthTempToken } from "@/api/auth"


export default Vue.extend({
    components: {
    },

    data() {
        return {
            src: "",
            params: {
                type: 1
            }
        }
    },

    methods: {

    },
    onLoad(params = {}) {

        Object.assign(this.params, params);

    },
    mounted() {

        getAuthTempToken().then((code) => {

            const url = process.env.NODE_ENV == "development" ? "http://58.255.76.136:8013/ding" : "https://cddgd.cn/ding";

            this.src = `${url}/osp/aboacc/index.html?authtoken=${code}&type=${this.params.type}`;
            
        })


    },
});
</script>

<style lang="scss">
webview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
}
</style>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    mpType: 'app',
    onLaunch() {

        // uni.getSystemInfo({
        //     success: function (e:any) {
        //         // #ifndef MP
        //         Vue.prototype.StatusBar = e.statusBarHeight;
        //         if (e.platform == 'android') {
        //             Vue.prototype.CustomBar = e.statusBarHeight + 50;
        //         } else {
        //             Vue.prototype.CustomBar = e.statusBarHeight + 45;
        //         };
        //         // #endif
        //         // #ifdef MP-WEIXIN
        //         Vue.prototype.StatusBar = e.statusBarHeight;
        //         let custom = wx.getMenuButtonBoundingClientRect();
        //         Vue.prototype.Custom = custom;
        //         Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        //         // #endif		
        //         // #ifdef MP-ALIPAY
        //         Vue.prototype.StatusBar = e.statusBarHeight;
        //         Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        //         // #endif
        //     }
        // })

    },
    onShow() {
    },
    onHide() {
    }
});
</script>

<style>
/*每个页面公共css */

@import "colorui/main.css";
@import "colorui/icon.css";


page {
    width: 100%;
    height: 100%;
}
</style>

import axios from "axios";
import { messageError } from "@/utils/elementLib"
import getSearch from "@/utils/urlSearch"

const service = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "./api" : "./"
});

service.interceptors.response.use(

    response => {
        const res = response.data
        if (res.code == 302) {
            location.replace(res.location)
            return 302;
        } else if (res.code == 1409) {

            
            // const isWeixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1;
            // /** 如果当前在微信浏览器上 */
            // if (isWeixin) {


            //     alert("请使用浏览器打开此页面")

            //     return;
            //     // /** 避免他死循环登录 */
            //     // const tokenStorage = getSearch("weixinlogin");

            //     // if (!tokenStorage) {

            //     //     let search = location.search;

            //     //     if (search) {
            //     //         search += "&"
            //     //     } else {
            //     //         search = "?"
            //     //     }

            //     //     search += "weixinlogin=1";

            //     //     const url = `${location.origin}${location.pathname}${search}`;


            //     //     location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx77524c34c7f3bf6a&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=snsapi_userinfo`

            //     //     return;
            //     // }

            // }


            // if (process.env.NODE_ENV === "production") {
            //     // 如果没有的话就跳过去
            //     location.href = `/ding/auth/wxapp/index.html?path=qrlogin&redirect=${encodeURIComponent(location.href)}&loginType=2`

            // } else {

            //     location.href = `http://192.168.1.222/ding/auth/wxapp/index.html?path=qrlogin&redirect=${encodeURIComponent(location.href)}`;

            //     // location.href = "http://192.168.1.222/ding/auth/wxapp/index.html?path=qrlogin"

            // }



        } else if (res.code !== 200) {
            messageError(res.msg);
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res.data;
        }
    },
    error => {
        if (error.message == "Network Error") {
            error.message = "网络连接失败！"
        } else {
            if (error.response.status == 500) {
                error.message = "请求失败，请稍后重试"
            }
        }

        messageError(error.message);
        return Promise.reject(error)
    }
)

export default service

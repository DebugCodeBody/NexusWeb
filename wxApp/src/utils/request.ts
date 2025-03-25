import userInfo from "@/store/user"

import axios from "axios";
import mpAdapter from 'axios-miniprogram-adapter'
// @ts-ignore
axios.defaults.adapter = mpAdapter
// @ts-ignore
axios.defaults.adapter = config => mpAdapter(config, {
    transformRequestOption: (requestOption: any) => {
        requestOption.header = Object.assign({}, requestOption.header);
        return requestOption
    }
})




const service = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "http://58.255.76.136:8013/ding" : "https://cddgd.cn/ding"
});


service.interceptors.request.use((res) => {

    // @ts-ignore
    const token = userInfo.activeUser.token;
    if (token) {
        res.headers["Authorization"] = token
    }


    return res
})

service.interceptors.response.use(

    (response) => {
        const res = response.data

        const { code, data } = res
        if (code == 401) {
            uni.redirectTo({
                url: `/pages/login/index?token=${encodeURIComponent(data.code)}&name=${encodeURIComponent(userInfo.name)}`,
            })
            return;
        }
        if (res.code !== 200) {
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return data;
        }
    },
    error => {
        if (error.message == "Network Error") {
            error.message = "网络连接失败！"
        }
        return Promise.reject(error)
    }
)

export default service

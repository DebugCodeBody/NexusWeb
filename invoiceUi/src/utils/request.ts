import axios from "axios";
import { messageError } from "@/utils/elementLib"
import urlQuery from "@/utils/urlSearch"

const service = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "./api" : "./"
});

service.interceptors.request.use((config) => {


    const { method } = config;

    let setObj: any = {};
    if (method == "get") {
        setObj = config.params = config.params || {};
    } else if (method == "post") {
        setObj = config.data = config.data || {};
    }

    setObj.order = urlQuery.order;
    setObj.hash = urlQuery.hash;


    return config;



})

service.interceptors.response.use(

    response => {
        const res = response.data

        if (res.code !== 200) {
            if (res.msg) {
                messageError(res.msg);
            }
            return Promise.reject(res)
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

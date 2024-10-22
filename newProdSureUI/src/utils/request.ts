import axios from "axios";
import { messageError } from "@/utils/elementLib"

const service = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "./api" : "./"
});

service.interceptors.response.use(

    response => {
        const res = response.data
        if (res.code !== 200) {

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
            if(error.response.status == 500){
                error.message = "请求失败，请稍后重试"
            }
        }
        
        
        messageError(error.message);
        return Promise.reject(error)
    }
)

export default service

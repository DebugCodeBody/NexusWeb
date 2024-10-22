import axios from "axios";
import { ElMessage } from "element-plus"


const service = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "./api" : "./"
});

service.interceptors.response.use(

    response => {
        const res = response.data
        if (res.code !== 200) {
            if (res.code == 0) {
                ElMessage.error(res.msg);
            }
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res.data;
        }
    },
    error => {
        if (error.message == "Network Error") {
            error.message = "网络连接失败！"
            ElMessage.error(error.message);
        }
        if (error.response.status == 500) {
            ElMessage.error("操作失败，请重试！");
        }


        return Promise.reject(error)
    }
)

export default service

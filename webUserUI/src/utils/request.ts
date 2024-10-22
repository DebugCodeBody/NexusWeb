import axios from "axios";

const service = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "./api" : "./"
});


service.interceptors.response.use(

    response => {
        const res = response.data
        if (res.code !== 200) {
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res.data;
        }
    },
    error => {
        if (error.message == "Network Error") {
            error.msg = "网络连接失败！"
        }
        return Promise.reject(error)
    }
)

export default service

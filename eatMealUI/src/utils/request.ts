import axios from "axios";
import { Toast } from "vant";

const service = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "./api" : "./"
});


let requestLen = 0;
let loading: any = undefined;


function deeRequest(response: any) {

    if (response.request.responseURL.indexOf("/auto") == -1) {
        requestLen -= 1;


        if (requestLen <= 0) {

            if (loading) {
                loading.clear();
            }
            loading = undefined;
        }
    }

}

service.interceptors.request.use(res => {

    if (res.url!.indexOf("/auto") == -1) {
        requestLen += 1;

        if (!loading) {
            loading = Toast.loading({
                message: '正在操作',
                forbidClick: true,
                loadingType: 'spinner',
            });

        }

    }

    return res
})

service.interceptors.response.use(


    response => {
        deeRequest(response);
        const res = response.data
        if (res.code !== 200) {
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res.data;
        }
    },
    error => {
        console.log(error)
        deeRequest(error);
        if (error.message == "Network Error") {
            error.message = "网络连接失败！"
        }
        return Promise.reject(error)
    }
)

export default service

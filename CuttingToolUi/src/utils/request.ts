import axios from "axios";
import { messageError } from "@/utils/elementLib"
import { ElLoading } from 'element-plus';


const service = axios.create({
    baseURL: process.env.NODE_ENV == "development" ? "./api" : "./"
});


let requestLen = 0;
let loading: any = undefined;



function clearLoadIng() {


    requestLen -= 1;
    if (requestLen <= 0) {

        if (loading) {
            loading.close();
        }
        loading = undefined;
    }


}
function deeRequest(response: any) {

    if (response.request.responseURL.indexOf("/auto") == -1) {
        clearLoadIng();
    }


}
service.interceptors.response.use(

    response => {
        deeRequest(response);


        const res = response.data
        if (res.code !== 200) {

            messageError(res.msg);
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res.data;
        }
    },
    error => {
        clearLoadIng();


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


service.interceptors.request.use(res => {

    if (res.url!.indexOf("/auto") == -1) {
        requestLen += 1;

        if (!loading) {

            loading = ElLoading.service({
                lock: true,
                text: '正在操作',
                background: 'rgba(0, 0, 0, 0.7)',
            })

        }

    }

    return res
})



export default service

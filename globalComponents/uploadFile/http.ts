import axios from "axios";

export default function (data: any) {

    let url = "";


    if (process.env.NODE_ENV == "development") {
        url = "./api/media/upload/img"
    } else {
        url = `${location.origin}/ding/media/upload/img`
    }

    return axios({
        url,
        method: "post",
        data

    }).then((response: any) => {

        const res = response.data
        if (res.code !== 200) {
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res.data;
        }

    }).catch((error: any) => {
        
        if (error.message == "Network Error") {
            error.message = "网络连接失败！"
        }

        return Promise.reject(error)

    })



}
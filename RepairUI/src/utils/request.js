import axios from 'axios'
import { MessageBox, Message } from 'element-ui'


// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV == "development" ? "/api/ding/repair" : "./"
});

// response interceptor
service.interceptors.response.use(

  response => {
    const res = response.data
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (error.response.status == 0) {
      error.message = "网路链接错误"
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

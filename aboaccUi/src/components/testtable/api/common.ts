// import createAxios from "../utils/axios"

import axios, { AxiosPromise, Method } from 'axios'
import type { AxiosRequestConfig } from 'axios'

function createAxios(axiosConfig: AxiosRequestConfig, options: any = {}, loading: any = {}): ApiPromise | AxiosPromise {


    const Axios = axios.create({
        baseURL: "http://192.168.0.205:8011/ding/nexus/admin",
        timeout: 1000 * 10,
        headers: {
            'Content-Type': 'application/json'

        }
    })




    Axios.interceptors.response.use(

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
                error.message = "网络连接失败！"
            }
            return Promise.reject(error)
        }
    )


    axiosConfig.params = axiosConfig.params || {};

    axiosConfig.params.authorization = "85e141710a25880d6f498f4522dfc283";



    return Axios(axiosConfig) as any;
}

/**
 * 生成一个控制器的：增、删、改、查、排序的操作url
 */
export class baTableApi {
    private controllerUrl
    public actionUrl

    constructor(controllerUrl: string) {
        this.controllerUrl = controllerUrl
        this.actionUrl = new Map([
            ['index', controllerUrl + 'index'],
            ['add', controllerUrl + 'add'],
            ['edit', controllerUrl + 'edit'],
            ['del', controllerUrl + 'del'],
            ['sortable', controllerUrl + 'sortable'],
        ])
    }

    index(filter: anyObj = {}): ApiPromise<TableDefaultData> {

        return createAxios({
            url: this.actionUrl.get('index'),
            method: 'get',
            params: filter,
        }) as ApiPromise
    }

    edit(params: anyObj) {
        return createAxios({
            url: this.actionUrl.get('edit'),
            method: 'get',
            params: params,
        })
    }

    del(ids: string[]) {
        return createAxios(
            {
                url: this.actionUrl.get('del'),
                method: 'DELETE',
                data: {
                    ids: ids,
                },
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    postData(action: string, data: anyObj) {
        if (!this.actionUrl.has(action)) {
            throw new Error('action 不存在！')
        }
        return createAxios(
            {
                url: this.actionUrl.get(action),
                method: 'post',
                data: data,
            },
            {
                showSuccessMessage: true,
            }
        )
    }

    sortableApi(id: number, targetId: number) {
        return createAxios({
            url: this.actionUrl.get('sortable'),
            method: 'post',
            data: {
                id: id,
                targetId: targetId,
            },
        })
    }

}



//     this.table.data = data.list;
//     this.table.total = data.totalCount;

abstract class tableApi<T = any> {

    public abstract index(filter: any): Promise<{
        list: T[],
        totalCount: number
    }>

    public abstract add(data: T): Promise<T>

    public abstract edit(oldData: T, newData: T): Promise<T>

    public abstract delete(data: T): Promise<T>

}


export {
    tableApi
}
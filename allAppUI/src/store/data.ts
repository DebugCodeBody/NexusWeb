

// @ts-nocheck
import md5 from "blueimp-md5";

import { getCorpId } from "@/utils/urlSearch"
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { getUserName } from "@/store/user"

const itemName = "allAppInfo";



const appList = [
    {
        name: "分类1",
        app: [
            {
                name: "群会议",
                url: "/coolapp/meeting",
                view: [
                    {
                        name: "约会议",
                        path: "declare"
                    },
                    {
                        name: "看板",
                        path: "list"
                    }
                ]
            },
            {
                name: "任务看板",
                url: "/order_notifier",
                view: [
                    {
                        path: "preview"
                    }
                ]
            },
            {
                name: "生产图档",
                url: "/document"
            },

        ]
    },
    {
        name: "分类2",
        app: [
            {
                name: "QC成品检",
                url: "/erp/qcmanage"
            },
            {
                name: "货拉拉图片",
                url: "/huolalapic"
            }
        ]
    },
    {
        name: "分类3",
        app: [
            {
                name: "点餐",
                url: "/neweatmeal",
                view: [
                    {
                        path: "main"
                    }
                ]
            },
            {
                name: "考勤核对",
                url: "/workhour",
                isDing: true
            }
        ]
    }
] as {
    name: string,
    app: appItem[]
}[];

const isDingEnv = /dingtalk/i.test(navigator.userAgent);

const userInfo = reactive({
    appList,
    name: "",

    select: {
        app: undefined as appItem | undefined
    },

    pop: {
        open: false,
        info: false
    },
    setName(name: string) {
        this.name = name;
        localStorage.setItem(itemName, JSON.stringify({
            name
        }))
    },
    setApp(app: appItem) {

        if (app.isDing && !isDingEnv) {

            const title = "错误";
            const message = "本应用只允许在钉钉上使用！"

            ElMessageBox.confirm(
                message,
                title,
                {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'error',
                    center: true
                }
            )

            return;
        }



        if (!app.view || app.view.length == 1) {

            this.openApp(app, app.view && app.view[0]);

        } else {


            this.pop.open = true;
            this.select.app = app;

        }


    },
    openApp(app: appItem, view?: viewItem) {



        let url = `http://192.168.0.205:8011/ding${app.url}/index.html`;
        const params = [];

        const user = md5(userInfo.name);

        params.push(`user=${user}`);

        if (isDingEnv) {
            params.push(`corpId=${getCorpId()}`);
        }

        if (view) {
            params.push(`path=${view.path}`);
            if (view.params) {

                view.params.forEach((elem) => {
                    params.push(`${elem.name}=${encodeURIComponent(elem.value)}`)
                })

            }
        }
        if (params.length > 0) {
            url += `?${params.join("&")}`;
        }


        window.open(url);


    }
});



export function infoInit() {

    try {

        let tempName = getUserName();
        if (!tempName) {
            const tempInfo = JSON.parse(localStorage.getItem(itemName) as any);
            tempName = tempInfo.name;
        }

        userInfo.name = tempName;

    } catch (err) {

    }



}




export default userInfo;
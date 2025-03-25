import { setEventLog } from "@/api/event"
import { login, logOut, logCancel } from "@/api/auth"
import { showLoading, hidenLoading, showErrorToast, showToast } from "@/utils/other"


type pageItem = {
    name: string,
    args: (string | number)[]
}



const user: {
    [key: string | number]: any
} = {

}

const store = {
    activeUser: ({} as {
        [key: string]: any
    }),
    user,
    redirectPage: "",

    name: "",
    imgUrl: "",
    type: 0,
    shownnn: true,
    showxjc: true

}


export function loginUser() {

    return new Promise((resolve, reject) => {

        wx.getUserProfile({
            desc: '获取你的昵称、头像、地区及性别',
            success: async (profileResult) => {

                showLoading("正在登录");

                uni.login({
                    provider: "weixin",
                    success(result) {

                        const { code } = result;

                        store.name = profileResult.userInfo.nickName;
                        store.imgUrl = profileResult.userInfo.avatarUrl;

                        login(code, store.type).then((result) => {
                            if (!result) {
                                return;
                            }


                            store.name = result.name;
                            store.user[store.type] = result;


                            resolve(result)

                        }).catch((error: any) => {

                            showErrorToast(error.msg || error.message || "登录失败")
                            reject();

                        }).finally(() => {
                            hidenLoading()
                        })

                    }
                })

            },
            fail() {
                showErrorToast("登录失败")
            }
        })

    })

}

export function loginCancel() {

    return new Promise<void>((resolve, reject) => {

        showLoading("正在注销")

        logCancel().then(() => {

            store.imgUrl = "";
            store.user = {};
            store.activeUser = {};
            store.name = "";

            console.log(store)

            showToast("注销成功")
            resolve();

        }).catch(() => {
            showErrorToast("注销失败")
            reject()

        }).finally(() => {
            hidenLoading()
        })


    })

}


let lastPage: pageItem;


function ReportEvent(name:string){

    setEventLog(name).catch(()=>{
        
    });


}


export function toPage(item: pageItem) {

    lastPage = item;


    const { name, args } = item;

    const [page, type, params = {}] = args;


    const userInfo = store.user[type];
    if (userInfo) {

        ReportEvent(name);

        let url = `${page}/index`;
        const paramsArr = []

        for (const [key, value] of Object.entries(params)) {
            paramsArr.push(`${key}=${encodeURIComponent(value as string)}`)
        }

        if (paramsArr.length) {
            url += `?${paramsArr.join("&")}`
        }


        store.activeUser = userInfo;
        uni.redirectTo({
            url
        })

    } else {

        store.type = (type as number);
        store.redirectPage = page as string;

        loginUser().then(() => {
            toPage(item);
        });

    }

}

/** 跳转到登录前的页面 */
export function toLoginPage() {

    const { name, args } = lastPage;


    ReportEvent(name);

    const [page, type, params = {}] = args;

    let url = `../${page}/index`;
    const paramsArr = []

    for (const [key, value] of Object.entries(params)) {
        paramsArr.push(`${key}=${encodeURIComponent(value as string)}`)
    }

    if (paramsArr.length) {
        url += `?${paramsArr.join("&")}`
    }

    store.activeUser = store.user[type];

    uni.redirectTo({
        url
    })


}



export default store


export {
    pageItem
}

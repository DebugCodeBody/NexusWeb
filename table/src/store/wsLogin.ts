import { getWxToken } from "@/utils/auth"
import { getWxInfo, wxCodeLogin, wxOauthLogin, authLogin } from "@/api/user"
import getSearch, { getCode, getUserToken } from "@/utils/urlSearch"

import to from "await-to-js"
import init from "@/enum/init"




export function userLogin(): Promise<init> {


    return new Promise((resolve, reject) => {

        const wxCode = getCode();
        const userMd5 = getUserToken();

        async function Login() {


            // 如果有微信的code的话，就调用微信来登录
            if (wxCode) {
                const [err] = await to(wxOauthLogin(wxCode, getSearch("appid")));
                if (!err) {
                    resolve(init.SUCCESS);
                    return;
                }
            }

            const cookies = getWxToken();
            if (cookies) {
                const [err] = await to(getWxInfo());
                if (!err) {
                    resolve(init.SUCCESS);
                    return;
                }
            }


            const authtoken = getSearch("authtoken");
            if (authtoken) {
                const [err] = await to(authLogin(authtoken));
                if (!err) {
                    resolve(init.SUCCESS);
                    return;
                }
            }



            // 如果当前链接上有这用户md5
            if (userMd5) {
                const [err] = await to(wxCodeLogin(userMd5));
                if (!err) {
                    resolve(init.SUCCESS);
                    return;
                }
            }

            if (process.env.NODE_ENV === "production") {
                // 如果没有的话就跳过去
                location.href = `/ding/auth/wxapp/index.html?path=qrlogin&redirect=${encodeURIComponent(location.href)}`

            } else {

                location.href = `http://192.168.1.222/ding/auth/wxapp/index.html?path=qrlogin&redirect=${encodeURIComponent(location.href)}`;

                // location.href = "http://192.168.1.222/ding/auth/wxapp/index.html?path=qrlogin"


            }

        }

        Login();

    })


}
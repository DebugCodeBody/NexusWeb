import Cookies from 'js-cookie'
import to from "await-to-js"
import { getCorpId } from "@/api/user"


const TokenKey = 'appToken'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token: string) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}


/**
 * 判断当前是否为钉钉容器
 * @returns 
 */
export function isDing(): boolean {
    return (typeof dd != "undefined" && dd.env.platform != "notInDingTalk");
}

/**
 * 检查钉钉免登code是否可用
 * @returns 
 */
export function checkDingArg(): Promise<{ code: string, corpId: string }> {


    return new Promise(async (resoleve, reject) => {


        let corpIdArr: string[];
        try {
            corpIdArr = await getCorpId();
        } catch {
            reject();
            return;
        }


        let errInfo: any;
        const nextGet = (index: number) => {
            if (index > (corpIdArr.length - 1)) {
                alert(JSON.stringify(errInfo));
                reject();
                return;
            }

            const corpId = corpIdArr[index]

            dd.runtime.permission.requestAuthCode({
                corpId
            }).then((result: any) => {

                const { code } = result;
                resoleve({
                    corpId,
                    code
                });

            }).catch((err: Error) => {
                errInfo = err;
                nextGet(index + 1);
            })
        }

        nextGet(0);

    })

}































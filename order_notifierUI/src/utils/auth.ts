import Cookies from 'js-cookie'
import { getCorpId } from "@/utils/urlSearch"


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
export function checkDingArg() {

    const corpId = getCorpId() || "dingf2f1e9ca1da23dff";

    return dd.runtime.permission.requestAuthCode({
        corpId
    }).then((result: any) => {
        const { code } = result;
        return {
            corpId,
            code
        };
    })

}

































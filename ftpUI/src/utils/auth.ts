import Cookies from 'js-cookie'
import { getCorpId } from "@/utils/urlSearch"


const TokenKey = 'appToken'
const wxTokenKey = 'WxAppToken'

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

    const corpId = getCorpId();

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





export function getWxToken() {
    return Cookies.get(wxTokenKey)
}

export function setWxToken(token: string) {
    return Cookies.set(wxTokenKey, token)
}

export function removeWXToken() {
    return Cookies.remove(wxTokenKey)
}





























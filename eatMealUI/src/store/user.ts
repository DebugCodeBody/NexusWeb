import init from "@/enum/init"
import { getInfo, dingToken, tokenLogin } from "@/api/user"
import { getToken, removeToken, isDing, checkDingArg } from "@/utils/auth"
import { getUserToken } from "@/utils/urlSearch"
import { strictDingtalk } from "@/settings"



const info: userInfo = {} as userInfo;
const state = {
    info
}

const actions = {
    SET_INFO(data: userInfo) {
        Object.assign(state.info, data);
    },

    dingLogin(): Promise<userInfo> {
        return checkDingArg().then(({ corpId, code }: { code: string, corpId: string }) => {
            return dingToken(corpId, code);
        })
    },
    tokenLogin(user: string): Promise<userInfo> {
        return tokenLogin(user)
    }
}


/**
 * 用户登录
 * @returns 
 */
function userLogin(): Promise<init> {
    return new Promise((resolve) => {

        let token = getToken();
        const ding = isDing();
        if (strictDingtalk && !ding) {
            return resolve(init.NOENVIRONMENT);
        }

        const userToken = getUserToken();
        if (userToken) {
            // 如果当前链接上有token，就要把浏览器上面的cookies给删除掉
            // 因为要重新登录
            removeToken();
            token = String.Empty;
        }

        // 如果cookies上面有token，那就直接获取用户信息
        // 如果没有获取到用户信息，那就在进行钉钉登录
        if (token) {
            getInfo().then((info) => {
                actions.SET_INFO(info);
                resolve(init.SUCCESS);
            }).catch((error) => {
                loginDing();
            })
        } else {
            loginDing();
        }

        /**
         * 钉钉登录
         */
        function loginDing() {
            // 如果当前是钉钉环境，就用钉钉的免登来进行登录
            if (ding) {
                actions.dingLogin().then((info) => {
                    actions.SET_INFO(info);
                    resolve(init.SUCCESS);
                }).catch((error: any) => {
                    loginToken();
                })
            } else {
                // 如果不是的话，那就用user token来进行登录
                loginToken();
            }
        }

        /**
         * token登录
         */
        function loginToken() {
            if (userToken) {
                actions.tokenLogin(userToken).then((info) => {
                    actions.SET_INFO(info);
                    resolve(init.SUCCESS);
                }).catch((error) => {
                    resolve(init.NOLOGIN);
                })
            } else {
                resolve(init.NOENVIRONMENT);
            }
        }

    })
}


/**
 * 获取用户名字
 * @returns
 */
export function getUserName(): string {
    return info.name;
}

/**
 * 取出钉钉ID
 * @returns
 */
export function getUserId(): string {
    return info.userid;
}

/**
 * 取出钉钉头像地址链接
 * @returns 
 */
export function getUserAvatar(): string {
    return info.avatar;
}

/**
 * 取出员工部门
 * @returns 
 */
export function getUserBranch(): string {
    return info.branch;
}

/**
 * 取出员工部门
 * @returns 
 */
export function getUserEmpId(): string {
    return info.empid || "";
}


export {
    userLogin
}













































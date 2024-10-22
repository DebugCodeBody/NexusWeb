import { login } from "@/api/user"



const TokenKey = "User-Info"

/**
 * 环境初始化，判断URL是否存在钉钉应用corpID 和 钉钉的环境JS是否加载成功
 * 同时还判断一下当前环境是否为钉钉环境
 *
 * @returns 返回真代表当前是在钉钉环境中，返回假的话就是在其他浏览器中
 */
export function environment(): boolean {
	return process.env.NODE_ENV == "development" || (urlSearch.corpId != undefined && urlSearch.corpId != "" && urlSearch.corpId != "$CORPID$" && typeof dd != "undefined" && dd.env.platform != "notInDingTalk")
}

/**
 * 用户登录，失败了会调用失败的 reject ，把失败原因传进去
 * @returns 
 */
export function userLogin() {
	return new Promise((resolve, reject) => {
		if (isLogin()) {
			resolve();
		} else {
			const { corpId } = window.urlSearch

			window.dd.runtime.permission.requestAuthCode({
				corpId,
				onSuccess: function (result: any) {
					const { code } = result;

					
					login(code).then((info: any) => {
						setUserInfo(info);
						resolve();
					}).catch((error: any) => {
						reject(error.msg);
					})

				},
				onFail: function (error: any) {
					reject(error)
				},
			})
		}
	})
}

/**
 * 判断当前是否登录
 * @returns 
 */
export function isLogin() {
	const info = getUserInfo();

	try {
		return !!(info && info.name && info.userid)
	} catch (error) {
		return false
	}
}

/**
 * 取出当前用户信息
 * @returns 
 */
export function getUserInfo(): userInfo {
	const value: any = localStorage.getItem(TokenKey);

	try {
		return JSON.parse(value)
	} catch (error) {
		return <userInfo>{};
	}
}

/**
 * 设置用户信息
 * @param info 
 */
export function setUserInfo(info: userInfo) {
	localStorage.setItem(TokenKey, JSON.stringify(info))
}

/**
 * 获取用户名字
 * @returns
 */
export function getUserName():string {
	return getUserInfo().name;
}

/**
 * 取出钉钉ID
 * @returns
 */
export function getUserId():string {
	return getUserInfo().userid;
}

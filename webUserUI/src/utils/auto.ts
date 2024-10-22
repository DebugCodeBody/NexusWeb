import Cookies from "js-cookie";


const DingTokenKey = "User-Info"
const TokenKey = 'Nexus-Token'



export function getToken() {
	return Cookies.get(TokenKey) || ""
}

export function setToken(token:string) {
	return Cookies.set(TokenKey, token)
}

export function removeToken() {
	return Cookies.remove(TokenKey)
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
	const value: any = localStorage.getItem(DingTokenKey);

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
	localStorage.setItem(DingTokenKey, JSON.stringify(info))
}

/**
 * 获取用户名字
 * @returns
 */
export function getUserName(): string {
	return getUserInfo().name;
}

/**
 * 取出钉钉ID
 * @returns
 */
export function getUserId(): string {
	return getUserInfo().userid;
}

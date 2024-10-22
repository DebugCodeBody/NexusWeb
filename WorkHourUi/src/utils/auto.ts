import { login } from "@/api/user"
import { Toast, Dialog } from 'vant';
import 'vant/es/dialog/style';




const TokenKey = "User-Info"

/**
 * 环境初始化，判断URL是否存在钉钉应用corpID 和 钉钉的环境JS是否加载成功
 * 同时还判断一下当前环境是否为钉钉环境
 *
 * @returns 返回真代表当前是在钉钉环境中，返回假的话就是在其他浏览器中
 */
export function environment(): Promise<unknown> {

	return new Promise((resolve, reject) => {




		// if (process.env.NODE_ENV == "development") {
		// 	return resolve();
		// }

		if (typeof dd == "undefined" || dd.env.platform == "notInDingTalk") {

			Dialog.alert({
				message: "请通过钉钉应用进入",
			})

			return reject();
		}

		const { corpId } = window.urlSearch;
		window.dd.runtime.permission.requestAuthCode({
			corpId
		}).then((result: any) => {
			const { code } = result;
			dd.code = code || "";
			resolve()
		}).catch((error:any) => {

			Dialog.alert({
				message: JSON.stringify(error)
			})

			reject();
		})

	})

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

			const { code } = dd;
			if (process.env.NODE_ENV == "development") {
				if (code == "") {
					alert("免登code为空，取消登录");
					return;
				}
			}

			login(code).then((info: any) => {

				setUserInfo(info);
				resolve();

			}).catch((err: any) => {
				Dialog.alert({
					message: err.message
				})

				reject();

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
		return !!(info && info.name && info.userid && info.branch)
	} catch (error) {
		return false
	}
}


/**
 * 
 * 不再保存到 localStorage
 * 因为员工有时候会频繁的切换，导致fid不正确而获取不到数据
 * 
 */
const userLocalStorage: userInfo = {} as userInfo;
/**
 * 取出当前用户信息
 * @returns 
 */
export function getUserInfo(): userInfo {
	return userLocalStorage;
}



/**
 * 设置用户信息
 * @param info 
 */
export function setUserInfo(info: userInfo) {
	Object.assign(userLocalStorage, info)
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

/**
 * 取出钉钉头像地址链接
 * @returns 
 */
export function getUserAvatar(): string {
	return getUserInfo().avatar;
}

/**
 * 取出员工部门
 * @returns 
 */
export function getUserBranch(): string {
	return getUserInfo().branch;
}

/**
 * 取出员工部门
 * @returns 
 */
export function getUserEmpId(): string {
	return getUserInfo().empid || "";
}



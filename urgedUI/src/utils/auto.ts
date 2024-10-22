import { login, autoLogin, tokenLogin, getInfo } from "@/api/user"



const TokenKey = "User-Info"
const userInfo: userInfo = {} as userInfo;
let loginErr:any;

/**
 * 环境初始化，判断URL是否存在钉钉应用corpID 和 钉钉的环境JS是否加载成功
 * 同时还判断一下当前环境是否为钉钉环境
 *
 * @returns 返回真代表当前是在钉钉环境中，返回假的话就是在其他浏览器中
 */
export function environment(): Promise<unknown> {

	return new Promise((resolve, reject) => {

		if (process.env.NODE_ENV == "development") {
			/**
			 * 
			 * 如果当前在开发环境中且不在钉钉容器里面，直接返回成功
			 * 开发阶段会直接在环境中置入用户信息，不需要考虑登录
			 * 
			 */
			if (dd.env.platform == "notInDingTalk") {
				return resolve();
			}
		} else {

			if (typeof dd == "undefined" || dd.env.platform == "notInDingTalk") {
				if (window.urlSearch.user == String.Empty) {
					isLogin().then(() => {
						resolve();
					}).catch((error) => {
						reject();
					})
					return;
				} else {
					document.cookie = "appToken=;path=/;max-age=-1";
					return resolve();
				}
			}

		}



		const { corpId } = window.urlSearch;
		dd.runtime.permission.requestAuthCode({
			corpId
		}).then((result: any) => {
			const { code } = result;
			dd.code = code;
			resolve()
		}).catch(() => {
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

		isLogin().then((data) => {
			if (data) {
				return resolve();
			}

			const { code = String.Empty } = dd;
			const { corpId, user } = window.urlSearch;


			let asyncLog;

			if (corpId != String.Empty && code != String.Empty) {
				asyncLog = login(code);
			} else {
				asyncLog = tokenLogin(user);
			}

			asyncLog.then((data: any) => {
				Object.assign(userInfo, data);
				resolve();

			}).catch((error)=>{
				loginErr = error;
				reject();
			});

		})

	})
}

/**
 * 判断当前是否登录
 * @returns 
 */
export function isLogin(): Promise<any> {
	return getInfo().then((data: any) => {

		userInfo.name = data.name;

		return true;

	}).catch(() => {

		return false

	})
}



/**
 * 取出当前用户信息
 * @returns 
 */
export function getUserInfo(): userInfo {
	return userInfo;
	const value: string = localStorage.getItem(TokenKey) || "";

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


export function getError(){
	return loginErr.msg || loginErr.message || "请稍后刷新页面重试"
}


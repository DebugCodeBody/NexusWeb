
const TokenKey = 'User-Info'


/**
 * 判断一下当前是否登录成功了
 * 取出用户信息，判断当前的empid、userid、nam 三个属性是否全都存在
 * 
 * @returns 
 */
export function islogin(){
  const info = getUserInfo();

  return info && info.empid && info.userid && info.name && info.fcardid
}


export function getUserInfo() {
    const retVal = localStorage.getItem(TokenKey);
    try {
        return JSON.parse(retVal);
    } catch (error) {
        return {};
    }
}

export function getUserName() {
  return getUserInfo().name;
}

export function getempid() {
  return getUserInfo().empid;
}

export function getfcardid() {
  return getUserInfo().fcardid;
}

export function setUserInfo(Info) {
  return localStorage.setItem(TokenKey, JSON.stringify(Info))
}

export function removeUserInfo() {
  return localStorage.removeItem(TokenKey)
}

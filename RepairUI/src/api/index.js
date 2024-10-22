import request from "@/utils/request";


/**
 * 获取当前钉钉用户名字
 * @param {*} code 
 * @returns 
 */
export function getDeclareName(code, corpId) {
  return request({
    url: "getDeclareName",
    params: { code, corpId }
  });
}

/**
 * 获取指定机器名字和故障列表
 * @param {*} mid 
 * @returns 
 */
export function getDescribe(mid) {
  return request({
    url: "getDescribe",
    params: { mid }
  });
}



/**
 * 
 * @param {*} name 申报人员
 * @param {*} mid 设备ID
 * @param {*} tid 错误ID
 * @param {*} machinename 设备名字 
 * @param {*} typename 错误类型
 * @param {*} memo 问题描述
 * @returns 
 */
export function addProblem(name, mid, tid, machinename, typename, memo) {
  return request({
    url: "addProblem",
    method: "post",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let et in data) {
        ret += et + '=' + encodeURIComponent(data[et]) + '&'
      }

      return ret.slice(0, ret.length - 1);
    }],

    data: { name, mid, typename, memo, tid, machinename }
  });
}

export function getToUrls(name) {
  return request({
    url: "/tourl/list",
    params: {
      name
    }
  });
}

export function getCorpId() {
  return request({
    url: "../auth/corpid",
  });
}

export function addToUrlCount(id,name) {
  return request({
    url: "/tourl/add",
    params: {
      id,
      name
    }
  });
}
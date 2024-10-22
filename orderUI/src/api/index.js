import require from "@/utils/require.js";
import { generateFood  } from "@/utils/processFood";

export function login(code) {
  return require({
    url: "/getuserinfo",
    method: "get",
    params: { code }
  });
}

export function assignLog(user){
  return require({
    url: "/getassigninfo",
    method: "get",
    params: { user }
  });

}

export function getorderlist(date) {
  return require({
    url: "/getorderlist",
    params: { date }
  })
}

/**
 * 提交点餐
 * @param {*} empid 员工 empid
 * @param {*} date 点餐时间
 * @param {*} data 点餐数据
 * @returns 
 */
export function submitorder(empid, date, data) {
  let food = [];
  for (const [key, value] of Object.entries(data)) {
    if (value.length > 0) {
      food = food.concat(
        value.map(elem => {
          return generateFood(key, elem);
        })
      );
    }
  }

  return require({
    url: "/submitorder",
    method: "post",
    data: {
      empid,
      date,
      food
    }
  });
}

/**
 * 获取某一天的已经点过的菜单
 * @param {*} empid 
 * @param {*} date 
 * @returns 
 */
export function getdatefood(empid, date) {
  if(!empid){
    return Promise.reject();
  }
  return require({
    url: "/getdatefood",
    params: { empid, date }
  })
}


export function gettotlecost(empid){
  return require({
    url: "/gettotlecost",
    params: { empid }
  })
}


export function submitadvice(name,empid,text){
  return require({
    url:"submitadvice",
    method: "post",
    data:{name,empid,text}
    
  })

}

export function getMuneLicense(empid){
  return require({
    url: "/mune/license",
    params: {empid}
  })
}
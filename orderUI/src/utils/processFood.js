const time = {
  break: 1,
  lunch: 2,
  night: 3,
  midnight: 4,
  "1": "break",
  "2": "lunch",
  "3": "night",
  "4": "midnight"
};
const nameTime = {
  "早餐": "break" ,
  "中餐": "lunch" ,
  "晚餐": "night" ,
  "夜宵": "midnight",

  "break": "早餐" ,
  "lunch": "中餐" ,
  "night": "晚餐" ,
  "midnight": "夜宵",
};

/**
 * 菜单列表排序
 * @param {*} data 
 * @returns 
 */
export function FoodProcess(data) {
    if(!Array.isArray(data)){
        return data;
    }

  const Belong = {};
  if (data.length > 0) {
    let id = 0;

    /**
     * 
     * ftype 字段为夜宵的字段的菜品
     * 
     */
    const taken = [];

    data.forEach(elem => {
      elem["break"] = {};
      elem["lunch"] = {};
      elem["night"] = {};
      elem["midnight"] = {};

      elem["break"].lock = false;
      elem["lunch"].lock = false;
      elem["night"].lock = false;
      elem["midnight"].lock = false;

      elem.id = ++id;
      data.id = elem.id;
      elem.lock = false;
      elem.fprice = parseFloat(elem.fprice);


      let ftype = elem.ftype;
      if (ftype != "主食") {
        elem.mtype = elem.mtype.split(";").filter(value => value != "");

        if(elem.mtype.length == 1 && elem.mtype[0] == "夜宵"){
          taken.push(elem);
        }

        if(elem.mtype.length >= 3 && elem.mtype.indexOf("早餐") == -1){
          ftype = "餐餐有"
        }

        

      } else {
        elem.fnamespice = elem.fname;
        elem.mtype = ["中餐", "晚餐", "夜宵"];
      }

      Belong[ftype] = Belong[ftype] || [];
      Belong[ftype].push(elem);
    });

    
    // 把夜宵里的菜和普通的菜进行对比，然后合并
    
    taken.forEach((elem)=>{

      Belong["菜"].find((item)=>{

        if(item.fid === elem.fid && item.fnamespice == elem.fnamespice){

          item.mtype = item.mtype.concat(elem.mtype)
          return true;

        }

      })

    })
    
    
    Belong["主食"].sort((a, b) => {
      return a.fprice - b.fprice;
    });
    Belong["主食"].sort((a, b) => {
      return a.fnamespice.indexOf("米饭") - b.fnamespice.indexOf("米饭");
    });

    Belong["菜"] = sortFood(Belong["菜"],"辣");
    Belong["餐餐有"] = sortFood(Belong["餐餐有"],"辣");
    Belong["汤"] = sortFood(Belong["汤"],"无调料");
    Belong["蔬菜"] = sortFood(Belong["蔬菜"],"无调料");
    Belong["小吃"] = sortFood(Belong["小吃"]);

    


  }

  return Belong;
}

/**
 * 生成一个可以供数据库插入的数组
 * @param {*} name 时间
 * @param {*} item 菜品
 * @returns
 */
export function generateFood(name, item) {
  return {
    fid: item.shopp.fid,
    fmtime: time[name],
    fqty: item.num,
    spice: item.shopp.spice || "",
    fcategory: item.shopp.fcategory,

    fprice_pack: item.packag ? 0.5 : 0
  };
}

export function processHistory(history) {
  return history.map(elem => {
    elem.time = time[elem.fmtime];
    return elem;
  });

}

/**
 * 判断一下啥时候点了菜但是没有点主食的
 * @param {*} data 
 * @returns 
 */
export function selectRice(data){
  
  const retVal = [];
  for(const [key,value] of Object.entries(data)){

    if(key == "break"){
      continue;
    }

    if(value.length == 0 )continue;

      const item = value.find((food)=>{
        return food.shopp.ftype == "主食";
      })
  
      if(!item){
        retVal.push(nameTime[key])
      }

  }


  return retVal;
}


/**
 * 判断一下啥时候点主食但是没有点菜的
 * @param {*} data 
 * @returns 
 */
export function selectFood(data){
  const retVal = [];
  for(const [key,value] of Object.entries(data)){
    if(key == "break"){
      continue;
    }

    if(value.length == 0 )continue;

      const item = value.find((food)=>{
        return food.shopp.ftype == "菜" || food.shopp.ftype == "餐餐有";
      })
  
      if(!item){
        retVal.push(nameTime[key])
      }

  }


  return retVal;
}




/**
 * 排序餐餐有和菜
 * 主要是辣味排序
 * @param {*} data 
 * @param {*} keyword 要排序的关键字
 */
function sortFood(data,keyword){
  if(!data){
    return;
  }

  let food = {};

  data.forEach((elem)=>{
    if(!food[elem.fname]){
      food[elem.fname] = [];
    }
    food[elem.fname].push(elem);
  })

  food = Object.values(food).sort((a,b)=>{
    return a[0].fprice - b[0].fprice 
  })

  if(keyword){
    food.forEach((elem)=>{
      elem.sort((a,b)=>{
        return a.fnamespice.indexOf(keyword) - b.fnamespice.indexOf(keyword)
      })

    })
  }
  return [].concat.apply([],food)
  

}













